import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import {
  DoubleLevelStructEntity,
  RelationStructEntity,
  OntoOne1Entity,
  DoubleLevelStruct1Entity,
  Relate121WithStructureEntity,
  Struct2Entity,
  Struct2DataEntity,
  StructListEntity,
  StructItemEntity,
  StructList1Entity,
  DoubleLevelStruct2Entity,
  RColumnP2Entity
} from '../test/testclass/struct.class';
import '../test/mock-struct';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService]
})
class TestHttpModule {}
describe('[实体请求]结构测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.inject(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function request<T>(entity: Type<T>) {
    return await service
      .getEntity(entity)({})
      .pipe(take(1))
      .toPromise();
  }

  it('2层结构化(单项)', async (done) => {
    const res = await request(DoubleLevelStructEntity);
    expect(res.data instanceof DoubleLevelStruct1Entity).toBe(true);
    expect(res.data.data instanceof DoubleLevelStruct2Entity).toBe(true);
    return done();
  });
  it('1层结构化数组', async (done) => {
    const res = await request(StructListEntity);
    expect(res.data instanceof Array).toBe(true);
    expect(res.data[0] instanceof StructItemEntity).toBe(true);
    return done();
  });

  it('2x(结构化单项+一对一)', async (done) => {
    const res = await request(RelationStructEntity);
    expect(res.data instanceof RColumnP2Entity);
    expect(res.onetoone instanceof OntoOne1Entity).toBe(true);
    return done();
  });
  // todo 多层次下关联多层次
  it('一对一关系内包含结构化单项', async (done) => {
    const res = await request(Relate121WithStructureEntity);
    expect(res.struct2 instanceof Struct2Entity).toBe(true);
    expect(res.struct2.data instanceof Struct2DataEntity).toBe(true);

    // expect(res.onetoone instanceof OntoOne1Entity).toBe(true)
    return done();
  });

  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});
