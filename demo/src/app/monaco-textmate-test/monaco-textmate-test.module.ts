import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoTextmateTestComponent } from './monaco-textmate-test.component';
import { MonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, MonacoTextmateModule.forRoot(), FormsModule,HttpClientModule],
  declarations: [MonacoTextmateTestComponent],
  exports: [MonacoTextmateTestComponent],
})
export class MonacoTextmateTestModule {}
