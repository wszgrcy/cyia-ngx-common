import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
@Injectable()
export abstract class StoreBase<T = any> {
  constructor() {}
  readonly initState?: T;
  state: T;
  state$: Observable<T>;
  readonly name?: string;
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
}
