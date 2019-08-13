import { Type } from "@angular/core";
import { CyiaHttpService } from "../../../http";
import { PRIMARY_COLUMN_SYMBOL } from "../../../symbol/entity.symbol";

export function PrimaryColumn() {
  return function(target, key: string) {
    // CyiaHttpService.columns.push({
    // })
    Reflect.defineMetadata(PRIMARY_COLUMN_SYMBOL, key, target.constructor)
  }
}
