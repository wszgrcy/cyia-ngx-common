import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaStoreService, newCreateReducer } from './store.service';
import { InjectionToken } from '@angular/core';
import { StoreModuleForRootOptions } from './store.types';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [CyiaStoreService],
})
export class CyiaStoreModule {
  static forRoot(options: StoreModuleForRootOptions): ModuleWithProviders<any> {
    return {
      ngModule: CyiaStoreModule,
      providers: [
        {
          provide: options.token,
          useFactory: (...args) => {
            return args.reduce((pre, service) => {
              pre[service.name || service.__proto__.constructor.name] = newCreateReducer(service);
              return pre;
            }, {});
          },
          deps: [options.stores],
        },
      ],
    };
  }
}
