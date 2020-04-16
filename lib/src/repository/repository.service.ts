import { Injectable, Type, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityConfigRepository } from './entity-config.repository';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { FindResult } from './find-result';
import { PropertyDataSourceOptionsPrivate } from './type/decorator.options';

@Injectable()
export class RepositoryService {
  constructor(private httpClient: HttpClient, private injector: Injector) {}
  private find<T>(entity: Type<T>, escade: boolean, ...params: any[]): Observable<any> {
    const findResult = new FindResult(entity);
    const config = EntityConfigRepository.getClassDataSource(entity);
    const propertyList = EntityConfigRepository.getPropertySource(entity);
    return config.source(this.httpClient, this.injector, ...params).pipe(
      tap((res) => {
        findResult.setSingle(!(res instanceof Array));
        findResult.setResult(res);
      }),
      switchMap((res) => {
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
                return itemSelect(item, key, j, list[i]).pipe(map((value) => (item[key] = value)));
              })
            )
          )
        );
      }),
      map((list) => {
        return findResult.getRawResult();
      })
    );
  }
  findOne<T>(entity: Type<T>, ...params: any[]): Observable<T> {
    return this.find(entity, true, ...params);
  }
  findMany<T>(entity: Type<T>, ...params: any[]): Observable<T[]> {
    return this.find(entity, true, ...params);
  }
  /**查询属性的数据 */
  private findSubData(item: PropertyDataSourceOptionsPrivate, parentResult) {
    if (item.entity) {
      return this.find(item.entity, item.cascade, parentResult);
    }
    // doc 处理不需要结构化的数据
    return item.source(this.httpClient, this.injector, parentResult);
  }
}
