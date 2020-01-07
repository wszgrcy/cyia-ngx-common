import { TestBed } from '@angular/core/testing';

import { take, timeout } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CyiaHttpService } from '../../../http/http.service';
import { requestFactory } from '../../util/test-request';
import './many-to-one.mock';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService]
})
class TestHttpModule {}
describe('多对一标准测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  const request = requestFactory(service);
  // doc 应该描述为请求一项,返回带有一对一关系的实体
  // it('请求单项,返回带有一对一单项', async (done) => {

  //   return done();
  // });
});
