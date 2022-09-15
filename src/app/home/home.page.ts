import { Component } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  encuesta:any;
  formPreguntas: FormGroup;
  //inputsPreguntas = [];
  //GruposNombre=[];
  //SubGruposNombre=[];
  //SubGruposMultiples=[];
  currentRes = undefined;
  respuestasCon =[];
  constructor(private formBuilder: FormBuilder) {
    this.formPreguntas = formBuilder.group({});
  }
  async ionViewDidEnter(){
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
                  tipo:"Select",
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
                    tipo:"Texto",
                    repuesta: ""
                  }
              ]
            }			
                
          ]
        },
        { 
        Grupo:"Personas" ,
        EsMultiple: true,
        Subgrupo : [
          { 
            Subgrupo: "Datos Personales",
            preguntas:
            [
              {
                id:2581,
                pregunta:"Nombre",
                tipo:"Texto",
                repuesta: ""
              },
              {
                id:2582,
                pregunta:"Edad",
                tipo:"Numero",
                repuesta: ""
              },
              {
                id:2583,
                pregunta:"Fecha Nacimiento",
                tipo:"Fecha",
                repuesta: ""
              },
              {
                id:2184,
                pregunta:"Fumador?",
                tipo:"Booleano",
                repuesta: false
              }
            ],
          },
        ]
        }
      ];
      //this.preparingInputsQuestions();
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
  addSubgrupoPreguntas(indGrupo:number,subgrupos:any){
    this.encuesta[indGrupo].Subgrupo.push(subgrupos);
    console.log(this.encuesta);
  }
  deleteSubgrupoPreguntas(indGrupo:number,idSubGrupo:number){
    this.encuesta[indGrupo].Subgrupo.splice(idSubGrupo, 1);
    console.log(this.encuesta);
  }

  guardar(){
    console.log(this.encuesta);
  }
  changeCombo(idPregunta:number,ev){
    this.currentRes = ev.target.value;
    for (var respuesta of this.currentRes){
      let conARM = `{{${idPregunta}}}=='${respuesta}'`;
      this.respuestasCon.push(conARM);
    }
    console.log(this.respuestasCon);

  }

  changeSelect(idPregunta:number,ev){
    let respuSel = ev.target.value;
    let conARM = `{{${idPregunta}}}=='${respuSel}'`;
    this.respuestasCon.push(conARM);
    console.log(this.respuestasCon);
  }

  

}
