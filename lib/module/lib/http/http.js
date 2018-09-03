// import { HttpClient } from '@angular/common/http';
// import { RequestItem, HttpRequestItem } from './http.define';
// import { _deepAssign } from '../object/deepassign';
// export class CyiaHttp {
//     static http: HttpClient;
//     static requestList: RequestItem[]
//     constructor() { }
//     static init(requestList: RequestItem[], http: HttpClient) {
//         this.http = http;
//         this.requestList = requestList
//     }
//     /**
//      *传入请求
//      * @param {HttpRequestItem} httpRequestConfig 
//      * @returns
//      * @memberof CyiaHttp
//      */
//     static request(httpRequestConfig: HttpRequestItem) {
//         /**请求接口 */
//         let httpRequestItem: HttpRequestItem = null;
//         /**查看请求前缀地址 */
//         let requestItem: RequestItem = this.requestList.find((listVal) => {
//             httpRequestItem = listVal.apiList.find((itemVal) => itemVal.token === httpRequestConfig.token
//             ) as HttpRequestItem;
//             if (httpRequestItem) return true;
//             return false;
//         }) as RequestItem;
//         if (!requestItem || !httpRequestItem) {
//             console.error('请求token出错,请核实后再操作');
//             return;
//         }
//         let obj = _deepAssign<HttpRequestItem>({}, httpRequestConfig, httpRequestItem);
//         obj.url = requestItem.prefixurl + obj.url + (obj.suffix || '')
//         return this.http.request(obj.method, obj.url, obj.options)
//         //doc未找到返回 
//     }
// }
//# sourceMappingURL=http.js.map