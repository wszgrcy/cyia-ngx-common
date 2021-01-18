import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  constructor(private service: CyiaMonacoTextmateService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.service.setMonaco(monaco);
    this.service.init().then(async () => {
      const themeList = await this.service.getThemeList();
      this.themeList = themeList;
      this.selectedTheme = themeList[1];
      const name = await this.service.defineTheme(this.selectedTheme);
      monaco.editor.setTheme(name);
      this.cd.detectChanges();
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
