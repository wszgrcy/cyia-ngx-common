import { Type } from '@angular/core';

export class EntityConfigRepository {
  static map = new Map();
  private static primaryKeyMap = new Map<Type<any>, string>();
  private static propertySourceMap = new Map();
  static setPrimaryKey(key: Type<any>, primaryKey) {
    EntityConfigRepository.primaryKeyMap.set(key, primaryKey);
  }
  static setPropertySource(key: Type<any>, config) {
    EntityConfigRepository.propertySourceMap.set(key, config);
  }
  static getPropertySource(key: Type<any>) {
    return EntityConfigRepository.propertySourceMap.get(key);
  }
  static getPrimaryKey(key: Type<any>) {
    return EntityConfigRepository.primaryKeyMap.get(key);
  }
}
