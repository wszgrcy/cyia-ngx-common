import { Injectable, Inject, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST } from './http.token';
import { RequestItem, HttpRequestItem, HttpUrl } from './http.define';
import { _deepAssign } from '../object/deepassign';
import { Observable } from 'rxjs';
import { HttpClientItemConfig, HttpClientItemConfigBase } from './http.class';
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
        let obj = _deepAssign<HttpRequestItem>({}, httpRequestItem, httpRequestConfig);
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
    injectUse<D, T extends HttpClientItemConfig<D>>(ItemConfig: Type<HttpClientItemConfig<D>>)
    // :({
    //     default:HttpClientItemConfigBase<D>,
    //     [name:string]:any
    // }) 
    {
        let instance = new ItemConfig()
        // return instance
        let obj = {}

        return {
            default: () => this.requestEnity(instance.defalut),
            post:() => this.requestEnity(instance.sub.post)
        }
    }
    requestEnity<T>(config: HttpClientItemConfigBase<T>, defaultConfig?: HttpClientItemConfigBase<T>): Observable<T> {
        return this.http.request(config.requestConfig.method, config.requestConfig.url, config.requestConfig.options) as any
    }

}
interface aaa {

}
// type base<T> = Extract<T, HttpClientItemConfig>
// type