import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-lazy-load-base',
  templateUrl: './lazy-load-base.component.html',
  styleUrls: ['./lazy-load-base.component.scss'],
})
export class LazyLoadBaseComponent implements OnInit {
  load = false;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}
  clickToLoad() {
    console.log('加载组件');
    this.load = true;
    this.cd.detectChanges();
  }
}
