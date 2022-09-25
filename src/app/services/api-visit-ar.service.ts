import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiVisitArService {

  constructor(private http: HttpClient,  private authService: AuthService,) { }

  public getEncuestaRonda(){
    const tokenp =  this.authService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token':  tokenp,
      })
    };
    //console.log(tokenp);
    return this.http.get( `${environment.apiVisitar}JSON/1`, httpOptions);
  }

  public postLogin(post){
    return this.http.post( `${environment.apiVisitar}login`, post);
  } 



}
