import { BrowserModule, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import {
  NgModule,
  Compiler,
  Injector,
  DoBootstrap,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { EXAMPLE_GROUP } from './example-group';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { EVENT_MODIFIER_OPTIONS, EventModifiersPlugin } from '@cyia/ngx-common/event';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    EventModifiersPlugin,
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: EventModifiersPlugin,
      multi: true,
      deps: [DOCUMENT],
    },
    {
      provide: EVENT_MODIFIER_OPTIONS,
      useValue: {
        modifiers: {
          map: {
            prefix: (value) => {
              return `1${value}`;
            },
          },
        },
        componentOutput: true,
      },
    },
  ],
  bootstrap: environment.production ? [] : [AppComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private compiler: Compiler, private injector: Injector, private applicationRef: ApplicationRef) {}
  loadExample(selector: keyof typeof EXAMPLE_GROUP, element: HTMLElement, destroy$: Observable<void>) {
    const item = EXAMPLE_GROUP[selector];
    if (!item) {
      throw new Error('选择器有误:' + selector);
    }
    let ref;
    if (!item.module) {
      ref = createComponent(item.component, { environmentInjector: this.injector.get(EnvironmentInjector) });
    } else {
      const moduleFactory = this.compiler.compileModuleSync(item.module);
      const moduleRef = moduleFactory.create(this.injector);
      const componentFac = moduleRef.componentFactoryResolver.resolveComponentFactory(item.component);
      ref = componentFac.create(moduleRef.injector);
    }
    this.applicationRef.attachView(ref.hostView);
    element.appendChild(ref.location.nativeElement);
    ref.changeDetectorRef.detectChanges();
    destroy$.pipe(take(1)).subscribe(() => {
      ref.destroy();
    });
    return ref;
  }
  ngDoBootstrap() {}
}
