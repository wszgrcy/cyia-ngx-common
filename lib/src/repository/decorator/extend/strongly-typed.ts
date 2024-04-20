import { PropertyDataSource } from '../property-data-source';
import { Type } from '@angular/core';
import { of } from 'rxjs';
import { stronglyTyped } from '@cyia/ngx-common/util';

/**
 *@docs-decorator
 * @description 强类型化,使用返回的属性生成传入类的实例
 * @export
 * @template T
 * @param  entity
 * @returns
 */
export function StronglyTyped<T>(entity: Type<T>) {
  return PropertyDataSource({
    entity: entity,
    source: (http, injector, result) => of(undefined),
    itemSelect: (item, key, index, result) => {
      return of(stronglyTyped(item[key], entity));
    },
  });
}
