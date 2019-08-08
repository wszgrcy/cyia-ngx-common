import { Injectable, Inject, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST } from './http.token';
import { RequestItem, HttpRequestItem, HttpUrl, HttpMethod, HttpRequestConfig } from './http.define';
import { _deepCloneObject } from '../object/deepassign';
import { Observable } from 'rxjs';
import { HttpClientItemConfig, HttpClientItemConfigBase } from './http.class';
import { take, map } from "rxjs/operators";
// import { CloneParam } from '../decorator/cloneParam.decorator';
import { RegisterEntityOption } from "../type/options/register-entity.options";
import { throwIf } from '../util/throw-if';
import { stronglyTyped } from '../util/response-realize';
import { RelationType } from '../type/relation.type';
import { RelationOption } from '../type/options/relations.options';

/**
 * todo 1.被动调用时参数传递
 * todo 2.使用主键还是增加参数指定匹配相等
 */
@Injectable()
export class CyiaHttpService {
  static relations: RelationOption[] = []
  static entityList: RegisterEntityOption[] = []
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
            console.log('被动查询返回', res);
            break;

          default:
            break;
        }
        console.log('关系', relation.target, instance, entity);

      })
  }

}
