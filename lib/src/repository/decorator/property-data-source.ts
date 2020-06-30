import { PropertyDataSourceOptions, PropertyDataSourceOptionsPrivate } from '../type/decorator.options';
import { EntityConfigRepository } from '../entity-config.repository';
import { mergeOptions } from 'cyia-ngx-common/util';

/**
 * @description 属性数据源,定义属性从哪里取得数据(如果该属性没有或需要修改)
 * @docs-decorator
 *
 * @export
 * @param options
 * @returns
 */
export function PropertyDataSource<RESULT = any>(options: PropertyDataSourceOptions<RESULT>) {
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
