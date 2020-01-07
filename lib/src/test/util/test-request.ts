import { CyiaHttpService } from '../../http/http.service';
import { Type } from '@angular/core';
import { take } from 'rxjs/operators';
export function requestFactory(service: CyiaHttpService, isList: boolean): <T>(type: Type<T>) => Promise<T[]>;
export function requestFactory(service: CyiaHttpService): <T>(type: Type<T>) => Promise<T>;
export function requestFactory(service: CyiaHttpService, arg?: any) {
  return <T>(entity: Type<T>) => {
    if (arg) {
      return service
        .getEntityList(entity)({})
        .pipe(take(1))
        .toPromise();
    }
    return service
      .getEntity(entity)({})
      .pipe(take(1))
      .toPromise();
  };
}
