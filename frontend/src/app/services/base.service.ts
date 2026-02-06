// services/base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BaseService<T> {
  constructor(private http: HttpClient) {}

  getAll(url: string) {
    return this.http.get<T[]>(url);
  }

  create(url: string, data: T) {
    return this.http.post(url, data);
  }

  update(url: string, id: string, data: T) {   // ✅
    return this.http.put(`${url}/${id}`, data);
  }

  delete(url: string, id: string) {
    return this.http.delete(`${url}/${id}`);
  }
}
