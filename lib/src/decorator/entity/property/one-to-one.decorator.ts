import { Type } from "@angular/core";
import 'reflect-metadata'
import { ONETOONE_SYMBOL } from "../../../symbol/entity.symbol";
import { CyiaHttpService } from "../../../http";
import { RelationType } from "../../../type/relation.type";
export function OneToOne<S = any, I = any>(inverseFn: () => Type<I>, inverseValueFn: (inverse: I) => keyof I, options?: any) {
  return (target: Object, propertyKey: string) => {
    // let list: any[] = Reflect.getMetadata(ONETOONE_SYMBOL, target)
    // list.push({
    //   inverseFn,
    //   inverseValueFn
    // })
    CyiaHttpService.relations.push({
      name: RelationType.OneToOne,
      inverseFn,
      inverseValueFn, options,
      target: target.constructor,
      propertyName: propertyKey
    })
    // Reflect.defineMetadata()
    // return descriptor
  }

}
