import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    token: any;

    constructor(private http: HttpClient) { }
  
    async setToken(token: string) {
      this.token = String(token);
      await Preferences.set({
        key: 'TOKENW',
        value: String(token),
      });
    }

    async getToken() {
      const ret = await Preferences.get({ key: 'TOKENW' });
      this.token = String(ret.value);
      return  this.token;
    }

    async removeToken() {
      const promises = await Promise.all([
        Preferences.remove({ key: 'TOKENW' }),
      ]);
    }

    
}
