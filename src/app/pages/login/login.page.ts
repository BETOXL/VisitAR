import { Component, OnInit } from '@angular/core';
import { ApiVisitArService } from 'src/app/services/api-visit-ar.service';
import { AuthService } from 'src/app/services/auth.service';
import {FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userVa: {
    usuario: string,
    password: string
  };
  loginForm: FormGroup;
  constructor(public apiVisitArService: ApiVisitArService,public loadingController: LoadingController, 
    public router:Router,
    public alertController: AlertController,
    public authService: AuthService,
    private formBuilder: FormBuilder,) {
    this.userVa = {
      usuario: "",
      password: ""
    }; 
    this.loginForm = formBuilder.group({
      //partidos: new FormControl('',Validators.compose([Validators.minLength(1), Validators.required])), 
      usuario_f: new FormControl('',Validators.compose([Validators.minLength(4), Validators.required])),
      password_f: new FormControl('',Validators.compose([Validators.minLength(4), Validators.required])),
    });
  }

  ngOnInit() {
  }

  async login(){
  
      const loading = await this.loadingController.create({
        message: 'Aguarde un momento ingresando...',
      });

      await loading.present();
      this.apiVisitArService.postLogin(this.userVa).subscribe( 
        data => {
          loading.dismiss();
          console.log(data);
          this.authService.setToken(data['token'])
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 500);
        
        }, error => {
          console.log(error);
          loading.dismiss();          
        }

      );

  }


  async presentAlert( header:string, subHeader:string, texto:string) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      cssClass: 'alertCustomCss',
      header: header,
      subHeader: subHeader,
      message: texto,
      buttons: ['OK'],
      mode: 'ios',
    });
    await alert.present();
  }

}
