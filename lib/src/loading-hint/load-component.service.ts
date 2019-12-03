import {
  Injectable, Inject, Type, ViewContainerRef,
  ComponentFactoryResolver, Injector, ApplicationRef,
  ComponentRef,
  Optional,
  InjectionToken
} from '@angular/core';
import { Subject, timer, of, from, fromEvent, partition, BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CYIA_LOADING_HINT_COMPONENT } from './token';
import { CyiaLoadHintConfig, InstallConfig, LoadingHintContainer, CyiaLoadingHintClose } from './type';
import { filter, take, map } from 'rxjs/operators';
import { CYIA_LOADING_HINT_CLOSE_FN, CYIA_LOADING_HINT_COMPLETE$ } from './const';

@Injectable()
export class LoadingHintService {
  /**
   *  1.载入组件关闭,分为异步结束(默认),定时,及组件控制
   *  2.在异步结束时传入信号给载入组件(仅在组件控制时使用)
   *  3.设置超时自动关闭
   * todo 4.是否设置组件阻塞关闭
   */
  static install$ = new Subject<InstallConfig>();
  static uninstall$ = new Subject<ViewContainerRef | 'root'>();
  static map = new Map<LoadingHintContainer, ComponentRef<any>>();
  static unAutoControlList: InstallConfig[] = [];
  constructor(
    @Optional() @Inject(CYIA_LOADING_HINT_COMPONENT) globalLoadingComponent: Type<any>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    LoadingHintService.install$.subscribe((item) => {
      let config: InstallConfig = item as any;
      if (item && item.token) {
        config = { ...config, ...this.injector.get(item.token) };
      }
      config.component = config.component || globalLoadingComponent;
      switch (item.closeMod) {
        case CyiaLoadingHintClose.duration:
          LoadingHintService.unAutoControlList.push(item);
          timer(item.duration).subscribe(() => {
            const i = LoadingHintService.unAutoControlList.findIndex((unAutoControlItem) => item === unAutoControlItem);
            LoadingHintService.unAutoControlList.splice(i, 1);
            LoadingHintService.uninstall$.next(item.container);
          });
          break;
        case CyiaLoadingHintClose.component:
          LoadingHintService.unAutoControlList.push(item);
          break;
        default:
          break;
      }
      // doc 超时会执行自动关闭
      if (item.timeout) {
        timer(item.timeout).subscribe(() => {
          this.timeoutUninstall(item.container);
        });
      }
      this.install(config.container, config.component);
    });

    const [autoUninstall, sendEvent] = partition(LoadingHintService.uninstall$,
      (item) => !LoadingHintService.unAutoControlList.find((unAutoControlItem) => unAutoControlItem.container === item)
    );

    autoUninstall
      .subscribe((item) => {
        this.autoUninstall(item);
      });
    sendEvent.subscribe((item) => {
      this.sendEvent(item);
    });
  }
  /**
   * todo
   */
  static open(config: InstallConfig) {
    // const observable = LoadingHintService.install$.pipe(
    //   filter((anyconfig) => anyconfig === config),
    //   take(1),
    //   map((item) => {
    //     item.container
    //   })
    // );
    // LoadingHintService.install$.next(config);
    // return observable;
  }

  // static

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
    const componentRef = componentFactory.create(this.injector, undefined, loadingHintElement);
    componentRef.instance[CYIA_LOADING_HINT_CLOSE_FN] = () => {
      this.componentUninstall(viewContainerRef);
    };
    componentRef.instance[CYIA_LOADING_HINT_COMPLETE$] = new Subject();

    loadingHintElement = componentRef.location.nativeElement;
    loadingHintElement.style.position = 'absolute';
    loadingHintElement.style.width = `${blockEl.clientWidth}px`;
    loadingHintElement.style.height = `${blockEl.clientHeight}px`;
    this.applicationRef.attachView(componentRef.hostView);
    if (viewContainerRef !== 'root') {
      const marginLeft = blockEl.offsetLeft - loadingHintElement.offsetLeft;
      loadingHintElement.style.marginLeft = `${marginLeft}px`;
    }
    LoadingHintService.map.set(viewContainerRef, componentRef);
  }
  autoUninstall(viewContainerRef: LoadingHintContainer) {
    this.uninstall(viewContainerRef);
  }
  uninstall(viewContainerRef: LoadingHintContainer) {
    const ref = LoadingHintService.map.get(viewContainerRef);
    if (ref) {
      try {
        ref.destroy();
      } catch (error) {
        console.error(error);
      }
      LoadingHintService.map.delete(viewContainerRef);
    }
  }
  sendEvent(viewContainerRef: LoadingHintContainer) {
    const ref = LoadingHintService.map.get(viewContainerRef);
    if (ref) {
      try {
        (<Subject<any>>ref.instance[CYIA_LOADING_HINT_COMPLETE$]).next();
      } catch (error) {
        console.error(error);
      }
    }

  }
  /**超时 */
  timeoutUninstall(viewContainerRef: LoadingHintContainer) {
    this.uninstall(viewContainerRef);
  }
  componentUninstall(viewContainerRef: LoadingHintContainer) {
    this.uninstall(viewContainerRef);

  }
}
