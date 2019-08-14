import { HttpRequestConfig } from "../../http/http.define";
import { RelationMatchingMode } from "./relations.options";
import { Type } from "@angular/core";

export interface OneToOneMetaOption {

}

/**
 * 1.通过保存仓库取出
 * TODO 2.通过即时请求
 * 实体上配置请求数据
 * 基类继承,多装饰器
 */
export class EntityOptions {
  method?: Source = Source.request;
  request?: HttpRequestConfig
  requestFlag?: RequestFlag = RequestFlag.new;
  dataPosition?: string[]
  // isArray?: boolean = false
}
// export class EntityListOptions extends EntityOptions {
//   isArray?: boolean = true
// }
export class RelationEntityOptions {
  // params?: (params) => any
  // body?: (params) => any
  // header?: (params) => any
  request?: (result) => Promise<HttpRequestConfig> = async () => ({})
  mode?: RelationMatchingMode = RelationMatchingMode.auto
}

// export interface Chain {

// }
export enum Source {
  request, normal
}
/**
 *
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
