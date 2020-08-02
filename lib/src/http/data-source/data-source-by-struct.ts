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
import { DataSourceByAssign } from './data-source-by-assign';

export class DataSourceByStruct extends DataSourceByAssign {
  dataSource = Source.structure;
}
