import { CyiaHttpService } from "../../http/http.service";
import { EntityOptions, RelationEntityOptions, Source } from "../../type/options/entity.options";
import { ENTITY_SYMBOL, REPOSITORY_SYMBOL } from "../../symbol/entity.symbol";
import { Type } from "@angular/core";
import { HttpRequestConfig } from "../../http/http.define";

/**
 * todo childentity
 *
 * @export
 */
export function Entity(options: EntityOptions, relationOptions?: RelationEntityOptions) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    if (typeof options.request != 'function') {
      options.request = Object.assign(new HttpRequestConfig(), options.request)
    }
    Reflect.defineMetadata(ENTITY_SYMBOL, {
      entity: constructor,
      options: Object.assign(new EntityOptions(), options),
      relationOptions: Object.assign(new RelationEntityOptions(), relationOptions)
    }, constructor)
  }
}
// export function EntityList(options: EntityOptions, relationOptions?: RelationEntityOptions) {
//   return function <T extends { new(...args: any[]): {} }>(constructor: T) {
//     Reflect.defineMetadata(ENTITY_SYMBOL, {
//       entity: constructor,
//       options: Object.assign(new EntityListOptions(), options),
//       relationOptions
//     }, constructor)
//   }
// }

