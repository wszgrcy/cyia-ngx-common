import { CyiaHttpService } from "../../http/http.service";
import { EntityOptions, RelationEntityOptions, Source } from "../../type/options/entity.options";
import { ENTITY_SYMBOL, REPOSITORY_SYMBOL } from "../../symbol/entity.symbol";
import { Type } from "@angular/core";

/**
 * todo childentity
 *
 * @export
 * @param {EntityOptions} options
 * @returns
 */
export function Entity(options: EntityOptions, relationOptions?: RelationEntityOptions) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(ENTITY_SYMBOL, {
      entity: constructor,
      options: Object.assign(new EntityOptions(), options),
      relationOptions
    }, constructor)
    // if (options.method == Source.normal) {
    //   let a = new Function()
    //   return class  extends constructor {
    //     constructor(...args) {
    //       super(...args)
    //       let list: any[] = Reflect.getOwnMetadata(REPOSITORY_SYMBOL, constructor) || []
    //       list.push(args)
    //       Reflect.defineMetadata(REPOSITORY_SYMBOL, list, constructor)
    //     }
    //   }
    // }
    // CyiaHttpService.registerEntity({
    //   entity: constructor,
    //   options: Object.assign(new EntityOptions(), options)
    // })
  }
}
