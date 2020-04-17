import { Type } from '@angular/core';
import {
  PropertyDataSourceOptionsPrivate,
  ClassDataSourceOptions,
  ClassDataSourceOptionsPrivate,
} from './type/decorator.options';
import { throwIf } from 'cyia-ngx-common/util';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
/**实体配置仓库,保存装饰器相关配置 */
export class EntityConfigRepository {
  static map = new Map();
  private static propertySourceMap = new Map<Type<any>, PropertyDataSourceOptionsPrivate[]>();
  private static classDataSourceMap = new Map<Type<any>, ClassDataSourceOptionsPrivate>();

  static setPropertySource(key: Type<any>, config: PropertyDataSourceOptionsPrivate) {
    const list = EntityConfigRepository.getPropertySource(key);
    const previousItem = list.find((item) => item.key === config.key);
    // doc 将多个itemSelect合并为一个,链式处理,source只保留第一个的,其他的不管
    if (previousItem) {
      previousItem.itemSelect = EntityConfigRepository.mergePropertyConfig(previousItem, config);
    } else {
      list.push(config);
    }
    config = previousItem || config;
    if (config.inherit && !config.hasInherit) {
      const parentList = EntityConfigRepository.getPropertySource(Object.getPrototypeOf(key));
      if (parentList.length) {
        const parentItem = parentList.find((parentItem) => parentItem.key === config.key);
        if (parentItem) {
          config.itemSelect = EntityConfigRepository.mergePropertyConfig(parentItem, config);
          config.source = parentItem.source;
          config.hasInherit = true;
        }
      }
    }
    EntityConfigRepository.propertySourceMap.set(key, list);
  }
  static getPropertySource(key: Type<any>) {
    return EntityConfigRepository.propertySourceMap.get(key) || [];
  }

  static setClassDataSource(key: Type<any>, config: ClassDataSourceOptionsPrivate) {
    EntityConfigRepository.classDataSourceMap.set(key, config);
  }
  static getClassDataSource(key: Type<any>) {
    const result = EntityConfigRepository.classDataSourceMap.get(key);
    throwIf(!result, '未找到实体');
    return result;
  }
  /**合并属性来源选项配置 */
  static mergePropertyConfig(
    previousItem: PropertyDataSourceOptionsPrivate,
    currentItem: PropertyDataSourceOptionsPrivate
  ): (...arg) => Observable<any> {
    const previousItemSelect = previousItem.itemSelect;
    const currentItemSelect = currentItem.itemSelect;
    return (item, key, index, result, httpClient, injector) => {
      return previousItemSelect(item, key, index, result, httpClient, injector).pipe(
        tap((result) => (item[key] = result)),
        switchMap(() => currentItemSelect(item, key, index, result, httpClient, injector)),
      );
    };
  }
}
