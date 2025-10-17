import { Component, input, OnInit, viewChild } from '@angular/core';

@Component({
  selector: 'insertComp',
  templateUrl: './component.html',
})
export class InsertComponent implements OnInit {
  public templateRef = viewChild.required('templateRef');
  index = input();
  constructor() {}

  ngOnInit(): void {}
}
