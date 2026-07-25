import { Component, effect, OnInit, signal } from '@angular/core';

@Component({
  selector: 'selectorless-renderer',
  templateUrl: './component.html',
  imports: [],
})
export class SelectorlessExampleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
