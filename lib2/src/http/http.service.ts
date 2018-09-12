import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { REQUEST_LIST } from './http.token';
import { RequestItem, HttpRequestItem } from './http.define';
import { _deepAssign } from '../object/deepassign';
import { Observable } from 'rxjs';


// console.error('请求token出错,请核实后再操作');

@Injectable()
export class CyiaHttpService {
    constructor(
        @Inject(REQUEST_LIST) private requestList: RequestItem[],
        private http: HttpClient
    ) { }

    /**
     *传入请求
     *
     * @param {HttpRequestItem} httpRequestConfig 
     * @returns
     * @memberof CyiaHttp
     */
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
        obj.url = requestItem.prefixurl + obj.url + (obj.suffix || '')
        return this.http.request(obj.method, obj.url, obj.options)
        //doc未找到返回 
    }
}
