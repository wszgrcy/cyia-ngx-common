import { HttpRequestConfig } from "../../http/http.define";
import { RelationMatchingMode } from "./relations.options";
import { Type } from "@angular/core";

export interface OneToOneMetaOption {

}

/**
 * 实体类装饰器配置
 * 1.通过保存仓库取出
 * TODO 2.通过即时请求
 * 实体上配置请求数据
 * 基类继承,多装饰器
 * todo 通过请求头,获取到请求类型,然后处理参数
 */
export class EntityOptions {
  method?: Source = Source.request;
  request?: HttpRequestConfig | ((...args) => HttpRequestConfig) = new HttpRequestConfig()
  /**被继承时,保留哪些字段 */
  // reserve?: Reserve[]
}

/**
 * 被关联时使用的实体装饰器
 *
 * @export
 *
 */
export class RelationEntityOptions {
  request?: (result) => Promise<HttpRequestConfig> = async () => ({})
  mode?: RelationMatchingMode = RelationMatchingMode.auto
}

// export interface Chain {

// }
export enum Source {
  request, normal, /**结构化 */structure
}
/**
 * 当被继承时候使用,是从继承原来的参数
 *
 * @export
 * @enum {number}
 */
export enum RequestFlag {
    /**所有请求参数不继承 */new, /**原有数据上追加,
    url上表现为路径合并
    header,body,param上表现为对象合并


     */append
}
export interface EntityColumnOption {
  targetEntityFn: () => Type<any>
  propertyName: string
}

export type Reserve = 'headers' | 'body' | 'params' | 'method' | 'url' | 'reportProgress' | 'responseType' | 'withCredentials' | 'observe'
// export type ContentType = 'json' | 'form-data' | 'x-www-form-urlencoded'|'raw'|'binary'