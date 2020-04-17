import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaRepositoryService } from './repository.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [HttpClientModule],
  providers: [CyiaRepositoryService],
})
export class CyiaRepositoryModule {}