import { Component } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiVisitArService } from '../services/api-visit-ar.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  encuesta:any;
  jsonEncuestaGet: any;
  formPreguntas: FormGroup;
  //inputsPreguntas = [];
  //GruposNombre=[];
  //SubGruposNombre=[];
  //SubGruposMultiples=[];
  currentRes = undefined;
  respuestasCon =[];
  contadorMul:number=0;
  constructor(private formBuilder: FormBuilder,public alertController: AlertController,
    public loadingController: LoadingController, public apiVisitArService:ApiVisitArService) {
    this.formPreguntas = formBuilder.group({});
  }
  async ionViewDidEnter(){
    this.getEncuestaRonda();
    setTimeout(() => {
      this.encuesta = [
        { 
          Grupo:"Ambiental" ,
          EsMultiple: false,
          Subgrupo : [
            { 
              Subgrupo: "Ubicacion",
              preguntas:
              [ 
                {
                  id:2588,
                  pregunta:"Ubicacion",
                  tipo:"Combo",
                  opciones:["Rural", "Urbana"],
                  valor:"Urbana",
                  repuesta: ""
                }
              ],
            },
            { Subgrupo: "Terreno",
              preguntas:
              [ 
                  {
                    id:1258,
                    pregunta:"INSTITUCIONES BARRIALES / VECINALES",
                    tipo:"Combo",
                    opciones:[	
                          "NO CONTESTA1",
                          "AUSENTE",
                          "BALDÍO (SIN CERRAMIENTO)",
                          "BALDÍO CON CERCA (Rejas, Alambre, Madera)",
                          "BALDÍO CON TAPIA (Ladrillo, Bloque)",
                          "VIVIENDA, ACEPTA LA ENCUESTA",
                          "VIVIENDA, RECHAZO",
                          "EQUIPAMIENTO COMERCIO",
                          "SITUACIÓN DE CALLE",
                          "VIVIENDA DESHABITADA",
                          "VIVIENDA EN CONSTRUCCIÓN",
                          "VIVIENDA TEMPORAL",
                          "OTROS (Especificar)"
                         ],
                    valor:"AUSENTE",
                    repuesta: ""
                  },
                  {
                    id:1025,
                    condicion:"{{1258}}=='OTROS (Especificar)'",
                    pregunta:"INSTITUCIONES BARRIALES / VECINALES DETALLE",
                    tipo:"Text",
                    repuesta: ""
                  }
              ]
            }			
                
          ]
        },
        { 
        Grupo:"Personas" ,
        Instancias:
          [
          ],
        EsMultiple: true,
        Subgrupo : [
          { 
            Subgrupo: "Datos Personales",
            preguntas:
            [
              {
                id:2581,
                pregunta:"Nombre",
                tipo:"Text",
                repuesta: ""
              },
              {
                id:2582,
                pregunta:"Genero",
                tipo:"Combo",
                opciones:["Mujer", "Hombre", "X"],
                valor:"Mujer",
                repuesta: ""
              },
              {
                id:2583,
                pregunta:"Edad",
                tipo:"Number",
                repuesta: ""
              },
              {
                id:2584,
                pregunta:"Fecha Nacimiento",
                tipo:"Date",
                repuesta: ""
              },
              {
                id:2185,
                pregunta:"Fumador?",
                tipo:"Bool",
                repuesta: false
              }
            ],
          },
          {
            Subgrupo: "Datos de embarazo",
            condicion:"{{2582}}=='Mujer'",
            preguntas:
            [
              {
                id:2581,
                pregunta:"Cuantos Meses",
                tipo:"Text",
                repuesta: ""
              },
              {
                id:2583,
                pregunta:"Fecha de Parto",
                tipo:"Date",
                repuesta: ""
              },
              {
                id:2184,
                pregunta:"Fumadora?",
                tipo:"Bool",
                repuesta: false
              }
            ],

          }
        ],
        
        }
      ];
      
    }, 500);
  }
  
 /*
  preparingInputsQuestions(){
    for (var grupos of this.encuesta){
        //Veo los grupos existentes
        console.log("Agrego un grupo ", grupos.Grupo);
        this.GruposNombre.push(grupos.Grupo);
        //Recorro los subgrupos
        for (var subgrupos of grupos.Subgrupo){
            console.log("Agrego un subgrupo ", subgrupos.Subgrupo);
            this.SubGruposNombre.push(subgrupos.Subgrupo);
            //Recorro las preguntas
            if(grupos.EsMultiple==true){
              this.SubGruposMultiples.push(subgrupos.preguntas);
            }
            for (var preguntas of subgrupos.preguntas){
                console.log("Agrego un preguntas ", preguntas);
                this.inputsPreguntas.push(preguntas);
            }

        }
    }
    
  }
  */
  // addSubgrupoPreguntas(indGrupo:number,subgrupos:any){
  //   for (var subgrupos of grupos.Subgrupo){
  //     console.log("Agrego un subgrupo ", subgrupos.Subgrupo);
  //     this.SubGruposNombre.push(subgrupos.Subgrupo);
  //     //Recorro las preguntas
  //     if(grupos.EsMultiple==true){
  //       this.SubGruposMultiples.push(subgrupos.preguntas);
  //     }
  //     for (var preguntas of subgrupos.preguntas){
  //         console.log("Agrego un preguntas ", preguntas);
  //         this.inputsPreguntas.push(preguntas);
  //     }
  //   }
  //   this.encuesta[indGrupo].Subgrupo.push(subgrupos);
  //   console.log(this.encuesta);
  // }
  addIntanciasGrupos(idGrupo:number, subgrupoArray:any){
      var insArray = JSON.parse(JSON.stringify(subgrupoArray));
      this.encuesta[idGrupo].Instancias.push(insArray);
      console.log(this.encuesta);
  }

  deleteIntanciasGrupos(idGrupo:number,idInstancia:number){
    this.encuesta[idGrupo].Instancias.splice(idInstancia, 1);
    console.log(this.encuesta);
  }

  guardar(){
    console.log(this.encuesta);
    alert(JSON.stringify(this.encuesta));
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
        this.presentAlert('Error', 'Problema', error.error); 
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
}
