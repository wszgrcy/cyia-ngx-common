/**请求方法 */
export type HttpMethod = 'get' | 'head' | 'post' | 'put' | 'delete' | 'options' | 'patch';
/**监听类型 */
export type HttpObserve = 'body' | 'events' | 'response';
/**监听类型 */
export type HttpResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

/**请求token值,用于类型提示 */
export type HttpTokenName = string;
/**请求url值,用于类型提示 */
export type HttpUrl = string;

export class HttpRequestOptions {
  body?: any;
  headers?: HttpHeaders;
  observe?: HttpObserve;
  params?: {
    [param: string]: string | string[];
  } = {};
  reportProgress?: boolean; // doc 报告进度,上传用
  responseType?: any; // ?目前用不到
  withCredentials?: boolean;
}
/**request请求参数 */
export class HttpRequestConfig {
  method?: HttpMethod = 'get';
  url?: HttpUrl = '';
  options?: HttpRequestOptions;
}
export class HttpRequestItem<T = string> extends HttpRequestConfig {
  token: T;
  /**后缀 */
  suffix?: HttpUrl;
}
/**请求列表的每个item */
export interface RequestItem<T = string> {
  /**一组的通用前缀 */
  prefixurl: HttpUrl;
  apiList: HttpRequestItem<T>[];
}
export class HttpHeaders {
  [header: string]: string | string[]
}

export interface CyiaHttpModuleConfig {
  urlPrefix?: string;
}
