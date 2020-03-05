import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RepositoryService {
  constructor(private http: HttpClient) {}
  find(entity: Type<any>) {

  }
}
