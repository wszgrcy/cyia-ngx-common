import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToBeLoadComponent } from './to-be-load.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ToBeLoadComponent],
})
export class ToBeLoadModule {
  entry = ToBeLoadComponent;
}
