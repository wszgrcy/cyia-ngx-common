import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import {
  NoRelationStructEntity,
  RelationStructEntity,
  OntoOne1Entity,
  ColumnP2Entity,
  Relate121WithStructureEntity,
  Struct2Entity,
  Struct2DataEntity,
  StructListEntity,
  ColumnItemEntity,
  StructList1Entity
} from '../test/testclass/struct.class';
import '../test/mock-struct';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
describe('结构测试', () => {
  let service: CyiaHttpService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function struct<T>(entity: Type<T>) {
    return await service.getEntity(entity)({}).pipe(take(1)).toPromise();
  }


  it('非关系多层次', async (done) => {
    const res = await struct(NoRelationStructEntity);
    console.log(res);
    expect(res.data instanceof ColumnP2Entity).toBe(true);
    return done();
  });
  it('结构化数组2', async (done) => {
    const res = await struct(StructListEntity);
    expect(res.data instanceof Array).toBe(true);
    expect(res.data[0] instanceof ColumnItemEntity).toBe(true);
    return done();
  });
  it('结构化数组1', async (done) => {
    const res = await struct(StructList1Entity);
    expect(res.data instanceof Array).toBe(true);
    expect(res.data[0] instanceof ColumnItemEntity).toBe(true);
    return done();
  });
  it('有关系多层次', async (done) => {
    const res = await struct(RelationStructEntity);
    console.log('有关系一对一', res);
    expect(res.onetoone instanceof OntoOne1Entity).toBe(true);
    return done();
  });
  // todo 多层次下关联多层次
  it('关联多层次的多层次结构', async (done) => {
    const res = await struct(Relate121WithStructureEntity);
    console.log('有关系(多层次)', res);
    expect(res.struct2 instanceof Struct2Entity).toBe(true);
    expect(res.struct2.data instanceof Struct2DataEntity).toBe(true);

    // expect(res.onetoone instanceof OntoOne1Entity).toBe(true)
    return done();
  });

  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});

