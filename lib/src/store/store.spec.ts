import { inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionReducerMap, createAction, createReducer, on, props, Store, StoreModule } from '@ngrx/store';
const ACTION = createAction('11', props<any>());
@Injectable()
export class StoreTestService {
  name = 'test';
  createReducer(stats, value) {
    return createReducer(
      123,
      on(ACTION, (state, action) => {
        console.log('执行?');
        return 222;
      })
    );
  }
}
export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('Registered Reducers');

// @NgModule({
//   imports: [StoreModule.forRoot(REDUCER_TOKEN)],
// })
// export class AppModule {}
fdescribe('store', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(REDUCER_TOKEN)],
      providers: [
        StoreTestService,
        {
          provide: REDUCER_TOKEN,
          useFactory: (...args) => {
            return args.reduce((pre, service) => {
              console.log('服务', service);
              pre[service.__proto__.constructor.name || service.name] = service.createReducer();
              return pre;
            }, {});
          },
          deps: [StoreTestService],
        },
      ],
    });
  });
  it('运行', async (done) => {
    const service = TestBed.inject(Store);

    service.dispatch(ACTION(1));
    service.select('StoreTestService').subscribe((value) => {
      expect(value).toBe(222);
      done();
    });
  });
});
