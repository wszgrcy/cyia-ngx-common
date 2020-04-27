import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaRepositoryService } from './repository.service';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description 通过使用特定装饰器装饰过的类进行获得强类型化数据返回的一个模块
 * @docs-module
 * @export
 * @class CyiaRepositoryModule
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [HttpClientModule],
  providers: [CyiaRepositoryService],
})
export class CyiaRepositoryModule {}
