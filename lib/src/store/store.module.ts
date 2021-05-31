import { Inject, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { createReducer } from './store.service';
import { StoreModuleForFeatureOptions, StoreModuleForRootOptions } from './store.types';
import { Store } from '@ngrx/store';
import { FEATURE_TOKEN, ROOT_TOKEN } from './store.token';
import { StoreBase } from './store.base';
export function serviceToStoreFactory(...stores) {
  const obj = {};
  for (const store of stores) {
    createReducer(store)(obj);
  }
  return obj;
}
@NgModule({ imports: [], providers: [], exports: [], declarations: [] })
export class CyiaStoreFeatureModule {
  constructor(
    store: Store,
    injector: Injector,
    @Inject(FEATURE_TOKEN) featureConfig: Omit<StoreModuleForFeatureOptions, 'token'>[]
  ) {
    featureConfig.forEach((item) => {
      item.stores.forEach((service) => {
        const instance = injector.get(service);
        instance.storeInit(store, item.name);
      });
    });
  }
}
@NgModule({ imports: [], providers: [], exports: [], declarations: [] })
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
          useFactory: serviceToStoreFactory,
          deps: options.stores,
        },
      ],
    };
  }
  static forFeature(options: StoreModuleForFeatureOptions) {
    return {
      ngModule: CyiaStoreFeatureModule,
      providers: [
        ...(options.stores as any),
        {
          provide: FEATURE_TOKEN,
          useValue: { stores: options.stores, name: options.name },
          multi: true,
        },
        {
          provide: options.token,
          useFactory: serviceToStoreFactory,
          deps: options.stores,
        },
      ],
    };
  }
}
