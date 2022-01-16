import { Component, OnInit } from '@angular/core';
import { CyiaStoreService } from 'cyia-ngx-common/store';
import { Store1Store } from './store-1.store';

@Component({
  selector: 'app-store-1',
  templateUrl: './store-1.component.html',
  styleUrls: ['./store-1.component.css'],
})
export class Store1Component implements OnInit {
  index$ = this.store.state$;
  constructor(private store: Store1Store) {}

  ngOnInit() {}
  add() {
    this.store.ADD();
  }
  reset() {
    this.store.RESET();
  }
}
