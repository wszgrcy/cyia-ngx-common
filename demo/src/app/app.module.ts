import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
// import { CyiaHttpModule } from 'cyia-ngx-common';
// import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadModule } from './load/load.module';
import { LoadingTestModule } from './loading-test/loading-test.module';
import { CyiaLoadingHintModule, CyiaLoadingHintUninstall } from 'cyia-ngx-common/loading-hint';
import { LOAD_HINT_TOKEN } from './token';
import { LoadComponent } from './load/load.component';
import { CyiaRepositoryModule } from 'cyia-ngx-common/repository';
import { LazyLoadModule, createWebComponent } from 'cyia-ngx-common/lazy-load';
import { FormsModule } from '@angular/forms';
import { MonacoTextmateTestModule } from './monaco-textmate-test/monaco-textmate-test.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // HttpClientModule,
    // CyiaHttpModule.forRoot(requestList),
    BrowserAnimationsModule,
    MatSnackBarModule,
    LoadModule,
    LoadingTestModule,
    CyiaLoadingHintModule,
    CyiaRepositoryModule,
    FormsModule,
    MonacoTextmateTestModule,
    LazyLoadModule.forRoot([
      [
        'lazy-load',
        (injector, compiler) =>
          import('./lazy-load/lazy-load.module').then((e) =>
            createWebComponent(injector, compiler, e.LazyLoadModule, 'lazy-load')
          ),
      ],
    ]),
  ],
  providers: [
    {
      provide: LOAD_HINT_TOKEN,
      useValue: {
        component: LoadComponent,
        blockReturn: true,
        uninstallMod: CyiaLoadingHintUninstall.component,
      },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
