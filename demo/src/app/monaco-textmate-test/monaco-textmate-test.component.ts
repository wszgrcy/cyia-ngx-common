import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MonacoTextmateService, Monaco } from 'cyia-ngx-common/monaco-textmate';
import * as monaco from 'monaco-editor';
@Component({
  selector: 'app-monaco-textmate-test',
  templateUrl: './monaco-textmate-test.component.html',
  styleUrls: ['./monaco-textmate-test.component.css'],
})
export class MonacoTextmateTestComponent implements OnInit {
  @ViewChild('container', { static: true })
  containerElement?: ElementRef;
  instance: Monaco;
  themeList = [];
  selectedTheme: string;
  constructor(private service: MonacoTextmateService) {}

  ngOnInit() {
    this.service.setMonaco(monaco);
    this.service.init().then(async () => {
      let themeList = await this.service.getThemeList();
      this.themeList = themeList;
      this.selectedTheme = themeList[1];
      let name = await this.service.defineTheme(this.selectedTheme);
      monaco.editor.create(this.containerElement?.nativeElement, {
        theme: name,
        value: `let a=6;`,
        language: 'typescript',
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
      });
    });
  }

  async change(e) {
    const name = await this.service.defineTheme(e);
    monaco.editor.setTheme(name);
  }
}
