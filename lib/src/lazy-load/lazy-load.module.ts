import { NgModule, ModuleWithProviders, Injector, Compiler } from '@angular/core';
import { LazyLoadService } from './lazy-load.service';
import { LAZY_LOAD_MAP } from './lazy-load-map.token';
import { LazyLoadDirective } from './lazy-load.directive';
import { LazyLoadFormControlDirective } from './lazy-load-form-control.directive';

@NgModule({
  declarations: [LazyLoadDirective, LazyLoadFormControlDirective],
  imports: [],
  exports: [LazyLoadDirective, LazyLoadFormControlDirective],
  providers: [LazyLoadService],
})
export class LazyLoadModule {
  /**
   *
   *
   * @author cyia
   * @date 2020-08-02
   * @static
   * @param list 懒加载模块配置,为Map构造时传入的属性
   * @returns
   */
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
