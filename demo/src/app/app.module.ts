import { requestList } from './requestlist';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CyiaHttpModule } from 'cyia-ngx-common';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // HttpClientModule,
    CyiaHttpModule.forRoot(requestList)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
