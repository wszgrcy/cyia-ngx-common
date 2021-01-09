import { Component, OnInit } from '@angular/core';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { PackageEntity } from './data.entity';

@Component({
  selector: 'app-example',
  templateUrl: './repository-1.component.html',
  styleUrls: ['./repository-1.component.scss'],
})
export class Repository1Component implements OnInit {
  constructor(private repository: CyiaRepositoryService) {}

  ngOnInit() {
    this.repository.findMany(PackageEntity).subscribe((list) => {
      console.log(list);
    });
  }
}
