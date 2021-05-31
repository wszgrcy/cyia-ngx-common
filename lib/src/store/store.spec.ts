import { Injectable, InjectionToken } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NgrxAction, NgrxStore } from './decorator';
import { StoreBase } from './store.base';
import { CyiaStoreFeatureModule, CyiaStoreModule } from './store.module';
@NgrxStore()
@Injectable()
export class StoreTestService extends StoreBase<{
  value: any;
  state?: any;
}> {
  initState = { value: 'init' };
  @NgrxAction()
  testOne(value) {
    return { ...value };
  }
  @NgrxAction()
  testPromise() {
    return Promise.resolve({ value: 1234 });
  }
  @NgrxAction()
  testObservable() {
    return of({ value: 100 });
  }
  @NgrxAction()
  testState() {
    console.log('执行初始值', this.state);

    return { state: this.state.value === 'init' };
  }
}
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Registered Reducers');

describe('store-root', () => {
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
  it('运行', async (done) => {
    service.testOne({ value: 1, name: 324 });
    service.state$.subscribe((value) => {
      expect(value.value).toBe(1);
      expect(service.snapshot.value).toBe(1);
      done();
    });
  });
  it('初始化值', async (done) => {
    service.testState();
    service.subscribe((value) => {
      console.log('订阅', value);

      expect(value.state).toBe(true);
      done();
    });
  });
  it('运行promise', async (done) => {
    service.testPromise();
    service.state$
      .pipe(
        filter((result) => !service.pending),
        filter((item) => item.value)
      )
      .subscribe((res) => {
        expect(res.value).toBe(1234);
        done();
      });
  });
  it('运行Observable', async (done) => {
    service.testObservable();
    service.state$
      .pipe(
        filter((result) => !service.pending),
        filter((item) => item.value)
      )
      .subscribe((result) => {
        expect(result.value).toBe(100);
        done();
      });
  });
});

describe('store-feature', () => {
  let service: StoreTestService;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature('test-feature', REDUCER_TOKEN),
          CyiaStoreModule.forFeature({ name: 'test-feature', token: REDUCER_TOKEN, stores: [StoreTestService] }),
        ],
        providers: [],
      });
      service = TestBed.inject(StoreTestService);
      expect(service).toBeTruthy();
    })
  );
  it('运行', async (done) => {
    service.testOne({ value: 1, name: 324 });
    service.state$.subscribe((value) => {
      expect(value.value).toBe(1);
      expect(service.snapshot.value).toBe(1);
      done();
    });
  });
  it('运行promise', async (done) => {
    service.testPromise();
    service.state$
      .pipe(
        filter((result) => !service.pending),
        filter((item) => item.value)
      )
      .subscribe((res) => {
        expect(res.value).toBe(1234);
        done();
      });
  });
  it('运行Observable', async (done) => {
    service.testObservable();
    service.state$
      .pipe(
        filter((result) => !service.pending),
        filter((item) => item.value)
      )
      .subscribe((result) => {
        expect(result.value).toBe(100);
        done();
      });
  });
});
