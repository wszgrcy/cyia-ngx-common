import {
  Injectable, Inject, Type, ViewContainerRef,
  ComponentFactoryResolver, Injector, ApplicationRef,
  ComponentRef,
  Optional,
  InjectionToken
} from '@angular/core';
import { Subject, timer, of, from, fromEvent, partition, BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CYIA_LOADING_HINT_COMPONENT } from './token';
import { CyiaLoadHintConfig, InstallConfig, LoadingHintContainer, CyiaLoadingHintUninstall, UnInstallConfig } from './type';
import { filter, take, map, switchMap } from 'rxjs/operators';
import { CYIA_LOADING_HINT_CLOSE_FN, CYIA_LOADING_HINT_COMPLETE$ } from './const';

@Injectable()
export class LoadingHintService {
  constructor(
    @Optional() @Inject(CYIA_LOADING_HINT_COMPONENT) private globalLoadingComponent: Type<any>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private document: any
  ) { }
  /**
   *  1.载入组件关闭,分为异步结束(默认),定时,及组件控制
   *  2.在异步结束时传入信号(方法的返回值)给载入组件(仅在组件控制时使用)
   *  3.设置超时自动关闭
   *  4.关闭类型为组件时,是否设置组件阻塞关闭
   *
   */
  private static install$ = new Subject<InstallConfig>();
  private static uninstall$ = new Subject<UnInstallConfig>();
  private static componentRefMap = new Map<LoadingHintContainer, ComponentRef<any>>();
  private static configMap = new Map<LoadingHintContainer, InstallConfig>();
  /**非自动控制的组件列表 */
  private unAutoControlList: InstallConfig[] = [];
  static install(value: InstallConfig) {
    LoadingHintService.install$.next(value);
  }
  static uninstall(config: InstallConfig, result?: any) {
    config = LoadingHintService.configMap.get(config.container);
    const componentRef = LoadingHintService.componentRefMap.get(config.container);
    let observable: Observable<any>;
    if (!config.blockReturn) {
      observable = of(result).pipe(take(1));
    } else {
      if (componentRef) {
        observable = from(new Promise<any>((res) => {
          componentRef.onDestroy(() => res(result));
        }));
      } else {
        observable = of(result);
      }
    }
    LoadingHintService.uninstall$.next({ container: config.container, result });
    return observable.pipe(take(1));
  }
  start() {
    this.installListen();
    this.uninstallListen();
  }
  private installListen() {
    LoadingHintService.install$.subscribe((item) => {
      let config: InstallConfig = item;
      if (item && item.token) {
        config = { ...config, ...this.injector.get(item.token) };
      }
      config.component = config.component || this.globalLoadingComponent;
      LoadingHintService.configMap.set(config.container, config);
      switch (config.uninstallMod) {
        case CyiaLoadingHintUninstall.duration:
          this.unAutoControlList.push(config);
          timer(config.duration).subscribe(() => {
            const i = this.unAutoControlList.findIndex((unAutoControlItem) => config === unAutoControlItem);
            this.unAutoControlList.splice(i, 1);
            LoadingHintService.uninstall(config);
          });
          break;
        case CyiaLoadingHintUninstall.component:
          this.unAutoControlList.push(config);
          break;
        default:
          break;
      }
      // doc 超时会执行自动关闭
      if (config.timeout) {
        timer(config.timeout).subscribe(() => {
          this.timeoutUninstall(config.container);
        });
      }
      this.install(config.container, config.component);
    });
  }
  private uninstallListen() {
    const [autoUninstall, sendEvent] = partition(LoadingHintService.uninstall$,
      (item) => !this.unAutoControlList.find((unAutoControlItem) => unAutoControlItem.container === item.container)
    );
    autoUninstall
      .subscribe((item) => {
        this.autoUninstall(item.container);
      });
    sendEvent.subscribe((item) => {
      this.sendEvent(item);
    });
  }


  install(viewContainerRef: LoadingHintContainer, component: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let loadingHintElement: HTMLElement = LoadingHintService.componentRefMap.get(viewContainerRef) &&
      LoadingHintService.componentRefMap.get(viewContainerRef).location.nativeElement;
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
    componentRef.changeDetectorRef.detectChanges();
    if (viewContainerRef !== 'root') {
      const marginLeft = blockEl.offsetLeft - loadingHintElement.offsetLeft;
      loadingHintElement.style.marginLeft = `${marginLeft}px`;
    }
    LoadingHintService.componentRefMap.set(viewContainerRef, componentRef);
  }
  autoUninstall(viewContainerRef: LoadingHintContainer) {
    this.uninstall(viewContainerRef);
  }
  uninstall(viewContainerRef: LoadingHintContainer) {
    const ref = LoadingHintService.componentRefMap.get(viewContainerRef);
    if (ref) {
      try {
        ref.destroy();
      } catch (error) {
        console.error(error);
      }
      LoadingHintService.componentRefMap.delete(viewContainerRef);
    }
  }
  sendEvent(unInstallConfig: UnInstallConfig) {
    const ref = LoadingHintService.componentRefMap.get(unInstallConfig.container);
    if (ref) {
      try {
        (<Subject<any>>ref.instance[CYIA_LOADING_HINT_COMPLETE$]).next(unInstallConfig.result);
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
