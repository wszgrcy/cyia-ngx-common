import { NgModule } from '@angular/core';
import { LoadingHintService } from './loading-hint.service';

/**
 * @docs-module
 * @docs-overview ./loading-hint.md
 * @author cyia
 * @date 2020-07-21
 * @export
 * @class CyiaLoadingHintModule
 */
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [LoadingHintService],
})
export class CyiaLoadingHintModule {
  constructor(service: LoadingHintService) {
    service.start();
  }
}
