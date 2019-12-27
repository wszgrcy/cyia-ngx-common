import { Injectable, Inject, Type, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST, REQUEST_URLPREFIX } from './http.token';
import { RequestItem, HttpRequestItem, HttpUrl, HttpMethod, HttpRequestConfig } from './http.define';
import { _deepCloneObject } from '../object/deepassign';
import { Observable, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { RegisterEntityOption } from '../type/options/register-entity.options';
import { throwIf } from '../util/throw-if';
import { stronglyTyped } from '../util/strongly-typed';
import { RelationType } from '../type/relation.type';
import { RelationOption, RelationMatchingMode } from '../type/options/relations.options';
import { EntityConfig } from '../type/entity.config';
import {
  ENTITY_SYMBOL,
  RELATION_SYMBOL,
  PRIMARY_COLUMN_SYMBOL,
  REPOSITORY_SYMBOL,
  ENTITY_COLUMN_SYMBOL
} from '../symbol/entity.symbol';
import { Source } from '../type/options/entity.options';
import { transform2Array } from '../util/transform2array';
import { from } from 'rxjs';
import { Repository } from './repository';
import { DataSourceByRequest } from './data-source/data-souce-by-request';
import { EntityConfigRepository } from './entity-config-repository';
import { DataSource } from './data-source/data-source';

/**
 * 1. 被动调用时参数传递 使用函数,传入上一级数据,进行判断
 * 2. 使用主键
 * 3. 请求时保存纯数据,在构造后进行类型化
 * 4. 正常请求数据时,不会请求仓库,关联请求时优先仓库,没有再请求,需要指定关联时默认优先级(一对多在请求仓库时可能会造成数据不够)
 * 5. 其他装饰器可以继承,主键会被二次覆盖(不写的话就是继承的)
 * 6. 请求头/查询字符串参数是对象类型,body一般是对象类型,但是也有特异型
 * 7. 多层级结构化,传入的数据不一定只是一个实体,可能实体中嵌套实体,需要对每个进行判断(实体属性装饰器)
 *  对数组操作后返回是否仍然是一个顺序
 * 从仓库中获取,转换为数组
 *
 */
/**
 * doc 对于body,直接替换,不搞其他方法,因为不同原因太过复杂,不考虑
 */
@Injectable()
export class CyiaHttpService {
  constructor(
    @Optional() @Inject(REQUEST_LIST) private requestList: RequestItem[] = [],
    @Optional() @Inject(REQUEST_URLPREFIX) private urlprefix: string = '',
    public http: HttpClient
  ) {}

  /**
   * 获得实体的一些配置
   *
   *
   * @template T
   * @memberof CyiaHttpService
   */
  static getEntityConfig<T>(entity: Type<T>): EntityConfig {
    return {
      entity: Reflect.getMetadata(ENTITY_SYMBOL, entity),
      relations: Reflect.getMetadata(RELATION_SYMBOL, entity) || [],
      primaryKey: Reflect.getMetadata(PRIMARY_COLUMN_SYMBOL, entity),
      entityColumns: Reflect.getMetadata(ENTITY_COLUMN_SYMBOL, entity) || []
    };
  }
  /**
   * 保存纯数据
   * 只有实体是手动添加(normal)或请求(request)才会保存
   *
   * @template T
   * @memberof CyiaHttpService
   */
  static savePlainData<T>(data, entity: Type<T>) {
    const entityConfig = CyiaHttpService.getEntityConfig(entity);
    if (entityConfig.entity.options.method === Source.normal || entityConfig.entity.options.method === Source.request) {
      data = transform2Array(data);
      const obj = Reflect.getOwnMetadata(REPOSITORY_SYMBOL, entity) || {};
      (<any[]>data)
        // .filter((item) => item[entityConfig.primaryKey] != undefined)
        .forEach((item) => {
          obj[item[entityConfig.primaryKey] || `${Math.random()}`] = Object.assign({}, item);
        });
      Reflect.defineMetadata(REPOSITORY_SYMBOL, obj, entity);
    }
  }
  /**
   * normal模式下使用,手动添加实例
   *
   * @memberof CyiaHttpService
   */
  static addToRepository(data) {
    data = transform2Array(data);
    const entity = Object.getPrototypeOf(data[0]);
    CyiaHttpService.savePlainData(data, entity.constructor);
  }

  /**
   * 传入请求
   * @deprecated 不推荐使用
   * @param  httpRequestConfig
   * @returns
   * @memberof CyiaHttp
   */
  // @CloneParam<CyiaHttpService>()
  request(httpRequestConfig: HttpRequestItem): Observable<any> {
    /**请求接口 */
    let httpRequestItem: HttpRequestItem = null;
    /**查看请求前缀地址 */
    const requestItem: RequestItem = this.requestList.find((listVal) => {
      httpRequestItem = listVal.apiList.find((itemVal) => itemVal.token === httpRequestConfig.token) as HttpRequestItem;
      if (httpRequestItem) {
        return true;
      }
      return false;
    }) as RequestItem;

    if (!requestItem || !httpRequestItem) {
      return;
    }
    const obj = _deepCloneObject<HttpRequestItem>({}, httpRequestItem, httpRequestConfig);
    obj.url = this.mergeUrl(requestItem.prefixurl, obj.url, obj.suffix);
    return this.http.request(obj.method, obj.url, obj.options);
    // doc未找到返回
  }

  /**
   * @description 合并请求url
   * @author cyia
   * @date 2018-09-15
   * @param prefix
   * @param middle
   * @param [suffix='']
   * @memberof CyiaHttpService
   */
  private mergeUrl(prefix: HttpUrl, middle: HttpUrl, suffix: HttpUrl = '') {
    const prefixEnd = /\/$/.test(prefix);
    const middleStart = /^\//.test(middle);
    const middleEnd = /\/$/.test(middle);
    const suffixStart = /^\//.test(suffix);
    if (prefixEnd && middleStart) {
      const tmp = middle.split('');
      tmp.shift();
      middle = tmp.join('');
    } else if (!prefixEnd && !middleStart) {
      const tmp = middle.split('');
      tmp.unshift('/');
      middle = tmp.join('');
    }
    if (middleEnd && suffixStart) {
      const tmp = suffix.split('');
      tmp.shift();
      suffix = tmp.join('');
    } else if (!middleEnd && !suffixStart) {
      const tmp = suffix.split('');
      tmp.unshift('/');
      suffix = tmp.join('');
    }
    return [prefix, middle, suffix].join('');
  }

  /**
   * url路径合并
   * doc 如果有http/https前缀,那么在这个之前的都会被覆盖掉
   * @memberof CyiaHttpService
   */
  mergeUrlList(...list: string[]) {
    return list
      .filter((url) => url)
      .reduce((pre, cur, i) => {
        if (/^https?:\/\//.test(cur)) {
          pre = '';
        }

        if (pre && pre.endsWith('/') && cur.startsWith('/')) {
          return `${pre}${cur.substr(1)}`;
        } else if (pre && !pre.endsWith('/') && !cur.startsWith('/')) {
          return `${pre}/${cur}`;
        } else {
          return `${pre}${cur}`;
        }
      }, '');
  }

  /**
   *
   *
   * @author cyia
   * @date 2019-10-13
   *
   * @param entity 定义的实体
   * @param fn 获得数据的函数
   * @returns
   */

  getEntity<T>(entity: Type<T>): (param?: HttpRequestConfig | any[]) => Observable<T> {
    return (param) => {
      const dataSource = new DataSourceByRequest(
        this.http,
        this.urlprefix,
        EntityConfigRepository.get(entity).entity.options.request,
        param
      );
      const repository = new Repository(entity, this.http, this.urlprefix);
      repository.setDataSource(dataSource);
      return repository.find(param);
    };
    // return this._getEntity(entity, (entityConfig, param) => this.getData(entityConfig.entity)(param));
  }
  getEntityList<T>(entity: Type<T>): (param: HttpRequestConfig | any[]) => Observable<T[]> {
    return this.getEntity(entity) as any;
  }

  getRepository(entity: Type<any>, dataSource: DataSource) {
    const repository = new Repository(entity, this.http, this.urlprefix);
    repository.setDataSource(dataSource);
    return repository;
  }
}
