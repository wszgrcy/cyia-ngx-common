import { PropertyDataSourceOptions, PropertyDataSourceOptionsPrivate } from '../type/decorator.options';
import { ObjectInstance, ClassObject } from '../../type/object';
import { EntityConfigRepository } from '../entity-config.repository';
import { mergeOptions } from 'lib/src/util/merge-options';

export function PropertyDataSource(options: PropertyDataSourceOptions) {
  return function (target: any, key: string) {
    // 属性数据源应该和类数据源一样
    if (options.entity && options.source) {
      EntityConfigRepository.setClassDataSource(options.entity, { entity: options.entity, source: options.source });
    }
    if (!options.entity && !options.source) {
      throw new TypeError('entity or source must be required!');
    }
    EntityConfigRepository.setPropertySource(
      target.constructor,
      mergeOptions(new PropertyDataSourceOptionsPrivate(), {
        ...options,
        key,
        parentEntity: target.constructor,
      })
    );
  };
}
