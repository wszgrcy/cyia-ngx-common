import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value = '';
  constructor() {}
  ngOnInit(): void {}
  ngModelChange(e) {
    console.log('双向绑定', e);
  }
}
