import { NgTemplateOutlet } from '@angular/common';
import { Component, input, OnInit, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'insertComp',
  templateUrl: './component.html',
  imports: [NgTemplateOutlet],
})
export class InsertComponent implements OnInit {
  public templateRef = viewChild.required('templateRef');
  index = input();
  input = input<TemplateRef<any>>();
  constructor() {}

  ngOnInit(): void {}
}
