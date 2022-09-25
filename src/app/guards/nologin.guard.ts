import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    public alertCtrl: AlertController,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getToken().then(data => {
        let idUser = data;
        //console.log(idUser);
        if (idUser== null || idUser == undefined || idUser == 'null' || idUser == 'undefined' ) {
          console.log('autorizadar...');
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
    });

  }
  
}
