import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoTextmateTestComponent } from './monaco-textmate-test.component';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, CyiaMonacoTextmateModule.forRoot(), FormsModule,HttpClientModule],
  declarations: [MonacoTextmateTestComponent],
  exports: [MonacoTextmateTestComponent],
})
export class MonacoTextmateTestModule {}
