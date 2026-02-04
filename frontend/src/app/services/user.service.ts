import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.API_URL);
  }

  create(user: any) {
    return this.http.post(this.API_URL, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
