import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from './_models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public saveApp(model: any): Observable<any> {
    const url = `${this.baseUrl}application`;
    return this.http.post<any>(url, model).pipe(
      map((app: Application) => {
        return app;
      }));
  }
}