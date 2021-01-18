import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Compiler, Injector, ComponentFactoryResolver, DoBootstrap, ApplicationRef } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { EXAMPLE_GROUP } from './example-group';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: environment.production ? [] : [AppComponent],
})
export class AppModule implements DoBootstrap {
  constructor(private compiler: Compiler, private injector: Injector, private applicationRef: ApplicationRef) {}
  loadExample(selector: keyof typeof EXAMPLE_GROUP, element: HTMLElement, destroy$: Observable<void>) {
    const item = EXAMPLE_GROUP[selector];
    if (!item) {
      throw new Error('选择器有误:' + selector);
    }
    const moduleFactory = this.compiler.compileModuleSync(item.module);
    const moduleRef = moduleFactory.create(this.injector);
    const componentFac = moduleRef.componentFactoryResolver.resolveComponentFactory(item.component);
    const ref = componentFac.create(moduleRef.injector);
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
