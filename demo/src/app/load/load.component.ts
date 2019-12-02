import { Component, OnInit } from '@angular/core';
import { CYIA_LOADING_HINT_COMPLETE$, CYIA_LOADING_HINT_CLOSE_FN } from 'lib/src/loading-hint/const';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit {
  complete = '未完成'
  constructor() { }

  ngOnInit() {
    (this[CYIA_LOADING_HINT_COMPLETE$] as Subject<any>).subscribe(() => {
      console.log('完成');
      this.complete = '已完成'
      setTimeout(() => {
        this[CYIA_LOADING_HINT_CLOSE_FN]()
      }, 1000);
    })
  }

}
