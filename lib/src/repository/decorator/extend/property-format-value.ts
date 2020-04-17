import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';

export function PropertyFormatValue(format: (value) => any) {
  return PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => {
      return of(format(item[key]));
    },
  });
}
