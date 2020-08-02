import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lazy-load',
  templateUrl: './lazy-load.component.html',
  styleUrls: ['./lazy-load.component.css'],
})
export class LazyLoadComponent implements ControlValueAccessor {
  @Input() title = 'label';
  @Output() componentIsLoaded = new BehaviorSubject(this);
  value;
  fn;
  constructor() {
    console.log('初始化')
  }

  ngOnInit() {}
  writeValue(value) {
    this.value = value;
  }
  registerOnChange(fn) {
    this.fn = fn;
  }
  registerOnTouched(fn) {}
  change(e) {
    this.fn(e);
  }
}
