import { CyiaHttpService, CallControl } from 'cyia-ngx-common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TestItem } from './requestlist';

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
    this.http.request({ token: 'test', method: 'delete', suffix: '/t123' }).subscribe({
      next: (res) => {
        console.log(res)
      }
    })
    let a = this.http.injectUse(TestItem)
    a.default().subscribe((val) => {
      console.log('测试',val)
    })
    a.post()
    this.click()
    this.click()
  }
  @CallControl({ method: 'sync', referenceResult: true })
  click() {
    console.log('点击')
    return false
  }

}
