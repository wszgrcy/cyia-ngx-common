import { Type } from '@angular/core';
import { stronglyTyped } from 'cyia-ngx-common/util';

export class FindResult<T> {
  result: T[];
  private single: boolean;
  private _empty = false;
  constructor(private entity: Type<T>) {}
  setSingle(single: boolean) {
    this.single = single;
  }
  setResult(result) {
    result = stronglyTyped(result, this.entity);
    if (this.single) {
      this.result = [result];
    } else {
      this.result = result;
    }
    this._empty = !this.result.length;
  }
  /**处理数据时使用,无论是否为单一,都是列表形式 */
  getResult() {
    return this.result;
  }
  /**获得结构化的原始返回格式 */
  getRawResult() {
    if (this.single) {
      return this.result[0];
    } else {
      return this.result;
    }
  }
  get empty() {
    return this._empty;
  }
}
