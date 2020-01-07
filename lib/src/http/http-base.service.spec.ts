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

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService]
})
class TestHttpModule {}
describe('服务测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function one21Single() {
    const res = await service
      .getEntity(One2OneOnlyEntity)({})
      .pipe(take(1))
      .toPromise();
    expect(res).not.toBe(null);
    expect(res.p2 instanceof One21P2Entity).toBe(true);
    expect(res.p3 instanceof One21P3Entity).toBe(true);
  }

  /**一对一返回列表 */
  async function one21Multi() {
    const res = await service
      .getEntityList(One2OneMultiEntity)({})
      .pipe(take(1))
      .toPromise();
    console.log(res);
    expect(res).not.toBe(null);
    expect(res instanceof Array).toBe(true);
    res.forEach((item) => {
      expect(item.p2 instanceof One21P2Entity).toBe(true);
      expect(item.p3 instanceof One21P3Entity).toBe(true);
    });
  }
  /**多对一,单一*/
  async function many21Single() {
    const res = await service
      .getEntity(Many2OneSingleEntity)({})
      .pipe(take(1))
      .toPromise();
    expect(res).not.toBe(null);
    expect(res.p2.city).not.toBe(null);
  }
  /**多对一,数组 */
  async function many21Multi() {
    const res = await service
      .getEntityList(Many2OneMultiEntity)({})
      .pipe(take(1))
      .toPromise();
    expect(res).not.toBe(null);
    expect(res instanceof Array).toBe(true);
    res.forEach((item) => {
      expect(item.p2 instanceof Many2OneP2Entity).toBe(true);
      expect(item.p2.city).not.toBe(null);
    });
  }
  async function one2ManySingle() {
    const res = await service
      .getEntity(OneToManySingleEntity)({})
      .pipe(take(1))
      .toPromise();
    expect(res).not.toBe(null);
    expect(res.p2).not.toBe(null);
    expect(res.p2 instanceof Array).toBe(true);
  }
  async function one2ManyMulti() {
    const res = await service
      .getEntityList(OneToManyMultiEntity)({})
      .pipe(take(1))
      .toPromise();
    expect(res).not.toBe(null);
    expect(res instanceof Array).toBe(true);
    res.forEach((item) => {
      expect(item.p2).not.toBe(null);
      expect(item.p2 instanceof Array).toBe(true);
    });
  }
  it('一对一关系', async (done) => {
    await one21Single();
    return done();
  });
  it('一对一关系(数组)', async (done) => {
    await one21Multi();
    return done();
  });
  it('一对一关系二次(数组)', async (done) => {
    await one21Multi();
    await one21Multi();
    return done();
  });
  it('一对一关系二次调用(测试仓库)', async (done) => {
    await one21Single();
    await one21Single();
    return done();
  });
  it('多对一关系', async (done) => {
    await many21Single();
    done();
    return true;
  });
  it('多对一关系,数组', async (done) => {
    await many21Multi();
    done();
    return true;
  });
  it('一对多关系', async (done) => {
    await one2ManySingle();
    done();
    return true;
  });
  it('一对多关系(数组)', async (done) => {
    await one2ManyMulti();
    done();
    return true;
  });
  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});
