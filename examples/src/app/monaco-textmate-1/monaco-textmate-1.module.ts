import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoTextmate1Component } from './monaco-textmate-1.component';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule, CyiaMonacoTextmateModule.forRoot(), FormsModule],
  declarations: [MonacoTextmate1Component],
})
export class MonacoTextmate1Module {}
