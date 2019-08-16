import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
// import { CyiaHttpModule } from './http.module';
// import { Entity } from '../decorator/entity/entity.decorator';
// import { Source } from '../type/options/entity.options';
// import { PrimaryColumn } from '../decorator/entity/columns/primary-column.decorator';
// import { ManyToOne } from '../decorator/entity/property/many-to-one.decorator';
// import { OneToMany } from '../decorator/entity/property/one-to-many.decorator';
// import { OneToOne } from '../decorator/entity/property/one-to-one.decorator';
import "../test/test-one-to-one";
import "../test/test-many-to-one";
import '../test/test-one-to-many'
import { take, timeout } from 'rxjs/operators';
import { NgModule } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { OneToManyOnly } from '../test/testclass/one-to-many.class';
import { Many2OneOnlyEntity } from '../test/testclass/many-to-one.class';
import { One2OneOnlyEntity, One2OneMultiEntity } from '../test/testclass/one-to-one.class';
import { One21P2Entity, One21P3Entity } from '../test/testclass/base.class';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
describe('服务测试', () => {
  let service: CyiaHttpService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    })
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function One21Single() {
    let res = await service.getEntity(One2OneOnlyEntity)({}).pipe(take(1)).toPromise()
    console.log(res);
    expect(res).not.toBe(null)
    expect(res.p2 instanceof One21P2Entity).toBe(true)
    expect(res.p3 instanceof One21P3Entity).toBe(true)
  }
  /**一对一返回列表 */
  async function One21Multi() {
    let res = await service.getEntityList(One2OneMultiEntity)({}).pipe(take(1)).toPromise()
    console.log(res);
    expect(res).not.toBe(null)
    expect(res instanceof Array).toBe(true)
    res.forEach((item) => {
      expect(item.p2 instanceof One21P2Entity).toBe(true)
      expect(item.p3 instanceof One21P3Entity).toBe(true)
    })
  }
  it('一对一关系', async (done) => {
    await One21Single()
    return done()
  })
  it('一对一关系(数组)', async (done) => {
    console.log('一对一,数组');
    await One21Multi()
    return done()
  })
  it('一对一关系二次(数组)', async (done) => {
    console.log('一对一,二次,数组');
    await One21Multi()
    await One21Multi()
    return done()
  })
  it('一对一关系二次调用(测试仓库)', async (done) => {
    console.log('二次调用开始');
    await One21Single();
    await One21Single();
    console.log('二次调用结束');
    return done()
  })
  it('多对一关系', async (done) => {
    let res = await service.getEntity(Many2OneOnlyEntity)({}).pipe(take(1)).toPromise()
    console.log(res);
    expect(res).not.toBe(null)
    expect(res.p2.city).not.toBe(null)
    done()
    return true
  })
  it('一对多关系', async (done) => {
    let res = await service.getEntity(OneToManyOnly)({}).pipe(take(1)).toPromise()
    console.log(res);
    expect(res).not.toBe(null)
    expect(res.p2).not.toBe(null)
    expect(res.p2 instanceof Array).toBe(true)
    // expect(res.p2.length).toBeGreaterThanOrEqual(1)
    done()
    return true
  })
  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});

