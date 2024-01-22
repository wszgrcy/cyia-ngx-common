import { Component, OnInit } from '@angular/core';
import { AComponent } from './a.component';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  standalone: true,
  imports: [AComponent],
})
export class EventComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  clicked(str: string) {
    console.log(str);
  }
  output(data: any) {
    console.log(data);
  }
}
