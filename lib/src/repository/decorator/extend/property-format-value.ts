import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';

/**
 *@docs-decorator
 * @description 格式化该属性
 * @export
 * @param  format
 * @returns
 */
export function PropertyFormatValue(format: (value) => any) {
  return PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => {
      return of(format(item[key]));
    },
  });
}
