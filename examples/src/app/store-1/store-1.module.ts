import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store1Component } from './store-1.component';
import { CyiaStoreModule, getReducerMap } from 'cyia-ngx-common/store';
import { StoreModule } from '@ngrx/store';
import { Store1Store } from './store-1.store';

@NgModule({
  imports: [CommonModule, CyiaStoreModule, StoreModule.forRoot(getReducerMap([Store1Store]))],
  declarations: [Store1Component],
})
export class Store1Module {}
