import { HttpClient } from '@angular/common/http';
import { HttpRequestConfig } from '../http.define';
import { take, tap } from 'rxjs/operators';
import { mergeUrl } from '../../util/merge-url';
import { EntityOptions, Source } from '../../type';
import { mergeOptions } from '../../util/merge-options';
import { DataSource } from './data-source';
import { of } from 'rxjs';
import { Repository } from '../repository';
import { Type } from '@angular/core';

export class DataSourceByCache extends DataSource {
  dataSource = Source.cache;
  protected httpRequestConfig: HttpRequestConfig;
  constructor(private entity: Type<any>) {
    super();
  }

  find() {
    return this._findByCache();
  }
  private _findByCache() {
    return of(Object.values(Repository.getEntityRepository(this.entity)))
      .pipe(take(1))
      .toPromise();
  }
}
