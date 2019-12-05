import { EntityOptions, RelationEntityOptions } from './entity.options';
import { Type } from '@angular/core';
import { HttpRequestConfig } from '../../http/http.define';
export interface RegisterEntityOption {
  entity?: Type<any>;
  options?: EntityOptions;
  relationOptions?: RelationEntityOptions;

}
