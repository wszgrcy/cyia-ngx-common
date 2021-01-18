import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as monaco from 'monaco-editor';
import { Monaco, CyiaMonacoTextmateService } from 'cyia-ngx-common/monaco-textmate';

@Component({
  selector: 'app-monaco-textmate-1',
  templateUrl: './monaco-textmate-1.component.html',
  styleUrls: ['./monaco-textmate-1.component.css'],
})
export class MonacoTextmate1Component {
  @ViewChild('container', { static: true })
  containerElement?: ElementRef<HTMLElement>;
  instance: Monaco;
  themeList = [];
  selectedTheme: string;
  constructor(private service: CyiaMonacoTextmateService) {}

  ngOnInit() {
    this.service.setMonaco(monaco);
    this.service.init(false).then(async () => {
      const themeList = await this.service.getThemeList();
      this.themeList = themeList;
      this.selectedTheme = themeList[1];
      const name = await this.service.defineTheme(this.selectedTheme);
      monaco.editor.setTheme(name);
      await this.service.manualRegisterLanguage('ts');
      this.containerElement?.nativeElement.classList.add('monaco-editor');
      this.containerElement.nativeElement.innerHTML = 'let a=6;';
      this.containerElement?.nativeElement.setAttribute('data-lang', 'typescript');
      monaco.editor.colorizeElement(this.containerElement.nativeElement, { tabSize: 4, theme: name });
    });
  }

  async change(e) {
    const name = await this.service.defineTheme(e);
    monaco.editor.setTheme(name);
  }
}
