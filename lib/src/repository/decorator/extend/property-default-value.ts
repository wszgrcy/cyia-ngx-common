import { PropertyDataSourceOptions, PropertyDataSourceOptionsPrivate } from '../../type/decorator.options';
import { EntityConfigRepository } from '../../entity-config.repository';
import { mergeOptions } from 'cyia-ngx-common/util';
import { PropertyDefaultValueOptions } from '../../type/decorator.extend.options';
import { PropertyDataSource } from '../property-data-source';
import { of } from 'rxjs';

export function PropertyDefaultValue<T = any>(value: T, options?: PropertyDefaultValueOptions) {
  return PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => {
      const currentValue = item[key];
      options = mergeOptions(new PropertyDefaultValueOptions(), options);
      if (options.isUndefined && currentValue === undefined) {
        return of(value);
      }
      if (options.isNull && currentValue === null) {
        return of(value);
      }
      if (options.isZero && currentValue === 0) {
        return of(value);
      }
      if (options.isEmptyString && currentValue === '') {
        return of(value);
      }
      if (options.isNaN && Number.isNaN(currentValue)) {
        return of(value);
      }
      if (options.equalToFalse && !currentValue) {
        return of(value);
      }
      return of(currentValue);
    },
  });
}
