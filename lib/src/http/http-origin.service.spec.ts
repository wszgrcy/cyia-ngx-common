import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { OneToManyOnly as OneToManySingleEntity, OneToManyMultiEntity } from '../test/testclass/one-to-many.class';
import { Many2OneOnlyEntity as Many2OneSingleEntity, Many2OneMultiEntity } from '../test/testclass/many-to-one.class';
import { One2OneOnlyEntity, One2OneMultiEntity, One2OneOnlyTestReqEntity } from '../test/testclass/one-to-one.class';
import { One21P2Entity, One21P3Entity, Many2OneP2Entity } from '../test/testclass/base.class';
import { OneTOneChainEntity, OneTOneChainP2Entity, OneTOneChainP3Entity } from '../test/testclass/chain.class';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
describe('原始请求测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.get(CyiaHttpService);
  });

  it('请求参数(application/x-www-form-urlencoded)', async (done) => {
    const res = service.getEntity(One2OneOnlyTestReqEntity)({
      method: 'post',
      options: {
        body: 'a=1&b=123456&c=3432',
        headers: {
          test1: 'ceshi2',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    }).toPromise().catch((val) => {
      console.log('数据格式不正确', val);
    });
    console.log('返回数据?', res);
    done();
  });

});

