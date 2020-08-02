import { NgModule, Injector, Compiler, NgModuleFactory, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';

export abstract class LibwcModule {
  // constructor(injector: Injector) {
  //   const el = createCustomElement(LibwcComponent, { injector });
  //   customElements.define('custom-libwc', el);
  // }
}
export function createWebComponent<T>(injector: Injector, compiler: Compiler, module: Type<T>, selector: string) {
  let factory: NgModuleFactory<any>;
  if (module instanceof NgModuleFactory) {
    factory = module as any;
  } else {
    factory = compiler.compileModuleSync(module);
  }
  const moduleRef = factory.create(injector);
  const el = createCustomElement(moduleRef.instance.entry, { injector: moduleRef.injector });
  customElements.define(selector, el);
}
