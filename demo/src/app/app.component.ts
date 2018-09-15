import { CyiaHttpService } from 'cyia-common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: CyiaHttpService) { }
  ngOnInit(): void {
    this.http.request({ token: 'test', method: 'delete', suffix: '/t123' }).subscribe({
      next: (res) => {
        console.log(res)
      }
    })
  }
}
