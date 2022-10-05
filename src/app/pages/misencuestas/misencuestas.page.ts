import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiVisitArService } from 'src/app/services/api-visit-ar.service';
import { AuthService } from 'src/app/services/auth.service';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-misencuestas',
  templateUrl: './misencuestas.page.html',
  styleUrls: ['./misencuestas.page.scss'],
})
export class MisencuestasPage implements OnInit {
  misencuestasJson: any;
  id_Campania:number;
  btndisable: boolean = false;
  constructor( private activatedRoute: ActivatedRoute, private baselocalService:BaselocalService,public toastController: ToastController,
    public router:Router,private authService: AuthService,public alertController: AlertController,
    public apiVisitArService:ApiVisitArService ,public loadingController: LoadingController) 
  {
    Network.addListener('networkStatusChange', async status => {
      //console.log('Network status changed', status);
      this.verificoConectividad(status.connected);
    });
  }
  async ionViewDidEnter(){
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.id_Campania = Number(paramMap.get('idCampania'));
    });
    setTimeout(() => {
      console.log("arranco");
      this.getMisEncuestasLocal();
      Network.getStatus().then (async status => {
        this.verificoConectividad(status.connected);
      });
    }, 500);
  }
  ngOnInit() {
    
  }
  getMisEncuestasLocal(){
    this.baselocalService.getArrayEncuestasForIdCam(this.id_Campania ).then(
      data => {
        this.misencuestasJson = data;
      }, error => {
        console.log(error);
      }
    );
  }
  async verificoConectividad(estado){
    //console.log('Network status changed', status);
    if(estado){
      console.log("Conectado Internet Get");
      setTimeout(() => {
        this.postEncuestasSinEnviar();
      }, 1500);
    }else{
      console.log("Sin Internet Get");
      this.baselocalService.getArrayEncuestas().then(
        data => {
          //this.campaniasJson['campanias'] = data;
        }, error => {
          console.log(error);
        }
      );
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
  nuevaEncuesta(){
    this.router.navigate(['home', {
      idCampania: this.id_Campania
    }]);
  }
  async postEncuestasSinEnviar(){
    this.btndisable = true;
    console.log("Subiendo Encuestas sin enviar al servidor");
    const loading = await this.loadingController.create({
      message: 'Aguarde Subiendo Encuestas sin enviar al servidor.',
    });
    loading.present();
    var limit = this.misencuestasJson?.length;
    var cont = 0;
    if(limit > 0){ 
          await this.misencuestasJson.forEach(async (element, indice) => {
            this.apiVisitArService.postEncuesta(element).subscribe(
              async data => {
                if(data['success'] == true){
                  this.misencuestasJson[indice].Enviado = true;
                  await this.baselocalService.chageEnviadoIndexEncuestas(indice);
                }else{
                  console.log(data['success']);
                }
                cont++;
                if(cont==limit){
                    console.log('Encuestas Subidad');
                    loading.dismiss();
                    this.btndisable = false;
                    const toast = await this.toastController.create({
                      message: 'Encuestas Enviadas',
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
                    this.btndisable = false;
                    const toast = await this.toastController.create({
                      message: 'Encuestas Enviadas',
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
    }else{
      this.btndisable = false;
      loading.dismiss();
      console.log("No hay encuestas guardadas o todas ya fueron subidas al servidor");
    }
  }

  getDistanciaMetros(lat1,lon1,lat2,lon2)
  {
    var rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km 
    var dLat = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * 
    Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    //aquí obtienes la distancia en metros por la conversion 1Km =1000m
    var d = R * c * 1000; 
    return d ; 
  }

}
