import { TestBed } from '@angular/core/testing';

import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CyiaHttpService } from '../../../http/http.service';
import { requestFactory } from '../../util/test-request';
import './one-to-many.mock';
// @NgModule({
//   declarations: [],
//   imports: [HttpClientModule],
//   providers: [CyiaHttpService]
// })
// class TestHttpModule {}
// describe('一对多标准测试', () => {
//   let service: CyiaHttpService;
//   let request: <T>(type: Type<T>) => Promise<T>;
//   let requestList: <T>(type: Type<T>) => Promise<T[]>;
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [TestHttpModule]
//     });
//     service = TestBed.get(CyiaHttpService);
//     request = requestFactory(service);
//     requestList = requestFactory(service, true);
//   });
//   /**一对一,返回的为单对象 */

//   // doc 应该描述为请求一项,返回带有一对一关系的实体
//   it('请求单项,返回带有一对一单项', async (done) => {
//     const result = await request(ItemHasOTOItemEntity);
//     console.log(result);
//     expect(result instanceof ItemHasOTOItemEntity).toBe(true);
//     expect(result.onetoone instanceof OTORelation).toBe(true);

//     return done();
//   });
//   it('请求列表,返回带有一对一单项', async (done) => {
//     const result = await requestList(ListHasOTOItemEntity);
//     console.log(result);
//     expect(result instanceof Array).toBe(true);
//     result.forEach((item) => {
//       expect(item instanceof ListHasOTOItemEntity).toBe(true);
//       expect(item.onetoone instanceof OTOListRelation).toBe(true);
//     });

//     return done();
//   });
// });
