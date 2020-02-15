import { Component, OnInit } from '@angular/core';
import { CYIA_LOADING_HINT_RESULT$, CYIA_LOADING_HINT_CLOSE_FN } from 'lib/src/loading-hint/const';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit {
  complete = '未完成';
  constructor() {}

  ngOnInit() {
    (this[CYIA_LOADING_HINT_RESULT$] as Subject<any>).subscribe(val => {
      console.log('完成', val);
      this.complete = '已完成';
      // setTimeout(() => {
      //   this[CYIA_LOADING_HINT_CLOSE_FN]()
      // }, 1000);
    });
  }
  close() {
    console.log('关闭')
    this[CYIA_LOADING_HINT_CLOSE_FN]();
  }
}
