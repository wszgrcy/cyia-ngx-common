import { NgModule, InjectionToken, ViewContainerRef, Type, Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { LoadingHint } from './loading-hint.decorator';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { LoadingHintService } from './load-component.service';
import { of, Subject } from 'rxjs';
import { CyiaLoadingHintUninstall, CyiaLoadHintOption } from './type';
import { CYIA_LOADING_HINT_COMPLETE$, CYIA_LOADING_HINT_CLOSE_FN } from './const';
import { CyiaLoadingHintModule } from './load-component.module';
import { CommonModule } from '@angular/common';

@Component({
  template: `<div class="loading__text">加载中</div><button class="close__button" (click)="close()" *ngIf="complete">完成</button>`,
  host: {
    'class': 'loading__hint'
  }
})
class LoadingTestComponent implements OnInit {
  // @HostBinding('class') loadingClass = 'loading__hint';
  complete = false;
  constructor(private cd: ChangeDetectorRef) {
    // this.cd.detectChanges();
  }
  ngOnInit(): void {
    (this[CYIA_LOADING_HINT_COMPLETE$] as Subject<any>).subscribe((val) => {
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
  <div style="width:100px;height:100px" #promiseTemplateRef >
  <button (click)="runPromise()">点击</button>
  <div class="test-anchor"></div>
  </div>

`,
  host: {
    class: 'test__component'
  }
})
class TestComponent {
  @ViewChild('promiseTemplateRef', { static: true, read: ViewContainerRef }) promiseContainerRef: ViewContainerRef;
  subject = new Subject();
  constructor() { }
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
    duration: 600,
    uninstallMod: CyiaLoadingHintUninstall.duration
  })
  loadingWithPromiseCloseWithDuration() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }
  @LoadingHint({
    container: (type: TestComponent) => type.promiseContainerRef,
    component: LoadingTestComponent,
    uninstallMod: CyiaLoadingHintUninstall.component
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
    blockReturn: true
  })
  loadingWithPromiseCloseWithComponentBlock() {
    return new Promise((res) => {
      setTimeout(() => {
        res(1000);
      }, 500);
    });
  }



}
@NgModule({
  imports: [CyiaLoadingHintModule, CommonModule],
  // providers: [LoadingHintService],
  declarations: [TestComponent, LoadingTestComponent],
  entryComponents: [LoadingTestComponent]
})
class TestModule {
  // constructor() {

  // }
}
describe('载入提示组件装饰器配置测试', () => {
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
    @LoadingHint(containerFn, { component: component, duration: 500, uninstallMod: CyiaLoadingHintUninstall.duration })
    async runConfigCloseWithDuration() {
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
      providers: [LoadingHintService, {
        provide: TOKEN, useValue: { component: component }
      }]
    });
    service = TestBed.get(LoadingHintService);

  });
  function testConfigAndResult(testConfig, testResult) {
    return new Promise((res, rej) => {
      const orgInstall = LoadingHintService.install;
      const orgUnInstall = LoadingHintService.uninstall;
      LoadingHintService.install = (config) => {
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
      LoadingHintService.uninstall = (config, result) => {
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
        expect(result).toBe(testResult);
        res();
        LoadingHintService.install = orgInstall;
        LoadingHintService.uninstall = orgUnInstall;
        return of(1);
      };

    });
  }
  it('以option加载配置', (done) => {
    testConfigAndResult({ container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.default }, 1000).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runOption();
  });
  it('以config加载配置', (done) => {
    testConfigAndResult({ container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.default }, 1000).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfig();
  });
  it('以token加载配置', (done) => {
    testConfigAndResult(
      { container: container, uninstallMod: CyiaLoadingHintUninstall.default, token: TOKEN }
      , 1000).then(() => {
        done();
      });
    const comp = new SubComponent();
    comp.runToken();
  });
  it('以option加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, component: component, uninstallMod: CyiaLoadingHintUninstall.default }
      , 1000).then(() => {
        done();
      });
    const comp = new SubComponent();
    comp.runOptionContainerWithRoot();
  });
  it('以config加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, component: component, uninstallMod: CyiaLoadingHintUninstall.default }
      , 1000).then(() => {
        done();
      });
    const comp = new SubComponent();
    comp.runConfigContainerWithRoot();
  });
  it('以token加载配置(root容器)', (done) => {
    testConfigAndResult(
      { container: ROOT_CONTAINER, uninstallMod: CyiaLoadingHintUninstall.default, token: TOKEN }
      , 1000).then(() => {
        done();
      });
    const comp = new SubComponent();
    comp.runTokenContainerWithRoot();
  });
  it('以config加载配置(组件控制关闭)', (done) => {
    testConfigAndResult({ container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.component }, 1000).then(() => {
      done();
    });
    const comp = new SubComponent();
    comp.runConfigCloseWithComponent();
  });
  it('以config加载配置(持续时间控制关闭)', (done) => {
    testConfigAndResult(
      { container: container, component: component, uninstallMod: CyiaLoadingHintUninstall.duration, duration: 500 }
      , 1000).then(() => {
        done();
      });
    const comp = new SubComponent();
    comp.runConfigCloseWithDuration();
  });


});
describe('载入提示组件运行测试', () => {


  let service: LoadingHintService;
  let componentFixture: ComponentFixture<TestComponent>;
  let componentInstance: TestComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [TestComponent, LoadingTestComponent],
      // providers: [LoadingHintService],
      imports: [TestModule]
    }).compileComponents();
    service = TestBed.get(LoadingHintService);
    // component = TestBed.get(TestComponent)
  }));
  beforeEach(() => {
    componentFixture = TestBed.createComponent(TestComponent);
    componentInstance = componentFixture.componentInstance;
  });
  it('异步返回关闭模式', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.subject.subscribe((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      done();
    });
    componentInstance.runPromise();
    const loadingHintEl: HTMLElement = document.querySelector('.test__component .loading__hint');
    const el = loadingHintEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    const testEl = document.querySelector('.test__component .loading__hint+div');
    expect(testEl).toBeTruthy();
    expect(testEl.querySelector('.test-anchor')).toBeTruthy();
    expect(loadingHintEl.clientWidth).toEqual(testEl.clientWidth);
    expect(loadingHintEl.clientHeight).toEqual(testEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('定时关闭模式', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();
    componentInstance.loadingWithPromiseCloseWithDuration().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
      done();
    });
    const loadingHintEl: HTMLElement = document.querySelector('.test__component .loading__hint');
    const el = loadingHintEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    const testEl = document.querySelector('.test__component .loading__hint+div');
    expect(testEl).toBeTruthy();
    expect(testEl.querySelector('.test-anchor')).toBeTruthy();
    expect(loadingHintEl.clientWidth).toEqual(testEl.clientWidth);
    expect(loadingHintEl.clientHeight).toEqual(testEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('组件关闭模式', async (done) => {
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
    const loadingHintEl: HTMLElement = document.querySelector('.test__component .loading__hint');
    const el = loadingHintEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    const testEl = document.querySelector('.test__component .loading__hint+div');
    expect(testEl).toBeTruthy();
    expect(testEl.querySelector('.test-anchor')).toBeTruthy();
    expect(loadingHintEl.clientWidth).toEqual(testEl.clientWidth);
    expect(loadingHintEl.clientHeight).toEqual(testEl.clientHeight);
    // expect(loadingHintEl.style.pointerEvents).toEqual('')
  });
  it('组件关闭模式(阻塞)', async (done) => {
    componentFixture.autoDetectChanges(true);
    const start = Date.now();

    componentInstance.loadingWithPromiseCloseWithComponentBlock().then((val) => {
      expect(val).toBe(1000);
      expect(Date.now() - start).toBeGreaterThanOrEqual(500);
    });
    const loadingHintEl: HTMLElement = document.querySelector('.test__component .loading__hint');
    const el = loadingHintEl.querySelector('.loading__text');
    expect(el).toBeTruthy();
    const testEl = document.querySelector('.test__component .loading__hint+div');
    expect(testEl).toBeTruthy();
    expect(testEl.querySelector('.test-anchor')).toBeTruthy();
    expect(loadingHintEl.clientWidth).toEqual(testEl.clientWidth);
    expect(loadingHintEl.clientHeight).toEqual(testEl.clientHeight);
    setTimeout(() => {
      let btn: HTMLButtonElement = loadingHintEl.querySelector('.close__button');
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
});
