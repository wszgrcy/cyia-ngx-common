import { Injectable, Inject, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST } from './http.token';
import { RequestItem, HttpRequestItem, HttpUrl, HttpMethod, HttpRequestConfig } from './http.define';
import { _deepCloneObject } from '../object/deepassign';
import { Observable, Subject, of } from 'rxjs';
import { HttpClientItemConfig, HttpClientItemConfigBase } from './http.class';
import { take, map, tap, switchMap } from "rxjs/operators";
// import { CloneParam } from '../decorator/cloneParam.decorator';
import { RegisterEntityOption } from "../type/options/register-entity.options";
import { throwIf } from '../util/throw-if';
import { stronglyTyped } from '../util/response-realize';
import { RelationType } from '../type/relation.type';
import { RelationOption, RelationMatchingMode } from '../type/options/relations.options';
import { EntityConfig } from '../type/entity.config';
import { ENTITY_SYMBOL, RELATION_SYMBOL, PRIMARY_COLUMN_SYMBOL, REPOSITORY_SYMBOL } from '../symbol/entity.symbol';
import { Source } from '../type/options/entity.options';
import { transform2Array } from '../util/transform2array';
import { from } from 'rxjs';

/**
 *  todo  1.被动调用时参数传递(一般都属于字典表,剩下部分?)
 *  2.使用主键
 *  todo 请求时保存纯数据,在构造后进行类型化
 *  正常请求数据时,不会请求仓库,关联请求时优先仓库,没有再请求
 * 仓库不能被污染
 * 仓库保存的是这个实体的
 * 其他装饰器可以继承,主键会被二次覆盖(不写的话就是继承的)
 * 请求头/查询字符串参数是对象类型,body一般是对象类型,但是也有特异型
 */

@Injectable()
export class CyiaHttpService {
  static relations: RelationOption[] = []
  static entityList: RegisterEntityOption[] = []
  static columns = []
  static registerEntity(options: RegisterEntityOption) {
    CyiaHttpService.entityList.push(options)
  }
  constructor(
    @Inject(REQUEST_LIST) private requestList: RequestItem[],
    private http: HttpClient
  ) { }

  /**
   *传入请求
   *
   * @param  httpRequestConfig
   * @returns
   * @memberof CyiaHttp
   */
  // @CloneParam<CyiaHttpService>()
  request(httpRequestConfig: HttpRequestItem): Observable<any> {
    /**请求接口 */
    let httpRequestItem: HttpRequestItem = null;
    /**查看请求前缀地址 */
    let requestItem: RequestItem = this.requestList.find((listVal) => {
      httpRequestItem = listVal.apiList.find((itemVal) => itemVal.token === httpRequestConfig.token
      ) as HttpRequestItem;
      if (httpRequestItem) return true;
      return false;
    }) as RequestItem;

    if (!requestItem || !httpRequestItem) {
      return;
    }
    let obj = _deepCloneObject<HttpRequestItem>({}, httpRequestItem, httpRequestConfig);
    obj.url = this.mergeUrl(requestItem.prefixurl, obj.url, obj.suffix)
    return this.http.request(obj.method, obj.url, obj.options)
    //doc未找到返回
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
    let prefixEnd = /\/$/.test(prefix);
    let middleStart = /^\//.test(middle)
    let middleEnd = /\/$/.test(middle)
    let suffixStart = /^\//.test(suffix)
    if (prefixEnd && middleStart) {
      let tmp = middle.split('')
      tmp.shift()
      middle = tmp.join('')
    } else if (!prefixEnd && !middleStart) {
      let tmp = middle.split('')
      tmp.unshift('/')
      middle = tmp.join('')
    }
    if (middleEnd && suffixStart) {
      let tmp = suffix.split('')
      tmp.shift()
      suffix = tmp.join('')
    } else if (!middleEnd && !suffixStart) {
      let tmp = suffix.split('')
      tmp.unshift('/')
      suffix = tmp.join('')
    }
    return [prefix, middle, suffix].join('')
  }


  /**
   * url路径合并
   *
   * @param {...string[]} list
   * @returns
   * @memberof CyiaHttpService
   */
  mergeUrlList(...list: string[]) {
    return list.filter((url) => url)
      .reduce((pre, cur, i) => {
        if (pre && pre.endsWith('/') && cur.startsWith('/')) {
          return `${pre}${cur.substr(1)}`
        } else if (pre && !pre.endsWith('/') && !cur.startsWith('/')) {
          return `${pre}/${cur}`
        } else {
          return `${pre}${cur}`
        }
      }, '')
  }


  getEntity<T>(entity: Type<T>): (param: HttpRequestConfig) => Observable<T> {
    let entityConfig = CyiaHttpService.getEntityConfig(entity)
    throwIf(!entityConfig.entity, '未查找到实体')
    return (param?) => {
      return this.getData(entityConfig.entity)(param)
        .pipe(
          switchMap((res) => from(this.relationsImplementation(res, entityConfig.relations, entityConfig.primaryKey))),
          map((res) => stronglyTyped(res, entityConfig.entity.entity))
        )
    }
  }
  getData(entity: EntityConfig['entity']) {
    switch (entity.options.method) {
      case Source.request:
        return (param: HttpRequestConfig) => this.sourceByrequest(param, entity)
      case Source.normal:
        return () => of(this.getEntityRepository(entity.entity)).pipe(take(1))
    }
  }
  /**
   * 关联实现
   * todo 使用返回数据查找剩余
   * @param {*} result
   * @param {EntityConfig['relations']} relations
   * @param {EntityConfig['primaryKey']} primaryKey
   * @memberof CyiaHttpService
   */
  async relationsImplementation(result, relations: EntityConfig['relations'], primaryKey: EntityConfig['primaryKey']) {
    for (let i = 0; i < relations.length; i++) {
      const relation = relations[i];
      let inverse = relation.inverseFn()
      // let inverseValue = relation.inverseValueFn ? relation.inverseValueFn() : null
      let inverseEntityConfig = CyiaHttpService.getEntityConfig(inverse)
      switch (relation.name) {
        case RelationType.OneToOne:
          await this.oneToOneImplementation(result, primaryKey, relation, inverseEntityConfig)
          break;
        case RelationType.OneToMany:
          await this.oneToManyImplementation(result, primaryKey, relation, inverseEntityConfig)
          break
        case RelationType.ManyToOne:
          await this.ManyToOneImplementation(result, primaryKey, relation, inverseEntityConfig)
          break
        default:
          break;
      }
    }
    return result
  }
  /**
   * 需要找对应关系,但是不能直接传参使用这个方法
   *
   * @param {EntityConfig} entityConfig
   * @param {*} implementationResult
   * @returns
   * @memberof CyiaHttpService
   */
  private async  getDataByRelation(entityConfig: EntityConfig, implementationResult) {
    return this.getData(entityConfig.entity)(entityConfig.entity.relationOptions ? await entityConfig.entity.relationOptions(implementationResult) : {}).toPromise()
  }
  /**
   * 一对一不是加在主键上,而是加在一对一关系上
   * 一对一关系实现
   * 引用改变
   * @param {*} data 主数据
   * @param {string} key 附加数据键
   * @param {string} primaryKey 主键
   * @param {*} inverseEntity 一对一实体
   * @memberof CyiaHttpService
   */
  async  oneToOneImplementation<I>(data: any[], primaryKey: string, targetRelation: EntityConfig['relations'][0], inverseEntityConfig: EntityConfig) {
    return this.generalRelationImplementation(data, primaryKey, targetRelation, inverseEntityConfig, (inverseMap) => (item, primaryValue) => {
      if (inverseMap[primaryValue]) {
        item[targetRelation.propertyName] = stronglyTyped(inverseMap[primaryValue], inverseEntityConfig.entity.entity)
      } else
        return true
      return false
    }, { relationMatchingMode: RelationMatchingMode.auto })
  }
  /**
   * 多对一, item的某个键值,等于另一个的主键
   *
   *
   * @param {*} data 主数据
   * @param {string} key 附加数据键
   * @param {string} primaryKey 主键
   * @param {*} inverseEntity 一对一实体
   * @memberof CyiaHttpService
   */
  async  ManyToOneImplementation<I>(data: any[], primaryKey: string, targetRelation: EntityConfig['relations'][0], inverseEntityConfig: EntityConfig) {
    return this.generalRelationImplementation(data, primaryKey, targetRelation, inverseEntityConfig, (inverseMap) => (item, primaryValue) => {
      if (inverseMap[item[targetRelation.propertyName]]) {
        item[targetRelation.propertyName] = stronglyTyped(inverseMap[item[targetRelation.propertyName]], inverseEntityConfig.entity.entity)
      } else
        return true
      return false
    }, { relationMatchingMode: RelationMatchingMode.auto })
  }
  /**
   * 查找匹配->如果没找到请求(相同)->继续匹配->不管找没找到都结束
   *        -> 找到结束
   * todo 一对多下,先从已请求的数据中查找可能不一定完全对应上
   * todo 1.是否在查找不到继续请求,2.是否直接从请求中查找,3.先查找,查找不到再请求(一对多可能丢失)
   * @template I
   * @param {*} result
   * @param {string} primaryKey
   * @param {EntityConfig['relations'][0]} targetRelation
   * @param {EntityConfig} inverseEntityConfig
   * @memberof CyiaHttpService
   */
  async oneToManyImplementation<I>(result, primaryKey: string, targetRelation: EntityConfig['relations'][0], inverseEntityConfig: EntityConfig) {
    return this.generalRelationImplementation(result, primaryKey, targetRelation, inverseEntityConfig, (inverseMap) => {
      let inverseInstanceList = stronglyTyped(Object.values(inverseMap), inverseEntityConfig.entity.entity)
      return (item, primaryValue) => {
        /**查找到的反向的实例 */
        let inverseInstance = inverseInstanceList.filter((inverseInstance) => primaryValue == targetRelation.inverseValueFn(inverseInstance))
        if (inverseInstance.length) {
          (item[targetRelation.propertyName] = inverseInstance)
        } else return true
        return false
      }
    }, { relationMatchingMode: RelationMatchingMode.auto })
  }
  async generalRelationImplementation(data, primaryKey, targetRelation: EntityConfig['relations'][0], inverseEntityConfig: EntityConfig, relationFn: (...args) => (...args) => boolean, options: { relationMatchingMode?: RelationMatchingMode }) {
    let unFindList = []
    let inverseMap
    let matchRelation = (mainList, fn: (...args) => boolean) => mainList.filter((item) => fn(item, item[primaryKey]))
    if (options.relationMatchingMode == RelationMatchingMode.auto || options.relationMatchingMode == RelationMatchingMode.repositoryOnly) {
      inverseMap = this.getEntityRepository(inverseEntityConfig.entity.entity)
      /**反向实例列表 */
      //doc 首次匹配
      unFindList = matchRelation(transform2Array(data), relationFn(inverseMap))
    }
    if (!unFindList.length || options.relationMatchingMode == RelationMatchingMode.repositoryOnly) return
    if (options.relationMatchingMode == RelationMatchingMode.requestOnly) unFindList = transform2Array(data)
    if (options.relationMatchingMode == RelationMatchingMode.auto || options.relationMatchingMode == RelationMatchingMode.requestOnly) {
      //doc 请求数据
      await this.getDataByRelation(inverseEntityConfig, unFindList)
      //doc 返回类型强类型化
      inverseMap = this.getEntityRepository(inverseEntityConfig.entity.entity)
      //doc 获得数据后二次匹配
      matchRelation(transform2Array(unFindList), relationFn(inverseMap))
    }
  }
  /**
   * 对查找到的关系添加,未找到的作为返回值
   *
   * @param {any[]} mainList
   * @param {*} primaryKey
   * @param {Function} fn
   * @returns
   * @memberof CyiaHttpService
   */
  matchRelation(mainList: any[], primaryKey, fn: Function) {
    return mainList.filter((item) => fn(item, item[primaryKey]))
  }
  /**
   * !实验
   *
   * @param {HttpRequestConfig} params
   * @param {RegisterEntityOption} defalutEntityArgs
   * @param {boolean} [active=false]
   * @returns
   * @memberof CyiaHttpService
   */
  sourceByrequest(params: HttpRequestConfig, defalutEntityArgs: RegisterEntityOption) {
    console.log(params);
    /**类中设置的默认参数HttpRequestConfig */
    const defalutParams = defalutEntityArgs.options.request
    let method: HttpMethod = params.method || defalutParams.method
    let url = this.mergeUrlList(defalutParams.url, params.url)
    let options = Object.assign({}, params.options, defalutParams.options)
    for (const key in options) options[key] = Object.assign({}, defalutParams.options ? defalutParams.options[key] : undefined, params.options ? params.options[key] : undefined)
    return this.http.request(method, url, options).pipe(
      take(1),
      tap((res) => CyiaHttpService.savePlainData(res, defalutEntityArgs.entity))
    )
  }
  /**
   * 获得实体的一些配置
   *
   * @private
   * @template T
   * @param {Type<T>} entity
   * @returns {EntityConfig}
   * @memberof CyiaHttpService
   */
  static getEntityConfig<T>(entity: Type<T>): EntityConfig {
    return {
      entity: Reflect.getMetadata(ENTITY_SYMBOL, entity),
      relations: Reflect.getMetadata(RELATION_SYMBOL, entity),
      primaryKey: Reflect.getMetadata(PRIMARY_COLUMN_SYMBOL, entity),

    }
  }
  private getEntityRepository<T>(entity: Type<T>): { [name: string]: T } {
    return Reflect.getOwnMetadata(REPOSITORY_SYMBOL, entity) || {}
  }
  /**
   * 保存纯数据
   *
   * @private
   * @template T
   * @param {*} data
   * @param {Type<T>} entity
   * @memberof CyiaHttpService
   */
  static savePlainData<T>(data, entity: Type<T>) {
    data = transform2Array(data)
    let obj = Reflect.getOwnMetadata(REPOSITORY_SYMBOL, entity) || {};
    let entityConfig = CyiaHttpService.getEntityConfig(entity);
    // console.log(data);
    (<any[]>data)
      // .filter((item) => item[entityConfig.primaryKey] != undefined)
      .forEach((item) => {
        obj[item[entityConfig.primaryKey] || `${Math.random()}`] =
          Object.assign({}, item)
      })
    // console.log('保存实体', obj, entity);
    Reflect.defineMetadata(REPOSITORY_SYMBOL, obj, entity)
  }
  /**
   * normal模式下使用,手动添加实例
   *
   * @static
   * @param {*} data
   * @memberof CyiaHttpService
   */
  static addToRepository(data) {
    data = transform2Array(data)
    let entity = Object.getPrototypeOf(data[0])
    CyiaHttpService.savePlainData(data, entity.constructor)
  }
}
