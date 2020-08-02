import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadComponent } from './lazy-load.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [LazyLoadComponent],
})
export class LazyLoadModule {
  entry = LazyLoadComponent;
}
