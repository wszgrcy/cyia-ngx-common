import {
  PropertyDataSourceOptions,
  PropertyDataSourceOptionsPrivate,
  PropertyDataSourceStandaloneOptions,
} from '../../type/decorator.options';
import { PropertyDataSource } from '../property-data-source';

/**
 *@docs-decorator
 * @description 对返回列表(加入是)中的每条数据的该属性进行单独处理,没有统一的返回
 * @export
 * @template T
 * @param  options
 * @returns
 */
export function PropertyDataSourceStandalone<T>(options: PropertyDataSourceStandaloneOptions) {
  return PropertyDataSource({ ...options, itemSelect: options.source, source: (a, b, result) => result });
}
