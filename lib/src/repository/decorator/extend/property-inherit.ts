import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';

/**
 *@docs-decorator
 * @description 属性继承,如果使用,需要设置在里属性最近的位置,使用后数据来源会从继承中获得,
 * @export
 * @template T
 * @returns
 */
export function PropertyInherit<T>() {
  return PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => of(item[key]),
    inherit: true,
  });
}
