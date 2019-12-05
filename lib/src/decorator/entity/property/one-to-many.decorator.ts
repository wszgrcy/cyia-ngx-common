import { Type } from '@angular/core';
import 'reflect-metadata';
import { ONETOONE_SYMBOL, RELATION_SYMBOL } from '../../../symbol/entity.symbol';
import { CyiaHttpService } from '../../../http';
import { RelationType } from '../../../type/relation.type';
/**
 * doc 装饰器应该是附加在要生成的字段
 * 一对一,主键
 * 一对多,主键,指定对方字段
 * 多对一,主键,指定对方字段
 * 多对多,?
 */
export function OneToMany<S = any, I = any>(
  inverseFn: () => Type<I>,
  inverseValueFn: (type: I) => I[keyof I] | any,
  options?: any
) {
  return (target: Object, propertyKey: string) => {
    // console.log(Reflect.getMetadataKeys(target.constructor)
    // );
    const list: any[] = Reflect.getMetadata(RELATION_SYMBOL, target.constructor) || [];
    // console.log(list, target.constructor);
    // debugger
    list.push({
      name: RelationType.OneToMany,
      inverseFn,
      inverseValueFn,
      options,
      target: target.constructor,
      propertyName: propertyKey
    });
    // console.log(list, target);
    // console.log('准备附加2');
    Reflect.defineMetadata(RELATION_SYMBOL, list, target.constructor);
    // console.log('结束附加2');
  };
}
