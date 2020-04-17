import { Type } from '@angular/core';
import {
  PropertyDataSourceOptionsPrivate,
  ClassDataSourceOptions,
  ClassDataSourceOptionsPrivate,
} from './type/decorator.options';
import { throwIf } from 'cyia-ngx-common/util';
import { switchMap, tap } from 'rxjs/operators';
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
    const preItem = list.find((item) => item.key === config.key);
    // doc 将多个itemSelect合并为一个,链式处理,source只保留第一个的,其他的不管
    if (preItem) {
      const preItemSelect = preItem.itemSelect;
      preItem.itemSelect = (item, key, index, result, httpClient, injector) =>
        preItemSelect(item, key, index, result, httpClient, injector).pipe(
          tap((result) => (item[key] = result)),
          switchMap(() => config.itemSelect(item, key, index, result, httpClient, injector))
        );
      preItem.cascade = preItem.cascade || config.cascade;
    } else {
      list.push(config);
    }
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
