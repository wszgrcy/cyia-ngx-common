import { HttpRequestConfig } from './http.define';
/**请求方法 */
export declare type HttpMethod = 'get' | 'head' | 'post' | 'put' | 'delete' | 'options' | 'patch';
/**监听类型 */
export declare type HttpObserve = 'body' | 'events' | 'response';
/**监听类型 */
export declare type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';
/**请求token值,用于类型提示 */
export declare type HttpTokenName = string;
/**请求url值,用于类型提示 */
export declare type HttpUrl = string;
export interface HttpRequestOptions {
    body?: any;
    headers?: {
        [header: string]: string | string[];
    };
    observe?: HttpObserve;
    params?: {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: any;
    withCredentials?: boolean;
}
/**request请求参数 */
export interface HttpRequestConfig {
    method?: HttpMethod;
    url?: HttpUrl;
    options?: HttpRequestOptions;
}
export interface HttpRequestItem extends HttpRequestConfig {
    token: HttpTokenName;
    suffix?: HttpUrl;
}
/**请求列表的每个item */
export interface RequestItem {
    prefixurl: HttpUrl;
    apiList: HttpRequestItem[];
}
