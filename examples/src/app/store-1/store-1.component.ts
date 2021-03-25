import { Component, OnInit } from '@angular/core';
import { CyiaStoreService } from 'cyia-ngx-common/store';
import { Store1Store } from './store-1.store';

@Component({
  selector: 'app-store-1',
  templateUrl: './store-1.component.html',
  styleUrls: ['./store-1.component.css'],
})
export class Store1Component implements OnInit {
  index$ = this.store.select(Store1Store);
  constructor(private store: CyiaStoreService) {}

  ngOnInit() {}
  add() {
    this.store.getStore(Store1Store).ADD();
  }
  reset() {
    this.store.getStore(Store1Store).RESET();
  }
}
