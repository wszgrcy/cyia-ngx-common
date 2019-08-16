import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { OneToManyOnly as OneToManySingleEntity, OneToManyMultiEntity } from '../test/testclass/one-to-many.class';
import { Many2OneOnlyEntity as Many2OneSingleEntity, Many2OneMultiEntity } from '../test/testclass/many-to-one.class';
import { One2OneOnlyEntity, One2OneMultiEntity } from '../test/testclass/one-to-one.class';
import { One21P2Entity, One21P3Entity, Many2OneP2Entity } from '../test/testclass/base.class';
import { OneTOneChainEntity, OneTOneChainP2Entity, OneTOneChainP3Entity } from '../test/testclass/chain.class';
import { NoRelationStructEntity, RelationStructEntity, RColumnP2Entity, OntoOne1Entity, ColumnP2Entity, SWithSEntity, Struct2Entity, Struct2DataEntity } from '../test/testclass/struct.class';
import '../test/mock-struct'
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
describe('结构测试', () => {
  let service: CyiaHttpService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    })
    service = TestBed.get(CyiaHttpService);
  });
  /**一对一,返回的为单对象 */
  async function struct<T>(entity: Type<T>) {
    return await service.getEntity(entity)({}).pipe(take(1)).toPromise()
  }


  it('非关系多层次', async (done) => {
    let res = await struct(NoRelationStructEntity)
    console.log(res);
    expect(res.data instanceof ColumnP2Entity).toBe(true)
    return done()
  })
  it('有关系多层次', async (done) => {
    let res = await struct(RelationStructEntity)
    // console.log('有关系', res);
    expect(res.onetoone instanceof OntoOne1Entity).toBe(true)
    return done()
  })
  //todo 多层次下关联多层次
  it('关联多层次的多层次结构', async (done) => {
    let res = await struct(SWithSEntity)
    console.log('有关系(多层次)', res);
    expect(res.struct2 instanceof Struct2Entity).toBe(true)
    expect(res.struct2.data instanceof Struct2DataEntity).toBe(true)

    // expect(res.onetoone instanceof OntoOne1Entity).toBe(true)
    return done()
  })

  // afterAll((action) => {
  //   // console.log('用来接屎', action);
  // })
});

