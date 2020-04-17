import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';
export function PropertyInherit<T>() {
  return PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => of(item[key]),
    inherit: true,
  });
}
