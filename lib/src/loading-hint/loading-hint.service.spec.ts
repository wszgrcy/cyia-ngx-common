import {
  NgModule,
  InjectionToken,
  ViewContainerRef,
  Type,
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  provideZonelessChangeDetection,
} from '@angular/core';
import { LoadingHint } from './loading-hint.decorator';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingHintService } from './loading-hint.service';
import { of, Subject } from 'rxjs';
import { CyiaLoadingHintUninstall, CyiaLoadHintOption } from './type';
import { CYIA_LOADING_HINT_RESULT$, CYIA_LOADING_HINT_CLOSE_FN } from './const';
import { CyiaLoadingHintModule } from './loading-hint.module';
import { CommonModule } from '@angular/common';
import { delay } from '../test/util/async';

@Component({
  template: `
    <div class="loading__text">加载中</div>
    @if (complete) {
    <button class="close__button" (click)="close()">完成</button>
    }
  `,
  host: {
    class: 'cyia-loading-hint-component',
  },
})
class LoadingTestComponent implements OnInit {
  // @HostBinding('class') loadingClass = 'cyia-loading-hint-component';
  complete = false;
  constructor(private cd: ChangeDetectorRef) {
    // this.cd.detectChanges();
  }
  ngOnInit(): void {
    (this[CYIA_LOADING_HINT_RESULT$] as Subject<any>).subscribe((val) => {
      this.complete = true;
      this.cd.detectChanges();
    });
  }
  close() {
    this[CYIA_LOADING_HINT_CLOSE_FN]();
  }
}
@Component({
  template: `
    <div style="width:100px;height:100px" #promiseTemplateRef>
      <button (click)="runPromise()">点击</button>
      <div class="test-anchor"></div>
    </div>
  `,
  host: {
    class: 'test__component',
  },
})
class TestComponent {
  @ViewChild('promiseTemplateRef', { static: true, read: ViewContainerRef }) promiseContainerRef: ViewContainerRef;
  subject = new Subject();
  constructor() {}
  runPromise() {
    this.loadingWithPromise().then((res) => {
      this.subject.next(res);
    });
  }
  @LoadingHint({ container: (type: TestComponent) => type.promiseContainerRef, component: LoadingTestComponent })
  loadingWithPromise() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    timeout: 600,
    uninstallMod: CyiaLoadingHintUninstall.default,
  })
  loadingWithPromiseCloseWithTimeout() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component,
  })
  loadingWithPromiseCloseWithComponent() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component,
    timeout: 300,
  })
  loadingWithPromiseCloseWithComponentWithTimeoutbefore() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component,
    timeout: 600,
  })
  loadingWithPromiseCloseWithComponentWithTimeoutAfter() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component,
    timeout: 300,
    blockReturn: true,
  })
  loadingWithPromiseCloseWithComponentWithTimeoutWithBlockReturn() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component,
    blockReturn: true,
  })
  loadingWithPromiseCloseWithComponentBlock() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
  })
  loadingWithDefault(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    timeout: 500,
  })
  loadingWithDefaultWithTimeout(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    timeout: 1100,
    blockReturn: true,
  })
  loadingWithDefaultWithTimeoutWithBlock(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    delay: 100,
  })
  loadingWithDefaultWithTimeoutWithDelay(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,

    duration: 500,
  })
  loadingWithDurationBefore(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,
    duration: 1100,
  })
  loadingWithDurationAfter(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,
    duration: 1100,
    blockReturn: true,
  })
  loadingWithDurationAfterWithBlock(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,
    duration: 1100,
    delay: 100,
    blockReturn: true,
  })
  loadingWithDurationAfterWithBlockWithDelay(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,
    duration: 1100,
    delay: 50,
  })
  loadingWithDurationAfterWithDelay(number: number) {
    return delay(number);
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.duration,
    duration: 1100,
    delay: 150,
  })
  loadingWithDurationAfterWithDelay2(number: number) {
    return delay(number);
  }
}
@NgModule({
  imports: [CyiaLoadingHintModule, CommonModule],
  // providers: [LoadingHintService],
  declarations: [TestComponent, LoadingTestComponent],
})
class TestModule {
  // constructor() {
  // }
}
xdescribe('载入提示组件装饰器配置测试', () => {
  const container: ViewContainerRef = {} as any;
  const ROOT_CONTAINER: CyiaLoadHintOption['container'] = 'root';
  const containerFn = () => container;
  const component: Type<any> = {} as any;
  const TOKEN = new InjectionToken('token');
  class SubComponent {
    @LoadingHint({ container: containerFn, component: component })
    async runOption() {
      return 1000;
    }
    @LoadingHint(containerFn, { component: component })
    async runConfig() {
      return 1000;
    }
    @LoadingHint(containerFn, TOKEN)
    async runToken() {
      return 1000;
    }
    @LoadingHint({ container: ROOT_CONTAINER, component: component })
    async runOptionContainerWithRoot() {
      return 1000;
    }
    @LoadingHint(ROOT_CONTAINER, { component: component })
    async runConfigContainerWithRoot() {
      return 1000;
    }
    @LoadingHint(ROOT_CONTAINER, TOKEN)
    async runTokenContainerWithRoot() {
      return 1000;
    }
    @LoadingHint(containerFn, { component: component, timeout: 500, uninstallMod: CyiaLoadingHintUninstall.default })
    async runConfigCloseWithTimeout() {
      return 1000;
    }
    @LoadingHint(containerFn, { component: component, uninstallMod: CyiaLoadingHintUninstall.component })
    async runConfigCloseWithComponent() {
      return 1000;
    }
  }
  let service: LoadingHintService;
  // let loadingHintService=jasmine.createSpyObj('LoadingHintService')
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingHintService,
        {
          provide: TOKEN,
          useValue: { component: component },
        },
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(LoadingHintService);
  });
  function testConfigAndResult(testConfig, testResult) {
    return new Promise((res, rej) => {
      const orgInstall = LoadingHintService.install;
      const orgUnInstall = LoadingHintService.uninstall;
      LoadingHintService.install = (key, config) => {
        for (const x in config) {
          if (config.hasOwnProperty(x) && config[x] !== undefined) {
            expect(config[x]).toBe(testConfig[x]);
          }
        }
        for (const x in testConfig) {
          if (testConfig.hasOwnProperty(x) && testConfig[x] !== undefined) {
            expect(testConfig[x]).toBe(config[x]);
          }
        }
      };

      LoadingHintService.uninstall = (key, result) => {
        // const config = LoadingHintService.configMap.get(key);

        // for (const x in config) {
        //   if (config.hasOwnProperty(x) && config[x] !== undefined) {
        //     expect(config[x]).toBe(testConfig[x]);
        //   }
        // }
        // for (const x in testConfig) {
        //   if (testConfig.hasOwnProperty(x) && testConfig[x] !== undefined) {
        //     expect(testConfig[x]).toBe(config[x]);
        //   }
        // }
        // expect(result).toBe(testResult);
        res(undefined);
        LoadingHintService.install = orgInstall;
        LoadingHintService.uninstall = orgUnInstall;
        return of(1);
      };
    });
  }
  it('以option加载配置', (done) => {
    testConfigAndResult(
      { container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.default, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runOption();
  });
  it('以config加载配置', (done) => {
    testConfigAndResult(
      { container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.default, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfig();
  });
  it('以token加载配置', (done) => {
    testConfigAndResult(
      { container: container, uninstallMod: CyiaLoadingHintUninstall.default, token: TOKEN, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runToken();
  });
  it('以option加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, component: component, uninstallMod: CyiaLoadingHintUninstall.default, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runOptionContainerWithRoot();
  });
  it('以config加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, component: component, uninstallMod: CyiaLoadingHintUninstall.default, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfigContainerWithRoot();
  });
  it('以token加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, uninstallMod: CyiaLoadingHintUninstall.default, token: TOKEN, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runTokenContainerWithRoot();
  });
  it('以config加载配置(组件控制关闭)', (done) => {
    testConfigAndResult(
      { container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.component, delay: 0 },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfigCloseWithComponent();
  });
  it('以config加载配置(持续时间控制关闭)', (done) => {
    testConfigAndResult(
      {
        container: container,
        component: component,
        uninstallMod: CyiaLoadingHintUninstall.default,
        timeout: 500,
        delay: 0,
      },
      1000
    ).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfigCloseWithTimeout();
  });
});
xdescribe('载入提示组件运行测试', () => {
  function componentLoading() {
    const blockedEl: HTMLElement = document.querySelector('.test__component>div');
    const el = blockedEl.querySelector('.loading__text');
    expect(el).toBeTruthy('载入文字未找到');
    const loadingEl = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    expect(loadingEl).toBeTruthy('载入元素未找到');
    expect(blockedEl.clientWidth).toEqual(loadingEl.clientWidth);
    expect(blockedEl.clientHeight).toEqual(loadingEl.clientHeight);
  }
  /**判断组件是否关闭 */
  function componentClose(delay, expectValue, start: number, isclose: boolean) {
    expect(expectValue).toBe(delay);
    expect(Date.now() - start).toBeGreaterThanOrEqual(delay);
    const div = document.querySelector('.loading__text');
    if (isclose) {
      expect(div).toBeFalsy();
    } else {
      expect(div).toBeTruthy();
    }
  }
  let service: LoadingHintService;
  let componentFixture: ComponentFixture<TestComponent>;
  let componentInstance: TestComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [TestComponent, LoadingTestComponent],
      // providers: [LoadingHintService],
      imports: [TestModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    service = TestBed.inject(LoadingHintService);
    // component = TestBed.inject(TestComponent)
  });
  beforeEach(() => {
    componentFixture = TestBed.createComponent(TestComponent);
    componentInstance = componentFixture.componentInstance;
  });

  it('组件,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();

    componentInstance.loadingWithPromiseCloseWithComponent().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      setTimeout(() => {
        let btn: HTMLButtonElement = document.querySelector('.close__button');
        expect(btn).toBeTruthy();
        btn.click();
        setTimeout(() => {
          btn = document.querySelector('.close__button');
          expect(btn).toBeFalsy();
          done();
        }, 0);
      }, 0);
    });
    await delay(0);
    const loadingEl: HTMLElement = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    const blockEl = document.querySelector('.test__component>div');
    expect(blockEl.querySelector('.test-anchor')).toBeTruthy();
    const el = blockEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    expect(blockEl).toBeTruthy();
    expect(loadingEl.clientWidth).toEqual(blockEl.clientWidth);
    expect(loadingEl.clientHeight).toEqual(blockEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('组件,超时,Promise,返回>超时', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();

    componentInstance.loadingWithPromiseCloseWithComponentWithTimeoutbefore().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      setTimeout(() => {
        const btn: HTMLButtonElement = document.querySelector('.close__button');
        expect(btn).toBeFalsy();
        done();
      }, 0);
    });
    await delay(0);
    const loadingEl: HTMLElement = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    const blockEl = document.querySelector('.test__component>div');
    expect(blockEl.querySelector('.test-anchor')).toBeTruthy();
    const el = blockEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    expect(blockEl).toBeTruthy();
    expect(loadingEl).toBeTruthy();
    expect(loadingEl.clientWidth).toEqual(blockEl.clientWidth);
    expect(loadingEl.clientHeight).toEqual(blockEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('组件,超时,Promise,返回<超时', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithPromiseCloseWithComponentWithTimeoutAfter().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      setTimeout(() => {
        let btn: HTMLButtonElement = document.querySelector('.close__button');
        expect(btn).toBeTruthy();
        setTimeout(() => {
          btn = document.querySelector('.close__button');
          expect(btn).toBeFalsy();
          done();
        }, 100);
      }, 0);
    });
    await delay(0);
    const loadingEl: HTMLElement = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    const blockEl = document.querySelector('.test__component>div');
    expect(blockEl.querySelector('.test-anchor')).toBeTruthy();
    const el = blockEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    expect(blockEl).toBeTruthy();
    expect(loadingEl.clientWidth).toEqual(blockEl.clientWidth);
    expect(loadingEl.clientHeight).toEqual(blockEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('组件,超时,Promise,返回>超时,阻塞)', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();

    componentInstance.loadingWithPromiseCloseWithComponentWithTimeoutWithBlockReturn().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      setTimeout(() => {
        const btn: HTMLButtonElement = document.querySelector('.close__button');
        expect(btn).toBeFalsy();
        done();
      }, 0);
    });
    await delay(0);
    const loadingEl: HTMLElement = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    const blockEl = document.querySelector('.test__component>div');
    expect(blockEl.querySelector('.test-anchor')).toBeTruthy();
    const el = blockEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    expect(blockEl).toBeTruthy();
    expect(loadingEl.clientWidth).toEqual(blockEl.clientWidth);
    expect(loadingEl.clientHeight).toEqual(blockEl.clientHeight);
  });
  it('组件,Promise,阻塞', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();

    componentInstance.loadingWithPromiseCloseWithComponentBlock().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      expect(Date.now() - start).toBeLessThan(600);
      const btn = document.querySelector('.close__button');
      expect(btn).toBeFalsy();
    });
    await delay(0);
    const blockedEl: HTMLElement = document.querySelector('.test__component>div');
    const el = blockedEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    const loadingEl = document.querySelector('.test__component .test-anchor+.cyia-loading-hint-component');
    expect(loadingEl).toBeTruthy();
    expect(blockedEl.clientWidth).toEqual(loadingEl.clientWidth);
    expect(blockedEl.clientHeight).toEqual(loadingEl.clientHeight);

    setTimeout(() => {
      let btn: HTMLButtonElement = loadingEl.querySelector('.close__button');
      expect(btn).toBeTruthy();
      btn.click();
      setTimeout(() => {
        btn = document.querySelector('.close__button');
        expect(btn).toBeFalsy();
        done();
      }, 0);
    }, 550);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('默认,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDefault(1000).then((val) => {
      componentClose(1000, val, start, true);
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('默认>超时,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDefaultWithTimeout(1000).then((val) => {
      componentClose(1000, val, start, true);
      done();
    });
    await delay(0);
    componentLoading();
    await delay(600);
    const btn = document.querySelector('.loading__text');
    console.log(btn);
    expect(btn).toBeFalsy('应该找不到关闭组件');
  });
  it('默认>超时,Promise,阻塞(默认+阻塞无意义)', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDefaultWithTimeoutWithBlock(1000).then((val) => {
      componentClose(1000, val, start, true);
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('默认,延时,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDefaultWithTimeoutWithDelay(1000).then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(1100);
      const div = document.querySelector('.loading__text');
      expect(div).toBeFalsy();
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续<返回,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDurationBefore(1000).then((val) => {
      componentClose(1000, val, start, true);
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续>返回,Promise', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDurationAfter(1000).then(async (val) => {
      componentClose(1000, val, start, false);
      await delay(100);
      const div = document.querySelector('.loading__text');
      expect(div).toBeFalsy();

      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续>返回,Promise,阻塞', async (done) => {
    componentFixture.detectChanges();
    const start = Date.now();
    componentInstance.loadingWithDurationAfterWithBlock(1000).then(async (val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(1100);
      const div = document.querySelector('.loading__text');
      expect(div).toBeFalsy();
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续>返回,Promise,阻塞,延时', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDurationAfterWithBlockWithDelay(1000).then(async (val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(1200);
      const div = document.querySelector('.loading__text');
      expect(div).toBeFalsy();
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续>返回,Promise,延时', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDurationAfterWithDelay(1000).then(async (val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(1050);
      expect(Date.now() - start).toBeLessThanOrEqual(1149);
      const div = document.querySelector('.loading__text');
      expect(div).toBeTruthy();
      done();
    });
    await delay(0);
    componentLoading();
  });
  it('指定持续-返回=延时,Promise,', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithDurationAfterWithDelay2(1000).then(async (val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(1150);
      expect(Date.now() - start).toBeLessThanOrEqual(1249);
      const div = document.querySelector('.loading__text');
      expect(div).toBeFalsy();
      done();
    });
    await delay(0);
    componentLoading();
  });
});
