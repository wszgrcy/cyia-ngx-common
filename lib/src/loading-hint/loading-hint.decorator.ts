import { LoadingHintService } from './load-component.service';
import { ɵisPromise, ElementRef, ɵisObservable, Type, ViewContainerRef, InjectionToken } from '@angular/core';
import { tap, map, switchMap } from 'rxjs/operators';
import { CyiaLoadHintConfig, CyiaLoadHintOption, LoadingHintContainer, InstallConfig } from './type';
import { DEFAULT_INSTALL_CONFIG } from './const';
import { of } from 'rxjs';
export function LoadingHint<T = any>(option: CyiaLoadHintOption);
export function LoadingHint<T = any>(
  container: 'root' | ((type: T) => ViewContainerRef),
  config?: Type<any> | CyiaLoadHintConfig | InjectionToken<CyiaLoadHintConfig>
);
export function LoadingHint<T = any>(
  arg1: CyiaLoadHintOption | ((type: T) => ViewContainerRef) | 'root',
  arg2?: Type<any> | CyiaLoadHintConfig | InjectionToken<CyiaLoadHintConfig>) {
  return function (target, key: string, property: PropertyDescriptor) {
    const fn: Function = property.value;
    property.value = function () {
      let container: LoadingHintContainer;
      let component: Type<any>;
      let otherParam = {};
      if (typeof arg1 === 'string' && arg1 === 'root') {
        container = arg1;
      } else if (typeof arg1 === 'function') {
        container = arg1(this);
      } else if (typeof arg1 === 'object') {
        container = arg1.container instanceof Function ? arg1.container(this) : arg1.container;
        otherParam = arg1;
        ({ component } = arg1);
      }
      if (arg2 && (arg2.hasOwnProperty('component'))) {
        component = (arg2 as any).component;
        otherParam = arg2;
      } else if (arg2 && !(arg2 instanceof InjectionToken)) {
        component = arg2 as any;
      }
      const installConfig: InstallConfig = {
        ...DEFAULT_INSTALL_CONFIG,
        ...otherParam,
        container,
        component,
        token: arg2 instanceof InjectionToken ? arg2 : undefined
      };
      LoadingHintService.install(installConfig);

      const res = fn.call(this, arguments);
      if (ɵisPromise(res)) {
        return res.then((value) => {
          return LoadingHintService.uninstall(installConfig, value).toPromise();
        });
      } else if (ɵisObservable(res)) {
        return res.pipe(
          switchMap((value) => LoadingHintService.uninstall(installConfig, value))
        );
      }
      return res;
    };

    return property;
  };
}
