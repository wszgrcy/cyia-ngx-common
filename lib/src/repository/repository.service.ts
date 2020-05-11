import { Injectable, Type, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityConfigRepository } from './entity-config.repository';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { FindResult } from './find-result';
import { PropertyDataSourceOptionsPrivate } from './type/decorator.options';

/**
 * @docs-service
 * @description 仓库服务,访问实体,返回数据
 * @export
 *
 */
@Injectable()
export class CyiaRepositoryService {
  constructor(private httpClient: HttpClient, private injector: Injector) {}
  private find<T>(entity: Type<T>, /**级联标志*/ escade: boolean, ...params: any[]): Observable<any> {
    const findResult = new FindResult(entity);
    const config = EntityConfigRepository.getClassDataSource(entity);
    /**属性来源列表 */
    const propertyList = EntityConfigRepository.getPropertySource(entity);
    return config.source(this.httpClient, this.injector, ...params).pipe(
      tap((res) => {
        findResult.setSingle(!(res instanceof Array));
        findResult.setResult(res);
      }),
      switchMap(() => {
        if (!escade) {
          return of([]);
        }
        return propertyList.length
          ? forkJoin(
              propertyList.map((propertyItem) => {
                return this.findSubData(propertyItem, findResult.getRawResult());
              })
            )
          : of([]);
      }),
      switchMap((list: any[]) => {
        if (!escade || !propertyList.length || findResult.empty) {
          return of([]);
        }
        return forkJoin(
          [].concat(
            ...propertyList.map(({ key, itemSelect }, i) =>
              findResult.getResult().map((item, j) => {
                return itemSelect(item, key, j, list[i], this.httpClient, this.injector).pipe(
                  tap((value) => (item[key] = value))
                );
              })
            )
          )
        );
      }),
      map(() => {
        return findResult.getRawResult();
      })
    );
  }
  /**
   * @description 查找一个数据
   * @template T
   * @param entity 类数据源装饰器装饰的实体
   * @param params source传入参数(可传入多个)
   * @returns
   */
  findOne<T>(entity: Type<T>, ...params: any[]): Observable<T> {
    return this.find(entity, true, ...params);
  }
  /**
   * @description 查找多个数据
   * @template T
   * @param entity 类数据源装饰器装饰的实体
   * @param params source传入参数(可传入多个)
   * @returns
   */
  findMany<T>(entity: Type<T>, ...params: any[]): Observable<T[]> {
    return this.find(entity, true, ...params);
  }
  /**查询属性的数据 */
  private findSubData(item: PropertyDataSourceOptionsPrivate, /**父级数据*/ parentResult) {
    if (item.entity) {
      return this.find(item.entity, item.cascade, parentResult);
    }
    // doc 处理不需要结构化的数据
    return item.source(this.httpClient, this.injector, parentResult);
  }
}
