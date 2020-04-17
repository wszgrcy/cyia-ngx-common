import {
  PropertyDataSourceOptions,
  PropertyDataSourceOptionsPrivate,
  PropertyDataSourceStandaloneOptions,
} from '../../type/decorator.options';
import { PropertyDataSource } from '../property-data-source';

export function PropertyDataSourceStandalone<T>(options: PropertyDataSourceStandaloneOptions) {
  return PropertyDataSource({ ...options, itemSelect: options.source, source: (a, b, result) => result });
}
