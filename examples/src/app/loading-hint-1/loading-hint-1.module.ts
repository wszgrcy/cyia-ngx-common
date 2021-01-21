import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingHint1Component } from './loading-hint-1.component';
import { CyiaLoadingHintModule } from 'cyia-ngx-common/loading-hint';
import { LoadingModule } from './loading/loading.module';
@NgModule({
  imports: [CommonModule, CyiaLoadingHintModule, LoadingModule],
  declarations: [LoadingHint1Component],
})
export class LoadingHint1Module {}
