import { HttpClientModule } from '@angular/common/http';
import { CyiaHttpService } from './http.service';
import { RequestItem, CyiaHttpModuleConfig } from './http.define';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { REQUEST_LIST } from './http.token';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: []
})
export class CyiaHttpModule {
  // static forRoot(config?: CyiaHttpModuleConfig): ModuleWithProviders
  static forRoot(requestList?: RequestItem[]): ModuleWithProviders<CyiaHttpModule> {
    return {
      ngModule: CyiaHttpModule,
      providers: [{ provide: REQUEST_LIST, useValue: requestList }, CyiaHttpService]
    };
  }
}
