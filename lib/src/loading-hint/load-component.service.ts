import {
  Injectable, Inject, Type, ViewContainerRef,
  ComponentFactoryResolver, Injector, ApplicationRef,
  ComponentRef,
  Optional,
  InjectionToken
} from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CYIA_LOADING_HINT_COMPONENT } from './token';
import { CyiaLoadHintConfig, InstallConfig, LoadingHintContainer } from './type';

@Injectable()
export class LoadingHintService {
  static install = new Subject<InstallConfig>();
  static uninstall = new Subject<ViewContainerRef | 'root'>();
  static map = new Map<LoadingHintContainer, ComponentRef<any>>();
  constructor(
    @Optional() @Inject(CYIA_LOADING_HINT_COMPONENT) globalLoadingComponent: Type<any>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private document: any
  ) {
    LoadingHintService.install.subscribe((item) => {
      let config: InstallConfig = item as any;
      if (item && item.token) {
        config = { ...config, ...this.injector.get(item.token) };
      }
      config.component = config.component || globalLoadingComponent;
      this.install(config.container, config.component);
    });
    LoadingHintService.uninstall.subscribe((item) => {
      this.uninstall(item);
    });

  }

  install(viewContainerRef: LoadingHintContainer, component: Type<any>) {
    const blockEl: HTMLElement = viewContainerRef === 'root' ? this.document.body : viewContainerRef.element.nativeElement;
    const el = blockEl.insertAdjacentElement('beforebegin', this.document.createElement('div'));
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = componentFactory.create(this.injector, undefined, el);
    const loadingEl: HTMLElement = ref.location.nativeElement;
    loadingEl.style.position = 'absolute';
    loadingEl.style.width = `${blockEl.clientWidth}px`;
    loadingEl.style.height = `${blockEl.clientHeight}px`;
    this.applicationRef.attachView(ref.hostView);
    const marginLeft = blockEl.offsetLeft - loadingEl.offsetLeft;
    loadingEl.style.marginLeft = `${marginLeft}px`;
    LoadingHintService.map.set(viewContainerRef, ref);
  }
  uninstall(viewContainerRef: LoadingHintContainer) {
    const ref = LoadingHintService.map.get(viewContainerRef);
    if (ref) {
      try {
        ref.destroy();
      } catch (error) {
      }
    }
  }
}
