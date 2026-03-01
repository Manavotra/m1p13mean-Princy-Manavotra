// services/base.service.ts
import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class BaseService<T> {

  private api = environment.apiUrl;

  private buildFormDataIfNeeded(data: any): any {

    const formData = new FormData();
    let hasFile = false;

    const appendRecursive = (obj: any, parentKey = '') => {

      Object.keys(obj).forEach(key => {

        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value instanceof File) {
          formData.append(fullKey, value);
          hasFile = true;
        }

        else if (Array.isArray(value)) {
          value.forEach((v, index) => {
            appendRecursive(v, `${fullKey}[${index}]`);
          });
        }

        else if (typeof value === 'object' && value !== null) {
          appendRecursive(value, fullKey);
        }

        else {
          formData.append(fullKey, value);
        }

      });
    };

    appendRecursive(data);

    return hasFile ? formData : data;
  }

  constructor(private http: HttpClient) {}


  getAll(endpoint: string) {
    return this.http.get<T[]>(this.api + endpoint);
  }

  getById(endpoint: string, id: string) {
    return this.http.get<T>(this.api + endpoint + '/' + id);
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

create(endpoint: string, data: any) {
  const payload = this.buildFormDataIfNeeded(data);
  return this.http.post(this.api + endpoint, payload);
}

update(endpoint: string, id: string, data: any) {
  const payload = this.buildFormDataIfNeeded(data);
  return this.http.put(this.api + endpoint + '/' + id, payload);
}

  delete(endpoint: string, id: string) {
    return this.http.delete(this.api + endpoint + '/' + id);
  }
}

