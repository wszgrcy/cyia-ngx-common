import { Type } from '@angular/core';

export interface ObjectInstance extends Object {
  [name: string]: any;
}
export interface ClassObject extends Object {
  [name: string]: any;
  constructor: Type<any>;
}
