import { PropertyDataSourceOptions, ClassDataSourceOptions } from '../type/decorator.options';
import { ObjectInstance, ClassObject } from '../../type/object';
import { EntityConfigRepository } from '../entity-config.repository';
import { Type } from '@angular/core';

export function ClassDataSource(options: ClassDataSourceOptions) {
  return function <T>(constructor: Type<T>) {
    EntityConfigRepository.setClassDataSource(constructor, { ...options, entity: constructor });
  };
}
