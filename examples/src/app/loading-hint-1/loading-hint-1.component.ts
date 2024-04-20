import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { LoadingHint } from '@cyia/ngx-common/loading-hint';
import { LoadingComponent } from './loading/loading.component';

@Component({
  selector: 'app-loading-hint-1',
  templateUrl: './loading-hint-1.component.html',
  styleUrls: ['./loading-hint-1.component.css'],
})
export class LoadingHint1Component implements OnInit {
  @ViewChild('blockElement', { read: ViewContainerRef, static: true }) blockElement: ViewContainerRef;
  constructor() {}

  ngOnInit() {}

  @LoadingHint({ component: LoadingComponent, container: (type: LoadingHint1Component) => type.blockElement })
  clickThis() {
    return new Promise((res) => {
      setTimeout(() => {
        res(undefined);
      }, 3000);
    });
  }
}
