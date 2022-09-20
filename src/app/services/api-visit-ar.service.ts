import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiVisitArService {

  constructor(private http: HttpClient) { }

  public getEncuestaRonda(){
    const tokenp =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjYzNjE4MzE0NjMwfQ.-yP5-Wes0rRCYhtYaR_ra3S6W_6jg59yTYMx-LEYKTI';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token':  tokenp,
      })
    };
    //console.log(tokenp);
    return this.http.get( `${environment.apiVisitar}JSON/1`, httpOptions);
  }

}
