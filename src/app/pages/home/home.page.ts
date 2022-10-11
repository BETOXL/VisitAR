import { Component, ViewChild } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, ModalController } from '@ionic/angular';
import { ApiVisitArService } from '../../services/api-visit-ar.service';
import { AuthService } from '../../services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { Device } from '@capacitor/device';
import { ModalHelperComponent } from 'src/app/components/modal-helper/modal-helper.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent) content: IonContent;
  Ubilat: number = 0;
  Ubilng: number = 0;
  jsonEncuestaGet: any;
  formPreguntas: FormGroup;
  currentRes = undefined;
  respuestasCon =[];
  contadorMul:number=0;
  id_Campania:number = 0;
  Identificador_c: string = '';
  device_uuid: string;
  device_model: string;
  btndisable: boolean = false;
  constructor(public modalController: ModalController,private formBuilder: FormBuilder,public alertController: AlertController,private authService: AuthService,
    public loadingController: LoadingController, private activatedRoute: ActivatedRoute, private baselocalService:BaselocalService,
    public router:Router,public apiVisitArService:ApiVisitArService) {
    this.formPreguntas = formBuilder.group({});
  }
  async ionViewDidEnter(){

    const { model } = await Device.getInfo();
    const  { uuid }  = await Device.getId();
    this.device_uuid = uuid;
    this.device_model = model;
    this.id_Campania = 0;
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      this.id_Campania = Number(paramMap.get('idCampania'));
      console.log(this.id_Campania);
    });
    setTimeout(() => {
      console.log("arranco");
      this.getCurrentPosition();
    }, 500);
    
  }
  
  ngOnInit() {
    
  }
  addIntanciasGrupos(idGrupo:number, subgrupoArray:any){
      var insArray = JSON.parse(JSON.stringify(subgrupoArray));
      this.jsonEncuestaGet.Grupos[idGrupo].Instancias.push(insArray);
      console.log(this.jsonEncuestaGet);
  }

  deleteIntanciasGrupos(idGrupo:number,idInstancia:number){
    this.jsonEncuestaGet.Grupos[idGrupo].Instancias.splice(idInstancia, 1);
    console.log(this.jsonEncuestaGet);
  }
  async guardarMensaje() {
    const alert = await this.alertController.create({
      cssClass: 'alertMandado',
      mode: 'ios',
      header: '¿Esta seguro que termino la carga de los grupo de encuestas?',
      message: '¿Contesto todas las <strong>preguntas</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.guardar();
          }
        }
      ]
    });
    await alert.present();
  }
  async guardar(){
    const now = new Date();
    this.btndisable = true;
    this.jsonEncuestaGet.Mac = this.device_uuid;
    this.jsonEncuestaGet.Modelo = this.device_model;
    this.jsonEncuestaGet.Identificador = this.Identificador_c;
    this.jsonEncuestaGet.Fecha = now.toLocaleString();
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current', coordinates);
      this.Ubilat=  coordinates.coords.latitude;
      this.Ubilng= coordinates.coords.longitude;
      this.jsonEncuestaGet.Lat = this.Ubilat;
      this.jsonEncuestaGet.Lng = this.Ubilng;
    } catch (error) {
      console.error(error);
      this.presentAlertConfirmGPSactivar(error.message);
    }
    console.log(this.jsonEncuestaGet);
    console.log("Intento enviar al servidor la encuesta");
    const loading = await this.loadingController.create({
      message: 'Intento enviar al servidor la encuesta',
    });
   
    loading.present();
    this.apiVisitArService.postEncuesta(this.jsonEncuestaGet).subscribe(
      data => {
        loading.dismiss();
        if(data['success'] == true){
          this.jsonEncuestaGet.Enviado = true;
          this.jsonEncuestaGet.IdCampania_data = data['idCampania_data'] ;
          setTimeout(() => {
            this.guardarStorage();
          }, 500);
        }else{
          this.jsonEncuestaGet.Enviado = false;
          this.guardarStorage();
        }
      },error => {  
        this.jsonEncuestaGet.Enviado = false;
        loading.dismiss();
        this.guardarStorage();
        //this.presentAlert('Info', 'Problema', error.message + ' ' +JSON.stringify(error.error));  
        console.log(error);
    });

  }

  async guardarStorage(){
    const loading = await this.loadingController.create({
      message: 'Guardando Encuesta en Local..',
    });
   
    loading.present();
    await this.baselocalService.setArrayEncuesta(this.jsonEncuestaGet).then(
      res => {
        loading.dismiss();
        this.presentAlert('Satisfactorio', 'Info', "Se guarda la encuesta en local");  
        //alert(JSON.stringify(this.jsonEncuestaGet));
        this.router.navigate(['misencuestas', {
        idCampania: this.id_Campania
        }]);
        this.btndisable = false;
      },error => {  
        loading.dismiss();
        this.presentAlert('Info', 'Problema', JSON.stringify(error));  
        console.log(error);
        this.router.navigate(['misencuestas', {
          idCampania: this.id_Campania
        }]);
        this.btndisable = false;
    });
    
  }
  changeCombo(idPregunta:number,ev){
    this.currentRes = ev.target.value;
    for (var respuesta of this.currentRes){
        let conARM = `{{${idPregunta}}}=='${respuesta}'`;
        if(this.respuestasCon.length >0){
          
          this.respuestasCon.forEach((respAlm, index) => {
            console.log(index); // 0, 1, 2
            var splitted = respAlm.split("==", 2);
            if(splitted[0] == `{{${idPregunta}}}`){
              //elimina si el idpregunta es igual y pone el nuevo
              this.respuestasCon.splice(index, 1);
              this.respuestasCon.push(conARM);
            }
            console.log(splitted);
          });
        }else{
          this.respuestasCon.push(conARM);
        }
        //elimina elementos repetidos
        let uniqueChars = this.respuestasCon.filter((element, index) => {
          return this.respuestasCon.indexOf(element) === index;
        });
        this.respuestasCon =uniqueChars;
    }
    console.log(this.respuestasCon);

  }

  changeSelect(idPregunta:number,ev){
    
  
    let respuSel = ev.target.value;
    let conARM = `{{${idPregunta}}}=='${respuSel}'`;
    
    if(this.respuestasCon.length >0){
      this.respuestasCon.forEach((respAlm, index) => {
        //console.log(index); // 0, 1, 2
        var splitted = respAlm.split("==", 2);
        if(splitted[0] == `{{${idPregunta}}}`){
          //elimina si el idpregunta es igual y pone el nuevo
          this.respuestasCon.splice(index, 1);
          this.respuestasCon.push(conARM);
        }else{
          this.respuestasCon.push(conARM);
        }
        //console.log(splitted);
      });
      //elimina elementos repetidos
      let uniqueChars = this.respuestasCon.filter((element, index) => {
        return this.respuestasCon.indexOf(element) === index;
      });
      this.respuestasCon =uniqueChars;
    }else{
      this.respuestasCon.push(conARM);
    }
    console.log(this.respuestasCon);

  }

  async getEncuestaRonda(){
    console.log("obtengo encuesta");
    const loading = await this.loadingController.create({
      message: 'Aguarde Cargando el Modelo de formulario.',
    });
   
    loading.present();
    this.baselocalService.getModeloForIdCam(this.id_Campania).then(
      res => {
        this.jsonEncuestaGet = res;
        console.log(res);
        this.jsonEncuestaGet.Lat = this.Ubilat;
        this.jsonEncuestaGet.Lng = this.Ubilng;
        loading.dismiss();
      },error => {  
        loading.dismiss();
        this.presentAlert('Info', 'Problema', JSON.stringify(error));  
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
  changeComboMul(idInstancia:number,idPregunta:number,ev){
    this.currentRes = ev.target.value;
    for (var respuesta of this.currentRes){
        let conARM = `{{${idInstancia}}}{{${idPregunta}}}=='${respuesta}'`;
        if(this.respuestasCon.length >0){
          
          this.respuestasCon.forEach((respAlm, index) => {
            console.log(index); // 0, 1, 2
            var splitted = respAlm.split("==", 2);
            if(splitted[0] == `{{${idInstancia}}}{{${idPregunta}}}`){
              //elimina si el idpregunta es igual y pone el nuevo
              this.respuestasCon.splice(index, 1);
              this.respuestasCon.push(conARM);
            }
            console.log(splitted);
          });
        }else{
          this.respuestasCon.push(conARM);
        }
        //elimina elementos repetidos
        let uniqueChars = this.respuestasCon.filter((element, index) => {
          return this.respuestasCon.indexOf(element) === index;
        });
        this.respuestasCon =uniqueChars;
    }
    console.log(this.respuestasCon);

  }

  changeSelectMul(idInstancia:number,idPregunta:number,ev){
    
  
    let respuSel = ev.target.value;
    let conARM = `{{${idInstancia}}}{{${idPregunta}}}=='${respuSel}'`;
    
    if(this.respuestasCon.length >0){
      this.respuestasCon.forEach((respAlm, index) => {
        //console.log(index); // 0, 1, 2
        var splitted = respAlm.split("==", 2);
        if(splitted[0] == `{{${idInstancia}}}{{${idPregunta}}}`){
          //elimina si el idpregunta es igual y pone el nuevo
          this.respuestasCon.splice(index, 1);
          this.respuestasCon.push(conARM);
        }else{
          this.respuestasCon.push(conARM);
        }
        //console.log(splitted);
      });
      //elimina elementos repetidos
      let uniqueChars = this.respuestasCon.filter((element, index) => {
        return this.respuestasCon.indexOf(element) === index;
      });
      this.respuestasCon =uniqueChars;
    }else{
      this.respuestasCon.push(conARM);
    }
    console.log(this.respuestasCon);

  }
  cerrar(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async getCurrentPosition() {
    const loading = await this.loadingController.create({
      message: 'Verifico GPS',
    });
    loading.present();
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current', coordinates);
      this.Ubilat=  coordinates.coords.latitude;
      this.Ubilng= coordinates.coords.longitude;
      loading.dismiss();
      this.getEncuestaRonda();
    } catch (error) {
      console.error(error);
      loading.dismiss();
      this.presentAlertConfirmGPSactivar(error.message);
    }
    
  }

  async presentAlertConfirmGPSactivar(errorM) {
    const permisos = await Geolocation.checkPermissions();
    console.log(permisos);
    if(permisos.location == 'denied'){
      Geolocation.requestPermissions();
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: "Ubicación",
      subHeader: "ACTIVAR EL GPS! o no podrá cargar encuestas.",
      message: "1- En chrome ir al candadito en la barra arriba, alado del sitio seguro hacer click y permitir ubicación 2- Android Ir a Ajustes - Aplicaciones - Permisos. " + errorM ,
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.Ubilat=0;
            this.Ubilng=0;
            this.getCurrentPosition();
          }
        }, {
          text: "Confirmar",
          handler: () => {
            this.getCurrentPosition();
          }
        }
      ]
    });

    await alert.present();
    
  }

  subirArriba(){
    this.content.scrollToTop();
  }
  async ayudaPreguntas(texto:String){
    let mensaje;
    if(texto=='' || texto==null || texto==undefined){
      mensaje= '<H1>TITULO 1 PREGUNTA ID xxx</H1> asdas asd asdas d sadas dd asdasdasd JDOSDOAS ASDKASODMOASD MOASMDOMASMD MOMSAODOMAOSDM MOASMDOMOASM OMASMDOMAOSD OMOSAMDM ASMD SAOMDMOMAOSD AS OMASDOMASOMDOM MOASOMDOMMASODMAS MOSAMODMMSAMDOASMD MOSAMDOMASOMDMASMD OSAMDOASMDOMASMDOMAS SOAMDOMSAMDMASD MOASMDOMASMDMASMD MOASMDOM OASMODMOASMDMSA OMSAMODMOASMDMAMSODMASD OSMAOMDMASDMOMASODMOASMDM 1121 D151 515 15 151 51 51 5151 51S51D51S5D1 5A15D 151 151S 5D15A1S5D 51S 15S1 51S51D 51S5A1D51SA51D 51AS5 151 515S1AD 51D51SA51D 5S1A5D 151D 51S5A1D51 5DA151D5S1 5 15AS1D 51AS5D 5AS1D 551D 51SA5D15SA1D ASD SADUSADUASUDJNIASJDI JIJSAIJ DISJIDJIASJDIJASID JKAISJDI IJD ISAJDIJASIDMKASMLDIFDNFIJNGKDM OJDFIGNMDKFMGPDF,GO MKDFOGM FMG OIG NDO MDFOMGO ODIFGNJ DFMOGM  ASMDOMASOMDMASMDMASD OASMDOMASMDOMASODMOAMSDMO ASODMOASMDOMASMDMASOMDOMASOD DAMSODM OMASODMASOMDHoladsad mskodfkdsmfkms dskfmsdkomfkosdkfm fsdkfmksodm fkomsdkfsd sdkfmsdokfmksdmfkomskd dfskfmoskdmfkosdmofsdm sdkofmsdkomfkosmdfkmsdokfmskodmf sdfkmsdkomf sdsfkmoms koddf s,dpf  sdf ,dspl,fp,dsfop,sdo,sidjf89jsd9fj sd ujds98f9sje ds 9jsdf9j9sdjfjsd9fj  j9sdjf9jd9jfi9dsj9if';
      
    }else{
      mensaje = texto;
    }
    const modal = await this.modalController.create({
      component: ModalHelperComponent,
      componentProps: { 
        mensaje: mensaje,
      }
    });
    return await modal.present();
    
  }
}
