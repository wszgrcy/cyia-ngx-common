import { Type, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class PropertyDataSourceStandaloneOptions<T = any> {
  /**数据来源 */
  source: PropertyDataSourceOptions['itemSelect'];
  /**级联标志 */
  cascade?: boolean;
  /**实体化类 */
  entity?: Type<T>;
}
export class PropertyDataSourceOptions<T = any> {
  /**所有的属性数据来源,多个时,只取第一个,即最靠近属性的一个 */
  source?: (httpClient: HttpClient, injector: Injector, parentResult: Exclude<any, Observable<any>>) => Observable<any>;
  /**级联标志 */
  cascade?: boolean = false;
  /**是否继承 */
  inherit?: boolean = false;
  /**如果返回数据是结构化实体需要
   * 定义实体且只有实体,查找实体的source,不使用自身的source
   */
  entity?: Type<T>;
  /**分发到各item中使用 */
  itemSelect?: (
    /**自身类型 */
    item: T,
    /**当前键名 */
    key: string,
    /**在列表中的索引位置,单一为0 */
    index: number,
    /**source中返回的结果 */
    result: Exclude<any, Observable<any>>,
    /**HttpClient注入 */
    httpClient: HttpClient,
    /**Injector注入 */
    injector: Injector
  ) => Observable<any> = (item, key, index, result) => of(result)
}
export class PropertyDataSourceOptionsPrivate extends PropertyDataSourceOptions {
  key: string;
  parentEntity: Type<any>;
  /**是否已经继承过 */
  hasInherit ? = false;
}
export class ClassDataSourceOptions {
  /**数据来源 */
  source: (httpClient: HttpClient, injector: Injector, ...args) => Observable<any>;
  /**是否继承父级,true时直接使用父级source */
  inherit?: boolean = false;
}
export class ClassDataSourceOptionsPrivate extends ClassDataSourceOptions {
  entity: Type<any>;
}
