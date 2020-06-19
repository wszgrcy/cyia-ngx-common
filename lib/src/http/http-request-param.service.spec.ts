import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { take, timeout } from 'rxjs/operators';
import { NgModule, Type } from '@angular/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpResponse, HttpClient } from '@angular/common/http';
import { OneToManyOnly as OneToManySingleEntity, OneToManyMultiEntity } from '../test/testclass/one-to-many.class';
import { Many2OneOnlyEntity as Many2OneSingleEntity, Many2OneMultiEntity } from '../test/testclass/many-to-one.class';
import { One2OneOnlyEntity, One2OneMultiEntity, One2OneOnlyTestReqEntity } from '../test/testclass/one-to-one.class';
import { One21P2Entity, One21P3Entity, Many2OneP2Entity, OneToManyP2 } from '../test/testclass/base.class';
import { OneTOneChainEntity, OneTOneChainP2Entity, OneTOneChainP3Entity } from '../test/testclass/chain.class';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import '../test/mock-one-to-one';
@NgModule({
  declarations: [],
  imports: [HttpClientTestingModule],
  providers: [CyiaHttpService]
})
class TestHttpModule {}
describe('请求参数测试', () => {
  let service: CyiaHttpService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHttpModule]
    });
    service = TestBed.inject(CyiaHttpService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('请求参数(单一)', async done => {
    const res = service
      .getEntity(One2OneOnlyEntity)()
      .toPromise();
    // console.log('返回', res);
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/mainwithonetoone');
    console.log('单一', req);
    expect(req.request.url).toEqual('http://127.0.0.1:3000/mainwithonetoone', `不相等${req.request.url}`);
    expect(req.request.method.toLocaleLowerCase()).toEqual('get');
    done();
  });
  it('请求参数(body)', async done => {
    const res = service
      .getEntity(One2OneOnlyTestReqEntity)()
      .toPromise();
    // console.log('返回', res);
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/mainwithonetoone');
    console.log('body', req);
    expect(req.request.url).toEqual('http://127.0.0.1:3000/mainwithonetoone', `不相等${req.request.url}`);
    expect(req.request.method.toLocaleLowerCase()).toEqual('post');
    expect(req.request.body.a).toEqual('1');
    expect(req.request.headers.get('test1')).toEqual('ceshi');
    done();
  });
  it('请求参数(合并参数)', async done => {
    console.log('合并参数');
    const res = service
      .getEntity(One2OneOnlyTestReqEntity)({
        options: {
          body: { b: 2, a: 1 },
          headers: {
            test1: 'ceshi2'
          }
        }
      })
      .toPromise();
    // console.log('返回', res);
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/mainwithonetoone');
    console.log('合并参数', req);
    expect(req.request.url).toEqual('http://127.0.0.1:3000/mainwithonetoone', `不相等${req.request.url}`);
    expect(req.request.method.toLocaleLowerCase()).toEqual('post');
    expect(req.request.body.a).toEqual(1);
    expect(req.request.body.b).toEqual(2);
    // expect(req.request.body.b).toEqual(2)
    expect(req.request.headers.get('test1')).toEqual('ceshi2');
    done();
  });
  it('请求参数(application/x-www-form-urlencoded)', async done => {
    const res = service
      .getEntity(One2OneOnlyTestReqEntity)({
        options: {
          body: { b: 2, a: 1, obj: { a: { b: 2 } } },
          headers: {
            test1: 'ceshi2',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      })
      .toPromise();
    // console.log('返回', res);
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/mainwithonetoone');
    console.log('表单www', req);
    expect(req.request.url).toEqual('http://127.0.0.1:3000/mainwithonetoone', `不相等${req.request.url}`);
    expect(req.request.method.toLocaleLowerCase()).toEqual('post');
    expect(req.request.body.a).toEqual(1);
    expect(req.request.body.b).toEqual(2);
    expect(req.request.body.b).toEqual(2);
    expect(req.request.headers.get('test1')).toEqual('ceshi2');
    expect(req.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
    done();
  });
  xit('模拟请求参数(application/x-www-form-urlencoded)', async done => {
    console.log('模拟参数');
    const res = service
      .getEntity(One2OneOnlyTestReqEntity)({
        options: {
          body: { b: 2, a: 1, obj: { a: { b: 2 } } },
          headers: {
            test1: 'ceshi2',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      })
      .pipe(take(1))
      .toPromise();
    res.then(val => {
      console.log('数据返回', val);
      done();
    });
    // console.log('返回', res);
    console.log('期待');
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/mainwithonetoone');
    console.log('查看数据');
    console.log('模拟请求', req);
    // req.flush({ a: 1, b: '更改body?', }, { status: 200 })
    req.event(new HttpResponse({ body: { c: '返回' }, status: 200 }));
    expect(req.request.url).toEqual('http://127.0.0.1:3000/mainwithonetoone', `不相等${req.request.url}`);
    expect(req.request.method.toLocaleLowerCase()).toEqual('post');
    expect(req.request.body.a).toEqual(1);
    expect(req.request.body.b).toEqual(2);
    expect(req.request.body.b).toEqual(2);
    expect(req.request.headers.get('test1')).toEqual('ceshi2');
    expect(req.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded');
  });
  it('原始数据模拟', async done => {
    http
      .post(
        'http://127.0.0.1:3000/aaa',
        { p1: 1, p2: 2 },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          observe: 'response'
        }
      )
      // .pipe(take(1))
      .subscribe(val => {
        console.log('原始返回值', val);
        expect(val).toBeTruthy();
        done();
      });
    const req = httpTestingController.expectOne('http://127.0.0.1:3000/aaa');
    console.log('查看请求参数', req);
    // req.request
    req.event(new HttpResponse({ body: { c: '返回' }, status: 404 }));
    req.flush({ flush: '用这个返回' });

    console.log('原始', req);
  });
});
