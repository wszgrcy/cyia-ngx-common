import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NgrxAction } from './decorator';
@Injectable()
export abstract class StoreBase<T = any> {
  constructor() {}
  readonly initState?: T;
  state: T;
  state$: Observable<T>;
  readonly name?: string;
  pending: boolean = false;
  get snapshot() {
    return this.state;
  }
  get subscribe() {
    return this.state$.subscribe;
  }
  get pipe() {
    return this.state$.pipe;
  }
  storeInit(store: Store<any>) {}
  @NgrxAction()
  promiseReturn(value: T): T {
    this.pending = false;
    return value;
  }
  @NgrxAction()
  observableReturn(value: T): T {
    this.pending = false;
    return value;
  }
}
