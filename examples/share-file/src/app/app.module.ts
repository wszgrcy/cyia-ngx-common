import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ExampleModule, ExampleComponent } from './example-code';

@NgModule({
  declarations: [],
  imports: [BrowserModule, ExampleModule],
  providers: [],
  bootstrap: [ExampleComponent],
})
export class AppModule {}
