import { LoadingHintService } from './load-component.service';
import { ɵisPromise, ElementRef, ɵisObservable, Type, ViewContainerRef, InjectionToken } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CyiaLoadHintConfig, CyiaLoadHintOption, LoadingHintContainer, InstallConfig } from './type';
export function LoadingHint<T = any>(config: CyiaLoadHintOption);
export function LoadingHint<T = any>(container: 'root');
export function LoadingHint<T = any>(container: 'root', component: Type<any>);
export function LoadingHint<T = any>(container: 'root', config: CyiaLoadHintConfig);
export function LoadingHint<T = any>(container: 'root', token: InjectionToken<CyiaLoadHintConfig>);
export function LoadingHint<T = any>(elementRefFn: (type: T) => ViewContainerRef, token: InjectionToken<CyiaLoadHintConfig>);
export function LoadingHint<T = any>(elementRefFn: (type: T) => ViewContainerRef, config: CyiaLoadHintConfig);
export function LoadingHint<T = any>(elementRefFn: (type: T) => ViewContainerRef, component: Type<any>);
export function LoadingHint<T = any>(elementRefFn: (type: T) => ViewContainerRef);
export function LoadingHint<T = any>(arg1: CyiaLoadHintOption | ((type: T) => ViewContainerRef) | 'root', arg2?: Type<any> | CyiaLoadHintConfig|InjectionToken<CyiaLoadHintConfig>) {
  return function (target, key: string, property: PropertyDescriptor) {
    const fn: Function = property.value;
    property.value = function () {
      let container: LoadingHintContainer;
      let component: Type<any>;
      let otherParam;
      // if (arg1 instanceof InjectionToken) {
      //   LoadingHintService.install.next(arg1);
      // }
      if (typeof arg1 === 'string') {
        container = arg1;
      } else if (typeof arg1 === 'function') {
        container = arg1(this);
      }
      if (arg2 && (arg2.hasOwnProperty('component'))) {
        component = (arg2 as any).component;
        otherParam = arg2;
      } else if (arg2 && !(arg2 instanceof InjectionToken)) {
        component = arg2 as any;
      }
      console.log(arg2);
      LoadingHintService.install.next({ container, ...otherParam, component, token: arg2 instanceof InjectionToken ? arg2 : undefined });

      const res = fn.call(this, arguments);
      if (ɵisPromise(res)) {
        return res.then((value) => {
          LoadingHintService.uninstall.next(container);
          return value;
        });
      } else if (ɵisObservable(res)) {
        return res.pipe(tap(() => LoadingHintService.uninstall.next(container)));
      }
      return res;
    };

    return property;
  };
}

// function getContainer() {

// }
