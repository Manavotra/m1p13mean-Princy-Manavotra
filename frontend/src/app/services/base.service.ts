// services/base.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseService<T> {

  private api = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  getAll(endpoint: string) {
    return this.http.get<T[]>(this.api + endpoint);
  }

  create(endpoint: string, data: T) {
    return this.http.post<T>(this.api + endpoint, data);
  }

  update(endpoint: string, id: string, data: T) {
    return this.http.put<T>(this.api + endpoint + '/' + id, data);
  }

  delete(endpoint: string, id: string) {
    return this.http.delete(this.api + endpoint + '/' + id);
  }
}

