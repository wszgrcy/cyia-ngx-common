import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Repository1Component } from './repository-1.component';
import { CyiaRepositoryModule } from 'cyia-ngx-common/repository';

@NgModule({
  imports: [CommonModule, CyiaRepositoryModule],
  declarations: [Repository1Component],
  exports: [Repository1Component],
})
export class Repository1Module {}
