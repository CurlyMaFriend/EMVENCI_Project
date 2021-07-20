import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Family } from 'src/classTemplates/family';
import { Person } from 'src/classTemplates/person';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  public login(data: any): Observable<any> {
    return this.http.post(`/api/login`, data)
  }

  public persons(token: any) {
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.get<Person[]>(`/api/persons`, { headers: headers })
  }

  public families(token: any) {
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.get<Family[]>(`/api/families`, { headers: headers })
  }

  public family(id: number, token: any) {
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.get<Family>(`/api/families/${id}`, { headers: headers })
  }

  public addFamily(data: any, token: any) {
    console.log(data);
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.post(`/api/families`, data, { headers: headers })
  }

  public addPerson(data: any, token: any) {
    console.log(data);
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.post(`/api/persons`, data, { headers: headers })
  }

  public editPerson(data: any, token: any, id: number) {
    console.log(data);
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.put(`/api/persons/${id}`, data, { headers: headers })
  }

  public deletePerson(id: any, token: any) {
    console.log(id);
    let headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.delete(`/api/persons/${id}`, { headers: headers })
  }
}
