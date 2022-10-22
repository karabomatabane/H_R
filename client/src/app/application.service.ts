import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationModule, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from './_models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  baseUrl = environment.apiUrl;
  public application: Application;

  constructor(private http: HttpClient) { }

  getApplications(filter: boolean) {
    let order = filter ? 'desc' : 'asce';
    let params = new HttpParams().set('order', order);

    return this.http.get<Application[]>(this.baseUrl + 'application', {params: params});
  }

  getActiveApps(filter: boolean) {
    let order = filter ? 'desc' : 'asce';
    let params = new HttpParams().set('order', order);

    return this.http.get<Application[]>(this.baseUrl + 'application/app/active', {params: params});
  }

  getApplication(id: number) {
    return this.http.get<Application>(this.baseUrl + 'application/' + id)
  }

  updateExpense(id, application: Application) {
    return this.http.put(this.baseUrl + 'application/' + id, application);
  }

  deleteExpense(id: number) {
    return this.http.delete<Application>(this.baseUrl + 'application/' + id);
  }

  public saveApp(model: any): Observable<any> {
    const url = `${this.baseUrl}application`;
    return this.http.post<any>(url, model).pipe(
      map((app: Application) => {
        return app;
      }));
  }
}