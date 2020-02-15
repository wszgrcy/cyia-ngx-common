import {
  Injectable,
  Inject,
  Type,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ComponentRef,
  Optional
} from '@angular/core';
import { Subject, timer, of, from, fromEvent, partition, BehaviorSubject, Observable, merge } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CYIA_LOADING_HINT_COMPONENT } from './token';
import { InstallConfig, CyiaLoadingHintUninstall } from './type';
import { filter, take, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CYIA_LOADING_HINT_CLOSE_FN, CYIA_LOADING_HINT_RESULT$, CYIA_LOADING_HINT_PROGRESS_FN } from './const';
/**
 * 点击后 加入map
 * 等待可以执行后(延时),启动组件,
 * 等待关闭信号,关闭组件
 *
 * 当操作多个时,可以选择策略:后面的覆盖前面的,最先的一个,或者全部完成,或者自定义策略
 */
@Injectable()
export class LoadingHintService {
  constructor(
    @Optional() @Inject(CYIA_LOADING_HINT_COMPONENT) private globalLoadingComponent: Type<any>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private document: any
  ) {}
  /**全局转化到实例化使用 */
  private static install$ = new Subject<{ key: Symbol; value: InstallConfig }>();
  /**保存实例化后的组件 */
  private static componentRefMap = new Map<Symbol, ComponentRef<any>>();
  /**卸载组件 */
  public static uninstallMap = new Map<Symbol, Subject<any>>();
  /**进程组件 */
  public static progressMap = new Map<Symbol, Subject<any>>();
  public static restoreStatusMap = new Map<Symbol, Function>();
  inited = false;
  /**非自动控制的组件列表 */
  // private unAutoControlList: InstallConfig[] = [];
  /**装饰器内调用 */
  static install(key: Symbol, value: InstallConfig) {
    LoadingHintService.install$.next({ key, value });
  }
  /**装饰器内调用 */
  static uninstall(key: Symbol, config: InstallConfig, result?: any) {
    let bothStatusSubject: Observable<any>;
    if (config.blockReturn) {
      const uninstallSubject = LoadingHintService.uninstallMap.get(key);
      LoadingHintService.uninstallMap.delete(key);
      let progressSubject: Subject<any>;
      if (LoadingHintService.progressMap.has(key)) {
        progressSubject = LoadingHintService.progressMap.get(key);
      }
      bothStatusSubject = (progressSubject ? merge(uninstallSubject, progressSubject) : uninstallSubject).pipe(() =>
        of(result)
      );
    }
    if (LoadingHintService.componentRefMap.has(key)) {
      const componentref = LoadingHintService.componentRefMap.get(key);
      componentref.instance[CYIA_LOADING_HINT_RESULT$].next(result);
    }
    /**
     * 等待完成返回
     * 或者 数据返回,但是依旧等待组件完成
     */
    if (config.blockReturn) {
      return bothStatusSubject;
    } else {
      return of(result);
    }
  }
  /**默认启动方法 */
  start() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    this.installSubscribe();
  }
  private async install(key: Symbol, config: InstallConfig) {
    // todo 可设置当执行完某函数后启动
    await Promise.resolve();

    this.startupComponent(key, config);
    const uninstallSubject = new Subject();
    LoadingHintService.uninstallMap.set(key, uninstallSubject);
    LoadingHintService.progressMap.set(key, new Subject());
    // doc 组件未发送完成超时或未收到返回自动取消
    if (config.timeout && !Number.isNaN(config.timeout)) {
      timer(config.timeout)
        .pipe(takeUntil(uninstallSubject))
        .subscribe(() => {
          this.timeoutUninstall(key);
        });
    }
  }
  private getConfig(item: InstallConfig) {
    let config: InstallConfig = item;
    if (item && item.token) {
      config = { ...config, ...this.injector.get(item.token) };
    }
    config.component = config.component || this.globalLoadingComponent;
    return config;
  }

  private installSubscribe() {
    LoadingHintService.install$.subscribe((item) => {
      const config = this.getConfig(item.value);
      this.install(item.key, config);
    });
  }

  private startupComponent(key: Symbol, { container, component }: InstallConfig) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let loadingHintElement: HTMLElement =
      LoadingHintService.componentRefMap.get(key) && LoadingHintService.componentRefMap.get(key).location.nativeElement;
    /**被阻止的元素 */
    let blockedElement: HTMLElement;
    // doc 如果该元素上已生成加载组件,跳过
    if (loadingHintElement) {
      return;
    }
    if (container === 'root') {
      blockedElement = this.document.body;
    } else {
      blockedElement = container.element.nativeElement;
    }
    /**
     * 卸载组件后还原
     */
    const position = blockedElement.style.position;
    const fn = () => {
      blockedElement.style.position = position;
    };
    LoadingHintService.restoreStatusMap.set(key, fn);

    loadingHintElement = this.document.createElement('div');
    blockedElement.appendChild(loadingHintElement);
    blockedElement.style.position = 'relative';
    const componentRef = componentFactory.create(this.injector, undefined, loadingHintElement);
    // doc 赋值卸载时函数, 手动操作时使用
    componentRef.instance[CYIA_LOADING_HINT_CLOSE_FN] = () => {
      this.manualUninstallComponent(key);
    };
    // doc 赋值过程时函数, 手动操作时使用
    componentRef.instance[CYIA_LOADING_HINT_PROGRESS_FN] = () => {
      this.manualProgressComponent(key);
    };
    // doc 完成事件, 手动操作时使用
    componentRef.instance[CYIA_LOADING_HINT_RESULT$] = new Subject();

    loadingHintElement = componentRef.location.nativeElement;
    loadingHintElement.style.position = 'absolute';

    loadingHintElement.style.top = `0`;
    loadingHintElement.style.left = `0`;
    loadingHintElement.style.width = `100%`;
    loadingHintElement.style.height = `100%`;
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
    LoadingHintService.componentRefMap.set(key, componentRef);
  }

  private uninstall(key: Symbol) {
    if (LoadingHintService.componentRefMap.has(key)) {
      const ref = LoadingHintService.componentRefMap.get(key);
      try {
        ref.destroy();
      } catch (error) {
        console.error(error);
      }
      LoadingHintService.componentRefMap.delete(key);
      return true;
    }
    return false;
  }

  /**超时 */
  private timeoutUninstall(key: Symbol) {
    const result = this.uninstall(key);
    let subject: Subject<any>;
    if (LoadingHintService.uninstallMap.has(key)) {
      subject = LoadingHintService.uninstallMap.get(key);
    } else if (result) {
      subject = new Subject();
      LoadingHintService.uninstallMap.set(key, subject);
    }
    subject && subject.next();
    if (LoadingHintService.progressMap.has(key)) {
      LoadingHintService.progressMap.delete(key);
    }
    if (LoadingHintService.restoreStatusMap.has(key)) {
      LoadingHintService.restoreStatusMap.get(key)();
      LoadingHintService.restoreStatusMap.delete(key);
    }
  }
  /**由组件调用 */
  private manualUninstallComponent(key: Symbol) {
    this.uninstall(key);
    let subject: Subject<any>;
    if (LoadingHintService.uninstallMap.has(key)) {
      subject = LoadingHintService.uninstallMap.get(key);
    } else {
      subject = new Subject();
      LoadingHintService.uninstallMap.set(key, subject);
    }
    subject.next();
    LoadingHintService.progressMap.delete(key);
    if (LoadingHintService.restoreStatusMap.has(key)) {
      LoadingHintService.restoreStatusMap.get(key)();
      LoadingHintService.restoreStatusMap.delete(key);
    }
  }
  /**由组件调用 */
  private manualProgressComponent(key: Symbol) {
    let subject: Subject<any>;
    if (LoadingHintService.progressMap.has(key)) {
      subject = LoadingHintService.progressMap.get(key);
    } else {
      subject = new Subject();
      LoadingHintService.progressMap.set(key, subject);
    }
    subject.next();
  }
}
