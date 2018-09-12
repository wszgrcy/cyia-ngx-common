import { HttpClient } from '@angular/common/http';
import { RequestItem, HttpRequestItem } from './http.define';
import { Observable } from 'rxjs';
export declare class CyiaHttpService {
    private requestList;
    private http;
    constructor(requestList: RequestItem[], http: HttpClient);
    /**
     *传入请求
     *
     * @param {HttpRequestItem} httpRequestConfig
     * @returns
     * @memberof CyiaHttp
     */
    request(httpRequestConfig: HttpRequestItem): Observable<any>;
}
