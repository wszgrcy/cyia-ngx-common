import { NgModule } from '@angular/core';
import { LoadingHintService } from './load-component.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [LoadingHintService]
})
export class CyiaLoadingHintModule {
  constructor(service: LoadingHintService) {
    service.start();
  }
}
