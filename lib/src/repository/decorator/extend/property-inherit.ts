import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';

/**
 *@docs-decorator
 *
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
