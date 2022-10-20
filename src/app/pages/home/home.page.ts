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
import { OnExit } from 'src/app/guards/exit.guard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnExit {
  @ViewChild(IonContent) content: IonContent;
  Ubilat: number = 0;
  Ubilng: number = 0;
  jsonEncuestaGet: any;
  formPreguntas: FormGroup;
  currentRes = undefined;
  respuestasCon =[];
  contadorMul:number=0;
  id_Campania:number = 0;
  idCampania_data:number = null;
  Identificador_c: string = '';
  device_uuid: string;
  device_model: string;
  btndisable: boolean = false;
  condicionTest: String  = "{{78}}=='Femenino'    && {{76}}=='DNI'"
  enviado =false;
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
      this.idCampania_data = Number(paramMap.get('idCampania_data'));
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
    this.jsonEncuestaGet.Fecha = now.toUTCString();
    this.jsonEncuestaGet.Enviado = false;
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

    this.guardarNuevaStorage();

  }

  async guardarNuevaStorage(){
    const loading = await this.loadingController.create({
      message: 'Guardando Encuesta en Local..',
    });
   
    loading.present();
    await this.baselocalService.setArrayEncuesta(this.jsonEncuestaGet).then(
      res => {
        loading.dismiss();
        this.btndisable = false;
        this.enviado = true;
        this.presentAlert('Satisfactorio', 'Info', "Se guarda la encuesta en local");  
        //alert(JSON.stringify(this.jsonEncuestaGet));
        this.router.navigate(['misencuestas', {
          idCampania: this.jsonEncuestaGet.Id
        }]);
      },error => {  
        loading.dismiss();
        this.presentAlert('Info', 'Problema', JSON.stringify(error));  
        console.log(error);
        // this.router.navigate(['misencuestas', {
        //   idCampania: this.jsonEncuestaGet.Id
        // }]);
        this.btndisable = false;
        this.enviado = false;
    });
    
  }
  

  async getEncuestaRonda(){
    
    const loading = await this.loadingController.create({
      message: 'Aguarde Cargando el Modelo de formulario.',
    });
   
    loading.present();
    if(this.id_Campania!= null && this.id_Campania!=0 && this.id_Campania!=undefined){
      console.log("Encuesta Nueva miro modelos.");
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
    }else{
      if(this.idCampania_data!= null && this.idCampania_data!=0 && this.idCampania_data!=undefined){
          console.log("Encuesta en Storage busco por id");
          this.baselocalService.getArrayEncuestasForIdData(this.idCampania_data).then(
            res => {
              console.log(res);
              if(res != undefined && res!= null){
                this.jsonEncuestaGet = res;
                this.jsonEncuestaGet.Lat = this.Ubilat;
                this.jsonEncuestaGet.Lng = this.Ubilng;
                this.Identificador_c = res.Identificador;
              }else{
                this.presentAlert('Info', 'Error', 'No se encontró el Identificador de la encuesta'); 
              }
             
              loading.dismiss();
             
            },error => {  
              loading.dismiss();
              this.presentAlert('Info', 'Problema', JSON.stringify(error));  
              console.log(error);
          });
      }
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
  async changeComboMul(idInstancia:number,idPregunta:number,ev){
    this.currentRes = ev.target.value;
    if(this.respuestasCon.length >0){  
      const limpiaSinId = await this.respuestasCon.filter(x => x.idPregunta != idPregunta && x.idInstancia == idInstancia );
      this.respuestasCon = limpiaSinId;
      for (var respuesta of this.currentRes){
        let respuestaLlega = {
          idInstancia: idInstancia,
          idPregunta: idPregunta,
          respuSel: respuesta
        };
        this.respuestasCon.push(respuestaLlega);
      }
    }else{
      for (var respuesta of this.currentRes){
        let respuestaLlega = {
          idInstancia: idInstancia,
          idPregunta: idPregunta,
          respuSel: respuesta
        };
        this.respuestasCon.push(respuestaLlega);
      }
    }
    
    console.log(this.respuestasCon);

  }

  async changeCombo(idPregunta:number,ev){
    this.currentRes = ev.target.value;   
    if(this.respuestasCon.length >0){  
      const limpiaSinId = await this.respuestasCon.filter(x => x.idPregunta != idPregunta);
      this.respuestasCon = limpiaSinId;
      for (var respuesta of this.currentRes){
        let respuestaLlega = {
          idInstancia: null,
          idPregunta: idPregunta,
          respuSel: respuesta
        };
        this.respuestasCon.push(respuestaLlega);
      }
    }else{
      for (var respuesta of this.currentRes){
        let respuestaLlega = {
          idInstancia: null,
          idPregunta: idPregunta,
          respuSel: respuesta
        };
        this.respuestasCon.push(respuestaLlega);
      }
    }
    
    console.log(this.respuestasCon);

  }

  changeSelect(idPregunta:number,ev){
    
  
    let respuSel = ev.target.value;
    let respuestaLlega = {
      idInstancia: null,
      idPregunta: idPregunta,
      respuSel: respuSel
    };
    //console.log('llega', respuestaLlega);
    if(this.respuestasCon.length >0){
      this.respuestasCon.forEach((respAlm, index) => {
        //console.log('alma', respAlm);
        if(respuestaLlega.idPregunta == respAlm.idPregunta){
          //elimina si el idpregunta es igual y pone el nuevo
          this.respuestasCon.splice(index, 1);
          this.respuestasCon.push(respuestaLlega);
          //console.log('push elimina', respuestaLlega);
        }else{
          this.respuestasCon.push(respuestaLlega);
        }

      });
      // //elimina elementos repetidos
      let uniqueChars = this.respuestasCon.filter((element, index) => {
        return this.respuestasCon.indexOf(element) === index;
      });
      this.respuestasCon =uniqueChars;
      //console.log('cargado', this.respuestasCon);
    }else{
      this.respuestasCon.push(respuestaLlega);
      //console.log('limpio', this.respuestasCon);
    }
    console.log(this.respuestasCon);

  }

  changeSelectMul(idInstancia:number,idPregunta:number,ev){
    
  
    let respuSel = ev.target.value;
    
    let respuestaLlega = {
      idInstancia: idInstancia,
      idPregunta: idPregunta,
      respuSel: respuSel
    };
    if(this.respuestasCon.length >0){
      this.respuestasCon.forEach((respAlm, index) => {
        
        if(respuestaLlega.idInstancia == respAlm.idInstancia && respuestaLlega.idPregunta == respAlm.idPregunta){
          //elimina si el idpregunta es igual y pone el nuevo
          this.respuestasCon.splice(index, 1);
          this.respuestasCon.push(respuestaLlega);
        }else{
          this.respuestasCon.push(respuestaLlega);
        }
        //console.log(splitted);
      });
      //elimina elementos repetidos
      let uniqueChars = this.respuestasCon.filter((element, index) => {
        return this.respuestasCon.indexOf(element) === index;
      });
      this.respuestasCon =uniqueChars;
    }else{
      this.respuestasCon.push(respuestaLlega);
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
  async ayudaPreguntas(titulo: string,texto:String){
    let mensaje;
    let tituloP;
    if(texto=='' || texto==null || texto==undefined){
      mensaje= '<H1>TITULO 1 PREGUNTA ID xx</H1> asdas asd asdas d sadas dd asdasdasd JDOSDOAS ASDKASODMOASD MOASMDOMASMD MOMSAODOMAOSDM MOASMDOMOASM OMASMDOMAOSD OMOSAMDM ASMD SAOMDMOMAOSD AS OMASDOMASOMDOM MOASOMDOMMASODMAS MOSAMODMMSAMDOASMD MOSAMDOMASOMDMASMD OSAMDOASMDOMASMDOMAS SOAMDOMSAMDMASD MOASMDOMASMDMASMD MOASMDOM OASMODMOASMDMSA OMSAMODMOASMDMAMSODMASD OSMAOMDMASDMOMASODMOASMDM 1121 D151 515 15 151 51 51 5151 51S51D51S5D1 5A15D 151 151S 5D15A1S5D 51S 15S1 51S51D 51S5A1D51SA51D 51AS5 151 515S1AD 51D51SA51D 5S1A5D 151D 51S5A1D51 5DA151D5S1 5 15AS1D 51AS5D 5AS1D 551D 51SA5D15SA1D ASD SADUSADUASUDJNIASJDI JIJSAIJ DISJIDJIASJDIJASID JKAISJDI IJD ISAJDIJASIDMKASMLDIFDNFIJNGKDM OJDFIGNMDKFMGPDF,GO MKDFOGM FMG OIG NDO MDFOMGO ODIFGNJ DFMOGM  ASMDOMASOMDMASMDMASD OASMDOMASMDOMASODMOAMSDMO ASODMOASMDOMASMDMASOMDOMASOD DAMSODM OMASODMASOMDHoladsad mskodfkdsmfkms dskfmsdkomfkosdkfm fsdkfmksodm fkomsdkfsd sdkfmsdokfmksdmfkomskd dfskfmoskdmfkosdmofsdm sdkofmsdkomfkosmdfkmsdokfmskodmf sdfkmsdkomf sdsfkmoms koddf s,dpf  sdf ,dspl,fp,dsfop,sdo,sidjf89jsd9fj sd ujds98f9sje ds 9jsdf9j9sdjfjsd9fj  j9sdjf9jd9jfi9dsj9if';
      tituloP='PREGUNTA'
    }else{
      mensaje = texto;
      tituloP = titulo;
    }
    const modal = await this.modalController.create({
      component: ModalHelperComponent,
      componentProps: { 
        mensaje: mensaje,
        titulo: tituloP,
      }
    });
    return await modal.present();
    
  }

  funcionCondiciones(CondEval: String, instaciasCon: number, arrayRespuestas){
      //console.log(CondEval, ' ', instaciasCon);
      var newarr = CondEval.split("{{");
          //recorremos los idPreguntas encontradas y sacamos el }}
      let replazo = CondEval;
      for(var i = 0;i<newarr.length;i++) { 
                let idPreguntaLimpio = newarr[i].split("}}");
                //console.log(idPreguntaLimpio[0]);
                if (idPreguntaLimpio[0]!=''){
                  let idPregNum = Number(idPreguntaLimpio[0]);
                  //console.log(idPregNum);
                  for(var j = 0;j<arrayRespuestas.length;j++) {
                          if((instaciasCon == arrayRespuestas[j].idInstancia && idPregNum == arrayRespuestas[j].idPregunta)
                          || (null == arrayRespuestas[j].idInstancia && idPregNum == arrayRespuestas[j].idPregunta)){
                              //elimina si el idpregunta es igual y pone el nuevo valor selecccionado
                              replazo = replazo.replace(`{{${idPregNum}}}`,`'${arrayRespuestas[j].respuSel}'` );
                              //console.log(replazo);
                              //verifico si quedo bien armado el string para pasar al eval
                              let posicion = replazo.indexOf('{{');
                              if (posicion !== -1){
                                //console.log("No se encontraron todos los {{ids preguntas}} " + posicion);
                              }
                              else{
                                  //console.log("se remplazo todo los {{ids preguntas}}");
                                  let resultadoscript = eval(`${replazo}`);
                                  //console.log(resultadoscript);
                                  return resultadoscript;
                              }
                          }else{
                            //console.log("no hay idpreguntas iguales");
                          }
                          //console.log(splitted);
                  };
                }         
      };
      return false;
  }
  funcionCondicionesPre(CondEval: String, instaciasCon: number, arrayRespuestas){
    //console.log(CondEval, ' ', instaciasCon);
    var newarr = CondEval.split("{{");
        //recorremos los idPreguntas encontradas y sacamos el }}
    let replazo = CondEval;
    for(var i = 0;i<newarr.length;i++) { 
              let idPreguntaLimpio = newarr[i].split("}}");
              //console.log(idPreguntaLimpio[0]);
              if (idPreguntaLimpio[0]!=''){
                let idPregNum = Number(idPreguntaLimpio[0]);
                //console.log(idPregNum);
                for(var j = 0;j<arrayRespuestas.length;j++) {
                        if((instaciasCon == arrayRespuestas[j].idInstancia && idPregNum == arrayRespuestas[j].idPregunta)
                        || (null == arrayRespuestas[j].idInstancia && idPregNum == arrayRespuestas[j].idPregunta)){
                            //elimina si el idpregunta es igual y pone el nuevo valor selecccionado
                            replazo = replazo.replace(`{{${idPregNum}}}`,`'${arrayRespuestas[j].respuSel}'` );
                            //console.log(replazo);
                            //verifico si quedo bien armado el string para pasar al eval
                            let posicion = replazo.indexOf('{{');
                            if (posicion !== -1){
                              //console.log("No se encontraron todos los {{ids preguntas}} " + posicion);
                            }
                            else{
                                //console.log("se remplazo todo los {{ids preguntas}}");
                                //console.log(replazo);
                                let resultadoscript = eval(`${replazo}`);
                                //console.log(resultadoscript);
                                return resultadoscript;
                            }
                        }else{
                          //console.log("no hay idpreguntas iguales");
                        }
                        //console.log(splitted);
                };
              }         
    };
    return false;
    }
    checkFocusOut(idPregunta:number,ev){
        let respuSel = ev.target.value;
        if(respuSel!=''){
          let respuestaLlega = {
            idInstancia: null,
            idPregunta: idPregunta,
            respuSel: respuSel
          };
          //console.log('llega', respuestaLlega);
          if(this.respuestasCon.length >0){
            this.respuestasCon.forEach((respAlm, index) => {
              //console.log('alma', respAlm);
              if(respuestaLlega.idPregunta == respAlm.idPregunta){
                //elimina si el idpregunta es igual y pone el nuevo
                this.respuestasCon.splice(index, 1);
                this.respuestasCon.push(respuestaLlega);
                //console.log('push elimina', respuestaLlega);
              }else{
                this.respuestasCon.push(respuestaLlega);
              }
  
            });
            // //elimina elementos repetidos
            let uniqueChars = this.respuestasCon.filter((element, index) => {
              return this.respuestasCon.indexOf(element) === index;
            });
            this.respuestasCon =uniqueChars;
            //console.log('cargado', this.respuestasCon);
          }else{
            this.respuestasCon.push(respuestaLlega);
            //console.log('limpio', this.respuestasCon);
          }
          console.log(this.respuestasCon);
        }
        
    }
    checkFocusOutMul(idInstancia:number,idPregunta:number,ev){
      let respuSel = ev.target.value;
      if(respuSel!=''){
        let respuestaLlega = {
          idInstancia: idInstancia,
          idPregunta: idPregunta,
          respuSel: respuSel
        };
        //console.log('llega', respuestaLlega);
        if(this.respuestasCon.length >0){
          this.respuestasCon.forEach((respAlm, index) => {
            //console.log('alma', respAlm);
            if(respuestaLlega.idInstancia == respAlm.idInstancia && respuestaLlega.idPregunta == respAlm.idPregunta){
              //elimina si el idpregunta es igual y pone el nuevo
              this.respuestasCon.splice(index, 1);
              this.respuestasCon.push(respuestaLlega);
              //console.log('push elimina', respuestaLlega);
            }else{
              this.respuestasCon.push(respuestaLlega);
            }

          });
          // //elimina elementos repetidos
          let uniqueChars = this.respuestasCon.filter((element, index) => {
            return this.respuestasCon.indexOf(element) === index;
          });
          this.respuestasCon =uniqueChars;
          //console.log('cargado', this.respuestasCon);
        }else{
          this.respuestasCon.push(respuestaLlega);
          //console.log('limpio', this.respuestasCon);
        }
        console.log(this.respuestasCon);
      }
      
  }


 
  async onExit() {
    if (this.enviado) {
      return true;
    }
    //const rta = confirm('¿Quieres salir del formulario y perder los cambios realizados?');
    //return rta;
    
    const alert = await this.alertController.create({
      header: "¿Salir Sin Guardar?",
      message: "¿Quieres salir del formulario y perder los cambios realizados?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "Aprobar",
          role: "goBack",
          handler: () => {}
        }
      ]
    });

    await alert.present();

    const data = await alert.onDidDismiss();

    if (data.role == "goBack") {
      return true;
    } else {
      return false;
    }
  }




  //end
}
