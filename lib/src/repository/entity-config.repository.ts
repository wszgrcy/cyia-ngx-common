import { Type } from '@angular/core';
import {
  PropertyDataSourceOptionsPrivate,
  ClassDataSourceOptions,
  ClassDataSourceOptionsPrivate,
} from './type/decorator.options';
import { throwIf } from '../util/throw-if';
/**实体配置仓库,保存装饰器相关配置 */
export class EntityConfigRepository {
  static map = new Map();
  private static primaryKeyMap = new Map<Type<any>, string>();
  private static propertySourceMap = new Map<Type<any>, PropertyDataSourceOptionsPrivate[]>();
  private static classDataSourceMap = new Map<Type<any>, ClassDataSourceOptionsPrivate>();

  static setPrimaryKey(key: Type<any>, primaryKey) {
    EntityConfigRepository.primaryKeyMap.set(key, primaryKey);
  }
  static setPropertySource(key: Type<any>, config: PropertyDataSourceOptionsPrivate) {
    const list = EntityConfigRepository.getPropertySource(key);
    list.push(config);
    EntityConfigRepository.propertySourceMap.set(key, list);
  }
  static getPropertySource(key: Type<any>) {
    return EntityConfigRepository.propertySourceMap.get(key) || [];
  }

  static getPrimaryKey(key: Type<any>) {
    return EntityConfigRepository.primaryKeyMap.get(key);
  }
  static setClassDataSource(key: Type<any>, config: ClassDataSourceOptionsPrivate) {
    EntityConfigRepository.classDataSourceMap.set(key, config);
  }
  static getClassDataSource(key: Type<any>) {
    const result = EntityConfigRepository.classDataSourceMap.get(key);
    throwIf(!result, '未找到实体');
    return result;
  }
}
