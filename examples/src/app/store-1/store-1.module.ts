import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store1Component } from './store-1.component';
import { CyiaStoreModule } from 'cyia-ngx-common/store';
import { StoreModule } from '@ngrx/store';
import { Store1Store } from './store-1.store';
const MAIN_TOKEN = new InjectionToken('');

@NgModule({
  imports: [
    CommonModule,
    CyiaStoreModule.forRoot({ token: MAIN_TOKEN, stores: [Store1Store] }),
    StoreModule.forRoot(MAIN_TOKEN),
  ],
  declarations: [Store1Component],
})
export class Store1Module {}
