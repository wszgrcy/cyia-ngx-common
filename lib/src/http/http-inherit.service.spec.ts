import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OriginEntity, InheritEntity } from '../test/testclass/inherit.class';
import '../test/mock-one-to-one';
import { One21P2Entity } from '../test/testclass/base.class';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService],
})
class TestHttpModule {

}
describe('类继承属性测试', () => {
  let service: CyiaHttpService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    })
    service = TestBed.get(CyiaHttpService);
  });

  it('继承', (done) => {
    service.getEntity(InheritEntity)().subscribe((val) => {
      console.log('返回', val);
      expect(!!val).toBe(true)
      expect(val.p2 instanceof One21P2Entity).toEqual(true)
      done();
    })
  }, 1000)

});

