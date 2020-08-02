import { HttpClient } from '@angular/common/http';
import { HttpRequestConfig } from '../http.define';
import { take, tap } from 'rxjs/operators';
import { mergeUrl } from '../../util/merge-url';
import { EntityOptions } from '../../type';

import { DataSource } from './data-source';
import { of } from 'rxjs';
import { Repository } from '../repository';
import { Type } from '@angular/core';
import { Source } from '../../type';

export class DataSourceByAssign extends DataSource {
  dataSource = Source.assign;
  protected httpRequestConfig: HttpRequestConfig;
  constructor(private data: any) {
    super();
  }

  find() {
    return this._findByAssign();
  }
  private _findByAssign() {
    return of(this.data)
      .pipe(take(1))
      .toPromise();
  }
}
