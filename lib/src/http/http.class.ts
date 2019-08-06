import { HttpMethod, HttpHeaders, HttpRequestConfig } from './http.define';
import { Type } from '@angular/core';


export abstract class HttpClientItemConfig<T,D> {
    sub: D
    abstract defalut: HttpClientItemConfigBase<T>
    constructor(
    ) {
    }
}
export class HttpClientItemConfigBase<T> {
    constructor(
        public requestConfig: HttpRequestConfig,
        public responseConfig: Type<T>
    ) { }
}
