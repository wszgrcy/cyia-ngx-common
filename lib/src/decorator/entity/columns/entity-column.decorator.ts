import { Type } from '@angular/core';
import { CyiaHttpService } from '../../../http';
import { PRIMARY_COLUMN_SYMBOL, ENTITY_COLUMN_SYMBOL } from '../../../symbol/entity.symbol';

/**
 * 需要知道是哪个实体
 * 已知数据(不进行请求),实体,进行调用普通的操作
 *
 * @export
 * @returns
 */
export function EntityColumn<T>(targetEntityFn: () => Type<T>) {
  return function (target, key: string) {
    const list: any[] = Reflect.getMetadata(ENTITY_COLUMN_SYMBOL, target.constructor) || [];
    list.push({
      targetEntityFn,
      propertyName: key
      // name: RelationType.ManyToOne,
      // inverseFn,
      // inverseValueFn,
      // options,
      // target: target.constructor,
      // propertyName: propertyKey
    });
    Reflect.defineMetadata(ENTITY_COLUMN_SYMBOL, list, target.constructor);
  };
}
