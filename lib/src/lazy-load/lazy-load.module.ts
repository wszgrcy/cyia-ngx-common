import { NgModule, ModuleWithProviders, Injector, Compiler } from '@angular/core';
import { LazyLoadService } from './lazy-load.service';
import { LAZY_LOAD_MAP } from './lazy-load-map.token';
import { LazyLoadDirective } from './lazy-load.directive';

@NgModule({
  declarations: [LazyLoadDirective],
  imports: [],
  exports: [LazyLoadDirective],
  providers: [LazyLoadService],
})
export class LazyLoadModule {
  static forRoot(
    list: [string, (injector: Injector, compiler: Compiler) => Promise<any>][]
  ): ModuleWithProviders<LazyLoadModule> {
    return {
      ngModule: LazyLoadModule,
      providers: [
        LazyLoadService,
        {
          provide: LAZY_LOAD_MAP,
          useValue: new Map(list),
        },
      ],
    };
  }
}
