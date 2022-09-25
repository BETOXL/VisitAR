import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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
        if (idUser==null || idUser ==undefined || idUser =='null' || idUser == 'undefined' ) {
          this.presentAlertPar(
            'Atención!',
            'Esta App esta disponible solo para usuarios registrados.',
            'Registrese o Inicio Sección',
            'No',
            'Ingresar')
          this.router.navigate(['/login'])
          return false;
        } else {
          // console.log('autorizado...');
          return true;
        }
      });

  }
  async presentAlertPar( header: string, subHeader: string, messgage: string, 
    btnNoTxt: string, btnYesTxt: string,) {
        this.alertCtrl.create({
          header: header,
          message: messgage,
          subHeader: subHeader,
          buttons: [{
          text: btnNoTxt,
          role: 'cancel'
          }, {
          text: btnYesTxt,
          handler: () => {
            this.router.navigate(['/login']);
            }
          }
          ]
          }).then(alertEl => {
            alertEl.present();
          });
  }

  
}
