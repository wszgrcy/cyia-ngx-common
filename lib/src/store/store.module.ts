import { Inject, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { createReducer } from './store.service';
import { StoreModuleForRootOptions } from './store.types';
import { Store } from '@ngrx/store';
import { ROOT_TOKEN } from './store.token';
import { StoreBase } from './store.base';

@NgModule({})
export class CyiaStoreModule {
  constructor(store: Store, @Inject(ROOT_TOKEN) serviceList: typeof StoreBase[], injector: Injector) {
    serviceList.forEach((service) => {
      const instance = injector.get(service);
      instance.storeInit(store);
    });
  }
  static forRoot(options: StoreModuleForRootOptions): ModuleWithProviders<any> {
    return {
      ngModule: CyiaStoreModule,
      providers: [
        ...(options.stores as any),
        {
          provide: ROOT_TOKEN,
          useValue: options.stores,
        },
        {
          provide: options.token,
          useFactory: (...stores) => {
            return stores.reduce((pre, service) => {
              return createReducer(service)(pre);
            }, {});
          },
          deps: [options.stores],
        },
      ],
    };
  }
}
