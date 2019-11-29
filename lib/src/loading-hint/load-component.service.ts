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
    @Inject(DOCUMENT) private document: Document
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let loadingHintElement: HTMLElement = LoadingHintService.map.get(viewContainerRef) &&
    LoadingHintService.map.get(viewContainerRef).location.nativeElement;
    let blockEl: HTMLElement;
    // doc 如果该元素上已生成加载组件,跳过
    if (loadingHintElement) { return; }
    if (viewContainerRef === 'root') {
      loadingHintElement = this.document.body.insertAdjacentElement('afterbegin', this.document.createElement('div')) as any;
      blockEl = this.document.body;
    } else {
      blockEl = viewContainerRef.element.nativeElement;
      loadingHintElement = blockEl.insertAdjacentElement('beforebegin', this.document.createElement('div')) as any;

    }
    const ref = componentFactory.create(this.injector, undefined, loadingHintElement);
    loadingHintElement = ref.location.nativeElement;
    loadingHintElement.style.position = 'absolute';
    loadingHintElement.style.width = `${blockEl.clientWidth}px`;
    loadingHintElement.style.height = `${blockEl.clientHeight}px`;
    this.applicationRef.attachView(ref.hostView);
    if (viewContainerRef !== 'root') {
      const marginLeft = blockEl.offsetLeft - loadingHintElement.offsetLeft;
      loadingHintElement.style.marginLeft = `${marginLeft}px`;
    }
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
