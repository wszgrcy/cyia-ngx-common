import { CyiaHttpService, CallControl } from 'cyia-ngx-common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TestItem, MainEntity, NormalEntity } from './requestlist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: CyiaHttpService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    // this.http.request({ token: 'test', method: 'delete', suffix: '/t123' }).subscribe({
    //   next: (res) => {
    //     console.log(res)
    //   }
    // })
    // let a = this.http.injectUse(TestItem)

    // a.default().subscribe((val) => {
    //   console.log('测试', val)
    // })
    // a.post().subscribe((val) => {
    //   // val.
    //   console.log('post返回');
    // }, (err) => {
    //   console.log('报错', err);
    // })
    /**
     * doc 请求new 返回之后,因为一对一的关系还会请求ext
     */
    let b = this.http.getEntity2(MainEntity)
    b({ options: { params: { dynamic2: '动态',default1:'覆盖' } } }).subscribe((val) => {
      console.log(val);
      val.ret1
    })
    this.click()
    this.click()
    CyiaHttpService.addToRepository([new NormalEntity(1, 5555)])
  }
  @CallControl({ method: 'sync', referenceResult: true })
  click() {
    console.log('点击')
    return false
  }

}
