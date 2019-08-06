import { Injectable, Inject, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST } from './http.token';
import { RequestItem, HttpRequestItem, HttpUrl, HttpMethod } from './http.define';
import { _deepCloneObject } from '../object/deepassign';
import { Observable } from 'rxjs';
import { HttpClientItemConfig, HttpClientItemConfigBase } from './http.class';
import { take } from "rxjs/operators";
// import { CloneParam } from '../decorator/cloneParam.decorator';



@Injectable()
export class CyiaHttpService {
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
     *
     * @private
     * @template T
     * @param {HttpClientItemConfigBase<T>} config
     * @param {HttpClientItemConfigBase<T>} [defaultConfig]
     * @returns {Observable<T>}
     * @memberof CyiaHttpService
     */
    private requestEnity<T>(config: HttpClientItemConfigBase<T>, defaultConfig?: HttpClientItemConfigBase<T>): Observable<T> {
        let method: HttpMethod = config.requestConfig.method ||( defaultConfig ? defaultConfig.requestConfig.method : 'get');
        let url = this.mergeUrlList(defaultConfig ? defaultConfig.requestConfig.url : '', config.requestConfig.url)
        let options = config.requestConfig.options
        return this.http.request(method, url, options).pipe(take(1)) as any

    }
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
    mergeUrlList(...list: string[]) {
        return list.filter((url) => url)
            .reduce((pre, cur) => {
                if (pre.endsWith('/') && cur.startsWith('/')) {
                    return `${pre}${cur.substr(1)}`
                } else if (!pre.endsWith('/') && !cur.startsWith('/')) {
                    return `${pre}/${cur}`
                } else {
                    return `${pre}${cur}`
                }
            }, '')
    }
}