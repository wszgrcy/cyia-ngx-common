import { TestBed } from '@angular/core/testing';

import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CyiaHttpService } from '../../../http/http.service';
import { requestFactory } from '../../util/test-request';
import './many-to-one.mock';
import { ItemHasMTOItemEntity, MTORelation, ListHasMTOItemEntity, MTOListRelation } from './many-to-one.entity';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [CyiaHttpService]
})
class TestHttpModule {}
describe('多对一标准测试', () => {
  let service: CyiaHttpService;
  let request: <T>(type: Type<T>) => Promise<T>;
  let requestList: <T>(type: Type<T>) => Promise<T[]>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.inject(CyiaHttpService);
    request = requestFactory(service);
    requestList = requestFactory(service, true);
  });
  /**一对一,返回的为单对象 */
  // doc 应该描述为请求一项,返回带有一对一关系的实体
  it('请求单项,返回带有多对一单项', async (done) => {
    const result = await request(ItemHasMTOItemEntity);
    console.log(result);
    expect(result instanceof ItemHasMTOItemEntity).toBeTruthy();
    expect(result.manytoone instanceof MTORelation).toBeTruthy();
    return done();
  });
  it('请求列表,返回带有多对一单项', async (done) => {
    const result = await requestList(ListHasMTOItemEntity);
    expect(result instanceof Array).toBe(true, '返回列表');
    result.forEach((item) => {
      expect(item instanceof ListHasMTOItemEntity).toBe(true, '实体化');
      expect(item.manytoone instanceof MTOListRelation).toBe(true, '关系实体化');
    });

    return done();
  });
});
