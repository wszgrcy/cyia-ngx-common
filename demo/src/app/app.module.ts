import { requestList } from './requestlist';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CyiaHttpModule } from 'cyia-ngx-common';
// import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { LoadModule } from './load/load.module';
import { LoadingTestModule } from './loading-test/loading-test.module';
import { CyiaLoadingHintModule, CyiaLoadingHintUninstall } from 'cyia-ngx-common/loading-hint';
import { LOAD_HINT_TOKEN } from './token';
import { LoadComponent } from './load/load.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // HttpClientModule,
    CyiaHttpModule.forRoot(requestList),
    BrowserAnimationsModule,
    MatSnackBarModule,
    LoadModule,
    LoadingTestModule,
    CyiaLoadingHintModule
  ],
  providers: [
    {
      provide: LOAD_HINT_TOKEN,
      useValue: {
        component: LoadComponent,
        blockReturn: true,
        uninstallMod: CyiaLoadingHintUninstall.component
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
