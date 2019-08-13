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
import { RelationOption } from '../type/options/relations.options';
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
   *
   * @deprecated 可能无用
   * @template D
   * @template K
   * @param {Type<HttpClientItemConfig<D, K>>} ItemConfig
   * @returns
   * @memberof CyiaHttpService
   */
  injectUse<D, K>(ItemConfig: Type<HttpClientItemConfig<D, K>>) {
    let instance = new ItemConfig()
    // return instance
    let obj = {}
    return {
      default: () => this.requestEnity(instance.defalut),
      ...this.transformSub(instance.sub, instance.defalut),
    }
  }
  /**
   * ?是否需要?url前缀,对不同的url有不同的反应,
   * @deprecated 可能无用
   * @private
   * @template T
   * @param {HttpClientItemConfigBase<T>} config
   * @param {HttpClientItemConfigBase<T>} [defaultConfig]
   * @returns {Observable<T>}
   * @memberof CyiaHttpService
   */
  private requestEnity<T>(config: HttpClientItemConfigBase<T>, defaultConfig?: HttpClientItemConfigBase<T>): Observable<T> {
    let method: HttpMethod = config.requestConfig.method || (defaultConfig ? defaultConfig.requestConfig.method : 'get');
    let url = this.mergeUrlList(defaultConfig ? defaultConfig.requestConfig.url : '', config.requestConfig.url)
    let options = config.requestConfig.options
    return this.http.request(method, url, options).pipe(take(1)) as any

  }
  /**
   *
   * @deprecated 可能无用
   * @template T
   * @template D
   * @param {T} obj
   * @param {D} defalut
   * @returns
   * @memberof CyiaHttpService
   */
  transformSub<T, D>(obj: T, defalut: D) {
    let temp: { [P in keyof T]: () => Observable<T[P] extends HttpClientItemConfigBase<any> ? InstanceType<T[P]['responseConfig']> : Object> } = {} as any
    for (const name in obj) {
      if (!obj.hasOwnProperty(name)) continue
      const config: any = obj[name]
      let a: any = () => this.requestEnity(config, defalut as any)
      temp[name] = a
    }
    return temp
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

  /**
   * !实验
   *
   * @param {HttpRequestConfig} params
   * @param {RegisterEntityOption} defalutEntityArgs
   * @param {boolean} [active=false]
   * @returns
   * @memberof CyiaHttpService
   */
  sourceByrequest(params: HttpRequestConfig, defalutEntityArgs: RegisterEntityOption, active = false) {
    let method: HttpMethod = params.method || defalutEntityArgs.options.request.method

    let url = this.mergeUrlList(defalutEntityArgs.options.request.url, params.url)
    let options = Object.assign({}, params.options, defalutEntityArgs.options.request.options)
    for (const key in options) options[key] = Object.assign({}, defalutEntityArgs.options.request.options[key], options[key])
    console.log(url);
    return this.http.request(method, url, options).pipe(take(1), map((res) => {
      if (res instanceof Array) {
        return res.map((item) => stronglyTyped(item, defalutEntityArgs.entity))
      } else {
        let instance = stronglyTyped(res, defalutEntityArgs.entity)
        if (active)
          this.setRelatins(instance, defalutEntityArgs.entity)
        return instance
      }
    }))
    // let options = params.options
  }
  /**
   * !实验
   *
   * @template T
   * @param {Type<T>} entity
   * @returns {(param: HttpRequestConfig) => Observable<T>}
   * @memberof CyiaHttpService
   */
  getEntity<T>(entity: Type<T>): (param: HttpRequestConfig) => Observable<T> {
    console.log('请求匹配', CyiaHttpService.entityList);
    let item = CyiaHttpService.entityList.find((item) => item.entity == entity)
    throwIf(!item, '未查找到实体')
    return (param) => {
      return this.sourceByrequest(param, item, true) as any
      // .pipe(map((val) => {
      //   console.log(val);

      // }))
      //  as any
    }
  }

  /**
   * ! 实验
   *
   * @template T
   * @param {T} instance
   * @param {Type<T>} entity
   * @memberof CyiaHttpService
   */
  setRelatins<T>(instance: T, entity: Type<T>) {
    CyiaHttpService.relations
      .filter(({ target }) => target == entity)
      .find(async (relation) => {
        switch (relation.name) {
          case RelationType.OneToOne:
            let inverse = relation.inverseFn()
            let item = CyiaHttpService.entityList.find((item) => item.entity == inverse)
            let res = await this.sourceByrequest({}, item).toPromise()
            instance[relation.propertyName] = res
            // console.log('被动查询返回', res);
            break;

          default:
            break;
        }
        // console.log('关系', relation.target, instance, entity);

      })
  }

  getEntity2<T>(entity: Type<T>): (param: HttpRequestConfig) => Observable<T> {
    let entityConfig = CyiaHttpService.getEntityConfig(entity)
    throwIf(!entityConfig.entity, '未查找到实体')
    //  let a=
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
        return (param: HttpRequestConfig) => this.sourceByrequest2(param, entity)
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
      console.log(relation, i);
      switch (relation.name) {
        case RelationType.OneToOne:
          //doc 获得纯数据,先从缓存列表中找,再从请求中找
          let implementationResult = this.oneToOneImplementation(result, relation.propertyName, primaryKey, inverse)
          //doc 如果没有值就说明已经处理了不需要下一步
          if (!implementationResult) continue
          //doc 如果没有匹配完全但是是普通的,也不会处理
          if (inverseEntityConfig.entity.options.method == Source.normal) continue
          let inverseData = await this.getData(inverseEntityConfig.entity)({
            options: {
              //todo 目前针对这三个参数,也可以更多,全部动态?
              params: inverseEntityConfig.entity.relationOptions.params(implementationResult),
              headers: inverseEntityConfig.entity.relationOptions.header(implementationResult),
              body: inverseEntityConfig.entity.relationOptions.body(implementationResult)
            }
          } as HttpRequestConfig).toPromise()
          implementationResult = this.oneToOneImplementation(implementationResult, relation.propertyName, primaryKey, inverse)
          break;
        case RelationType.OneToMany:
          await this.oneToManyImplementation(result, primaryKey, relation, inverseEntityConfig)
          break
        default:
          break;
      }
    }
    return result
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
  oneToOneImplementation(data: any, key: string, primaryKey: string, inverseEntity);
  oneToOneImplementation<I>(data: any[], key: string, primaryKey: string, inverseEntity: Type<I>) {
    let result = []
    data = transform2Array(data)
    data.forEach((item) => {
      /**主键的值 */
      let primaryValue = item[primaryKey];
      let inverseEntityData = this.getEntityRepository(inverseEntity)
      if (inverseEntityData[primaryValue]) {
        item[key] = stronglyTyped(inverseEntityData[primaryValue], inverseEntity)
      } else {
        result.push(item)
      }
    })
    return result.length ? result : null
  }
  // oneToManyImplementation();
  async oneToManyImplementation<I>(result, primaryKey: string, targetRelation: EntityConfig['relations'][0], inverseEntityConfig: EntityConfig) {
    let unFindList = []
    // console.log(inverseEntityConfig);
    let inverseInstanceList = stronglyTyped(Object.values(this.getEntityRepository(inverseEntityConfig.entity.entity)), inverseEntityConfig.entity.entity)
    // console.log('实例列表', inverseInstanceList);
    transform2Array(result)
      .forEach((item) => {
        let primaryValue = item[primaryKey]
        let inverseInstance = inverseInstanceList.find((inverseInstance) => primaryValue == targetRelation.inverseValueFn(inverseInstance))
        // console.log(inverseInstance);
        if (inverseInstance) {
          item[targetRelation.propertyName] = inverseInstance
        } else {
          unFindList.push(item)
        }
      })
    if (!unFindList.length) return
    // console.log('实例列表', inverseInstanceList, this.getEntityRepository(inverseEntityConfig.entity.entity), inverseEntityConfig.entity.entity);
    await this.getData(inverseEntityConfig.entity)({}).toPromise()
    inverseInstanceList = stronglyTyped(Object.values(this.getEntityRepository(inverseEntityConfig.entity.entity)), inverseEntityConfig.entity.entity)
    unFindList
      .forEach((item) => {
        let primaryValue = item[primaryKey]
        let inverseInstance = inverseInstanceList.filter((inverseInstance) => primaryValue == targetRelation.inverseValueFn(inverseInstance))
        if (inverseInstance.length) {
          item[targetRelation.propertyName] = inverseInstance
        } else {
          unFindList.push(item)
        }
      })
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
  sourceByrequest2(params: HttpRequestConfig, defalutEntityArgs: RegisterEntityOption) {
    /**类中设置的默认参数HttpRequestConfig */
    const defalutParams = defalutEntityArgs.options.request
    let method: HttpMethod = params.method || defalutParams.method
    let url = this.mergeUrlList(defalutParams.url, params.url)
    let options = Object.assign({}, params.options, defalutParams.options)
    for (const key in options) options[key] = Object.assign({}, defalutParams.options ? defalutParams.options[key] : undefined, options ? params.options[key] : undefined)
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
    console.log('保存实体', obj, entity);
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
    console.log(entity.constructor);
    CyiaHttpService.savePlainData(data, entity.constructor)
  }
}
