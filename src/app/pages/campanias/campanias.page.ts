import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiVisitArService } from 'src/app/services/api-visit-ar.service';
import { AuthService } from 'src/app/services/auth.service';
import { Network } from '@capacitor/network';
import { BaselocalService } from 'src/app/services/baselocal.service';
@Component({
  selector: 'app-campanias',
  templateUrl: './campanias.page.html',
  styleUrls: ['./campanias.page.scss'],
})
export class CampaniasPage implements OnInit {
  campaniasJson: any;
  deferredPrompt;
  constructor( private baselocalService:BaselocalService,public toastController: ToastController,
    public router:Router,private authService: AuthService,public alertController: AlertController,
    public apiVisitArService:ApiVisitArService ,public loadingController: LoadingController) 
  {
    this.campaniasJson= {
      campanias: ''
    }
    Network.addListener('networkStatusChange', async status => {
      //console.log('Network status changed', status);
      this.verificoConectividad(status.connected);
    });
  }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt Event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
    });
  }
  async ionViewDidEnter(){
    this.baselocalService.getArrayCampanias().then(
      data => {
        this.campaniasJson['campanias'] = data;
        this.campaniasJson['campanias']  = this.campaniasJson['campanias'].sort((a, b) => b.Id - a.Id );
      }, error => {
        console.log(error);
      }
    );
    Network.getStatus().then (async status => {
      this.verificoConectividad(status.connected);
    });
    
  }
  showInstallBanner() {
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      // Show the prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          // We no longer need the prompt.  Clear it up.
          this.deferredPrompt = null
        })
    }
  }
  async verificoConectividad(estado){
        //console.log('Network status changed', status);
        if(estado){
            console.log("Conectado Internet Get");
            setTimeout(() => {
              this.getCampanias();
            }, 1500);
        }else{
          console.log("Sin Internet Get");
          
          const toast = await this.toastController.create({
            message: 'Sin conectividad',
            duration: 4000,
            cssClass: 'custom-toast',
            buttons: [
              {
                text: 'cerrar',
                role: 'cancel'
              }
            ],
          });
      
          await toast.present();
          
        }

  }

  async getCampanias(){
    console.log("Obtengo Rondas");
    const loading = await this.loadingController.create({
      message: 'Aguarde pidiendo campañas...',
    });
   
    loading.present();
    this.apiVisitArService.getCampanias().subscribe(
      data => {
        loading.dismiss();
        this.campaniasJson = data;
        console.log(this.campaniasJson);
        this.campaniasJson['campanias']  = this.campaniasJson['campanias'].sort((a, b) => b.Id - a.Id );
        setTimeout(() => {
          this.getModelosEncuentas();
        }, 500);
        this.baselocalService.setArrayCampanias(this.campaniasJson['campanias']);
      },error => {  
        loading.dismiss();
        this.presentAlert('Info', 'Problema', error.message + ' ' +JSON.stringify(error.error));  
        console.log(error);
    });
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
  cerrar(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  enviarCampanias(indCampanias: number){
    this.router.navigate(['misencuestas', {
      idCampania: indCampanias
    }]);
  }
  async getModelosEncuentas(){
    console.log("Obtengo Modelos");
    const loading = await this.loadingController.create({
      message: 'Aguarde pidiendo modelos...',
    });
    loading.present();
    var limit = this.campaniasJson['campanias'].length;
    var cont = 0;
    await this.campaniasJson['campanias'].forEach(async (element, indice) => {
            // await loading.present();
          this.apiVisitArService.getEncuestaModelo(element.Id).subscribe(
            async data => {
              cont++;
              this.baselocalService.setArrayModelo(data);
              console.log("Modelo ", cont);
              if(cont==limit){
                  console.log('Finaliza bajada de modelos');
                  loading.dismiss();

                  const toast = await this.toastController.create({
                    message: 'Descarga Completo',
                    duration: 3000,
                    cssClass: 'custom-toast',
                    buttons: [
                      {
                        text: 'cerrar',
                        role: 'cancel'
                      }
                    ],
                  });
                  await toast.present();
              }
            },async error => {  
              cont++;
              if(cont==limit){
                  console.log('Finaliza bajada de modelos');
                  loading.dismiss();

                  const toast = await this.toastController.create({
                    message: 'Descarga Completo',
                    duration: 3000,
                    cssClass: 'custom-toast',
                    buttons: [
                      {
                        text: 'cerrar',
                        role: 'cancel'
                      }
                    ],
                  });
                  await toast.present();
                 
              }
              //this.presentAlert('Info', 'Problema', error.message + ' ' +JSON.stringify(error.error));  
              console.log(error);
          });

    }); 
    
  }

}
