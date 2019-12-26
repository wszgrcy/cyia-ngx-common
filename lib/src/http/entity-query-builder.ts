import { CyiaHttpService } from './http.service';
import { EntityQueryBuilder, HttpRequestConfig } from './http.define';
import { Type } from '@angular/core';
import { of, Observable } from 'rxjs';

export function entityQueryBuilderFactory<T>(this: CyiaHttpService) {
  const entityQueryBuilder: EntityQueryBuilder<T> = function(entity: Type<T>) {
    return () => of(1);
  } as any;

  return entityQueryBuilder;
}
// entityQueryBuilderFactory(this)

export function entityQueryBuilder<T>(entity: [Type<T>]): (param?: HttpRequestConfig | any[]) => Observable<T[]>;
export function entityQueryBuilder<T>(entity: Type<T>): (param?: HttpRequestConfig | any[]) => Observable<T>;
export function entityQueryBuilder<T>(this: CyiaHttpService, entity: Type<T> | [Type<T>]): any {
  return () => of(1);
}
// export const EntityQueryBuilder1= entityQueryBuilder.bind(this) as EntityQueryBuilder;

entityQueryBuilder['addRelation'] = function() {

};
