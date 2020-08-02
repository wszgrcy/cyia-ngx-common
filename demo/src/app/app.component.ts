// import { CyiaHttpService, CallControl } from 'cyia-ngx-common';
import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { RequestOne } from './request.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value = '';
  constructor(private reposity: CyiaRepositoryService) {}
  ngOnInit(): void {
    this.reposity.findOne(RequestOne).subscribe((item) => {
      console.log(item);
    });
  }
  ngModelChange(e) {
    console.log('双向绑定', e);
  }
}
