import { Type } from "@angular/core";
import 'reflect-metadata'
import { ONETOONE_SYMBOL, RELATION_SYMBOL } from "../../../symbol/entity.symbol";
import { CyiaHttpService } from "../../../http";
import { RelationType } from "../../../type/relation.type";
/**
 * doc 装饰器应该是附加在要生成的字段
 * 一对一,主键
 * 一对多,主键,指定对方字段
 * 多对一,主键,指定对方字段
 * 多对多,?
 */
export function OneToOne<S = any, I = any>(inverseFn: () => Type<I>, options?: any) {
  return (target: Object, propertyKey: string) => {
    let list: any[] = Reflect.getMetadata(RELATION_SYMBOL, target) || []
    list.push({
      name: RelationType.OneToOne,
      inverseFn,
      options,
      target: target.constructor,
      propertyName: propertyKey
    })
    Reflect.defineMetadata(RELATION_SYMBOL, list, target.constructor)

    // CyiaHttpService.relations.push({
    //   name: RelationType.OneToOne,
    //   inverseFn,
    //   inverseValueFn, options,
    //   target: target.constructor,
    //   propertyName: propertyKey
    // })
    // return descriptor
  }

}



