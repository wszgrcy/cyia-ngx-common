import { Component, OnInit, Injectable, ViewChild, ViewContainerRef } from '@angular/core';
import { LoadingHint } from 'cyia-ngx-common/loading-hint';
import { LoadComponent } from '../load/load.component';
import { LOAD_HINT_TOKEN } from '../token';

@Component({
  selector: 'app-loading-test',
  templateUrl: './loading-test.component.html',
  styleUrls: ['./loading-test.component.css']
})
export class LoadingTestComponent implements OnInit {
  @ViewChild('loadp', { read: ViewContainerRef, static: true }) loadPromiseRef: ViewContainerRef
  @ViewChild('loado', { read: ViewContainerRef, static: true }) loadObservableRef: ViewContainerRef

  constructor() { }

  ngOnInit() {
  }
  @LoadingHint((type: LoadingTestComponent) => type.loadPromiseRef, LOAD_HINT_TOKEN)
  loadPromise() {
    console.log('点击');
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, 3000);
    })
  }

  @LoadingHint((type: LoadingTestComponent) => type.loadPromiseRef)
  loadObservable() {

  }
}
