import { EntityOptions } from "./entity.options";
import { Type } from "@angular/core";
export interface RegisterEntityOption {
  entity: Type<any>
  options: EntityOptions
}
