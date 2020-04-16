import { Type, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class PropertyDataSourceOptions {
  source?: (httpClient: HttpClient, injector: Injector, parentResult: Exclude<any, Observable<any>>) => Observable<any>;
  /**级联 */
  cascade ? = false;
  /**如果返回数据是结构化实体需要
   * 定义实体且只有实体,查找实体的source,不使用自身的source
   */
  entity?: Type<any>;
  /**如果返回数据是列表需要实现 */
  itemSelect?: (item: any, key: string, index: number, result: Exclude<any, Observable<any>>) => Observable<any> = (
    item,
    key,
    index,
    result
  ) => of(result)
}
export class PropertyDataSourceOptionsPrivate extends PropertyDataSourceOptions {
  key: string;
  parentEntity: Type<any>;
}
export interface ClassDataSourceOptions {
  source: (httpClient: HttpClient, injector: Injector, ...args) => Observable<any>;
}
export interface ClassDataSourceOptionsPrivate extends ClassDataSourceOptions {
  entity: Type<any>;
}
