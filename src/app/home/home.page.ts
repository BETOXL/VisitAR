import { Component } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiVisitArService } from '../services/api-visit-ar.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  jsonEncuestaGet: any;
  formPreguntas: FormGroup;
  currentRes = undefined;
  respuestasCon =[];
  contadorMul:number=0;
  constructor(private formBuilder: FormBuilder,public alertController: AlertController,private authService: AuthService,
    public loadingController: LoadingController, public router:Router,public apiVisitArService:ApiVisitArService) {
    this.formPreguntas = formBuilder.group({});
  }
  async ionViewDidEnter(){
    this.getEncuestaRonda();
    setTimeout(() => {
      console.log("arranco");
    }, 500);
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

  guardar(){
    console.log(this.jsonEncuestaGet);
    alert(JSON.stringify(this.jsonEncuestaGet));
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
      message: 'Aguarde pidiendo json...',
    });
   
    // await loading.present();
    this.apiVisitArService.getEncuestaRonda().subscribe(
      data => {
        this.jsonEncuestaGet = data;
        console.log(this.jsonEncuestaGet);
        loading.dismiss();
      },error => {  
        loading.dismiss();
        this.presentAlert('Error', 'Problema', JSON.stringify(error.error)); 
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
}
