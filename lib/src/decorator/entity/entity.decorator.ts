import { CyiaHttpService } from "../../http/http.service";
import { EntityOptions } from "../../type/options/entity.options";
import { ENTITY_SYMBOL } from "../../symbol/entity.symbol";
export function Entity(options: EntityOptions) {
  return function (constructor) {
    Reflect.defineMetadata(ENTITY_SYMBOL, {
      entity: constructor,
      options: Object.assign(new EntityOptions(), options)
    }, constructor)
    // CyiaHttpService.registerEntity({
    //   entity: constructor,
    //   options: Object.assign(new EntityOptions(), options)
    // })
  }
}
