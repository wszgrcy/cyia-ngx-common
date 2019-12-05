import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingTestComponent } from './loading-test.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LoadingTestComponent],
  exports: [LoadingTestComponent]
})
export class LoadingTestModule {}
