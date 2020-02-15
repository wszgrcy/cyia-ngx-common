import { NgModule } from '@angular/core';
import { LoadingHintService } from './load-hint.service';

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
