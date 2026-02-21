// services/base.service.ts
import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BaseService<T> {

  // private api = 'http://localhost:3000/api/';

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getAll(endpoint: string) {
    return this.http.get<T[]>(this.api + endpoint);
  }

  getAllWithParams(endpoint: string, searchObject: any) {

    console.log('==============================');
    console.log('🌍 FRONTEND getAllWithParams');
    console.log('Endpoint:', endpoint);
    console.log('Search Object:', searchObject);

    let params = new HttpParams();

    const flatten = (obj: any, prefix = '') => {

      Object.keys(obj).forEach(key => {

        const value = obj[key];

        if (value === null || value === '' || value === undefined) {
          return;
        }

        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          flatten(value, fullPath);
        } else {

          console.log('➡ Adding param:', `search[${fullPath}]`, value);

          params = params.append(
            `search[${fullPath}]`,
            value
          );
        }

      });
    };

    flatten(searchObject);

    console.log('🧩 Final Params:', params.toString());
    console.log('🌍 Final URL:', this.api + endpoint + '?' + params.toString());
    console.log('==============================');

    return this.http.get<T[]>(
      this.api + endpoint,
      { params }
    );
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

