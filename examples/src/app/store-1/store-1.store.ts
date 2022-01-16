import { Injectable } from '@angular/core';
import { StoreBase, NgrxStore, NgrxAction } from 'cyia-ngx-common/store';
@NgrxStore()
@Injectable()
export class Store1Store extends StoreBase {
  readonly initState: { sum: number } = {
    sum: 0,
  };
  state: { sum: number };
  @NgrxAction()
  ADD() {
    return { sum: this.state.sum + 1 };
  }

  @NgrxAction()
  RESET() {
    return { sum: 0 };
  }
}
