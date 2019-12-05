import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
// import { CyiaHttpModule } from './http.module';
// import { Entity } from '../decorator/entity/entity.decorator';
// import { Source } from '../type/options/entity.options';
// import { PrimaryColumn } from '../decorator/entity/columns/primary-column.decorator';
// import { ManyToOne } from '../decorator/entity/property/many-to-one.decorator';
// import { OneToMany } from '../decorator/entity/property/one-to-many.decorator';
// import { OneToOne } from '../decorator/entity/property/one-to-one.decorator';
import '../test/mock-one-to-one';
import '../test/mock-many-to-one';
import '../test/mock-one-to-many';
import { take, timeout } from 'rxjs/operators';
import { NgModule } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { OneToManyOnly as OneToManySingleEntity, OneToManyMultiEntity } from '../test/testclass/one-to-many.class';
import { Many2OneOnlyEntity as Many2OneSingleEntity, Many2OneMultiEntity } from '../test/testclass/many-to-one.class';
import { One2OneOnlyEntity, One2OneMultiEntity } from '../test/testclass/one-to-one.class';
import { One21P2Entity, One21P3Entity, Many2OneP2Entity } from '../test/testclass/base.class';
import { OneTOneChainEntity, OneTOneChainP2Entity, OneTOneChainP3Entity } from '../test/testclass/chain.class';
import '../test/mock-chain';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
xdescribe('服务测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function one21Chain() {
    const res = await service.getEntity(OneTOneChainEntity)({}).pipe(take(1)).toPromise();
    console.log('查看一对一返回', res);
    expect(res).not.toBe(null);
    expect(res.second instanceof OneTOneChainP2Entity).toBe(true);
    // doc 没有设计链式请求,所以必然失败
    expect(res.second.thrid instanceof OneTOneChainP3Entity).toBe(true, '没有找到第三层,暂时还未设计');
  }


  it('一对一->一对一', async (done) => {
    await one21Chain();
    return done();
  });

  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});

