import { CyiaHttpService, CallControl } from 'cyia-ngx-common';
import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { RepositoryService } from 'cyia-ngx-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: CyiaHttpService, private reposity: RepositoryService) {}
  ngOnInit(): void {}
}
