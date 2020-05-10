import { PropertyDataSourceOptions, ClassDataSourceOptions } from '../type/decorator.options';
import { EntityConfigRepository } from '../entity-config.repository';
import { Type } from '@angular/core';
/**
 *
 * @description 类数据来源,定义装饰类从哪里取得数据
 * @docs-decorator
 * @export
 * @param  options 相关参数
 * @returns
 */
export function ClassDataSource(options: ClassDataSourceOptions = new ClassDataSourceOptions()) {
  return function <T>(constructor: Type<T>) {
    EntityConfigRepository.setClassDataSource(constructor, { ...options, entity: constructor });
  };
}
