import { Injectable, InjectionToken } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { NgrxAction, NgrxStore } from './decorator';
import { StoreBase } from './store.base';
import { CyiaStoreModule } from './store.module';
@Injectable()
@NgrxStore()
export class StoreTestService extends StoreBase<{
  pending: boolean;
  value: any;
}> {
  initState = { pending: false, value: null };
  @NgrxAction()
  testOne(value) {
    return { pending: false, ...value };
  }
  @NgrxAction()
  testPromise() {
    setTimeout(() => {
      this.testOne({ value: 2, pending: false });
    }, 100);
    return {
      pending: false,
    };
  }
}
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Registered Reducers');

fdescribe('store', () => {
  let service: StoreTestService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(REDUCER_TOKEN),
          CyiaStoreModule.forRoot({ token: REDUCER_TOKEN, stores: [StoreTestService] }),
        ],
        providers: [],
      });
      service = TestBed.inject(StoreTestService);
    })
  );
  fit('运行', async (done) => {
    service.testOne({ value: 1, name: 324 });
    service.state$.subscribe((value) => {
      expect(value.value).toBe(1);
      expect(service.snapshot.value).toBe(1);
      done();
    });
  });
  fit('运行promise', async (done) => {
    service.testPromise();
    service.state$
      .pipe(
        filter((result) => !result.pending),
        filter((item) => item.value)
      )
      .subscribe((value) => {
        expect(value.value).toBe(2);
        done();
      });
  });
});
