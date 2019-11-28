import { Component, OnInit, Injectable, ViewChild, ViewContainerRef } from '@angular/core';
import { LoadingHint } from 'cyia-ngx-common/loading-hint';
import { LoadComponent } from '../load/load.component';
import { LOAD_HINT_TOKEN } from '../token';
import { timer } from 'rxjs';

@Component({
  selector: 'app-loading-test',
  templateUrl: './loading-test.component.html',
  styleUrls: ['./loading-test.component.css']
})
export class LoadingTestComponent implements OnInit {
  @ViewChild('loadp', { read: ViewContainerRef, static: true }) loadPromiseRef: ViewContainerRef
  @ViewChild('loado', { read: ViewContainerRef, static: true }) loadObservableRef: ViewContainerRef

  constructor() {

  }


  ngOnInit() {
  }
  @LoadingHint('root', LOAD_HINT_TOKEN)
  loadPromise() {
    console.log('点击');
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, 300000);
    })
  }

  @LoadingHint('root', LOAD_HINT_TOKEN)
  loadObservable() {
    console.log('准备调用');
    return timer(3000)
  }
  loadObservableE() {
    return this.loadObservable().subscribe((val) => {
      console.log('执行完成');
    })
  }
}
