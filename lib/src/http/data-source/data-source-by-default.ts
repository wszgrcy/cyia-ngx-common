import { HttpClient } from '@angular/common/http';
import { HttpRequestConfig } from '../http.define';
import { take, tap } from 'rxjs/operators';
import { mergeUrl } from '../../util/merge-url';
import { EntityOptions, Source } from '../../type';

import { DataSource } from './data-source';
import { of } from 'rxjs';
import { Repository } from '../repository';
import { Type } from '@angular/core';

export class DataSourceByDefault extends DataSource {
  dataSource = Source.default;
  constructor() {
    super();
  }

  async find() {
    return undefined;
  }
}
