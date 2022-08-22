import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  encuesta = [
    { 
      Grupo:"Ambiental" ,
      EsMultipe: true,
      Subgrupo : [
        { 
          Subgrupo: "Ubicacion",
          pregutas:
          [ 
            {
              id:1,
              preguta:"Ubicacion",
              opciones:["rural", "Urbna"]		
            }
          ],
        },
        { "Subgrupo": "Terreno",
          "pregutas":
          [ 
              {
                id:1,
                preguta:"INSTITUCIONES BARRIALES / VECINALES",
                tipo:"Combo",
                opciones:[	
                      "NO CONTESTA",
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
                valor:"AUSENTE"
              },
              {
                id:1.1,
                condicion:"{{1}}=='OTROS ( Especificar )'",
                preguta:"INSTITUCIONES BARRIALES / VECINALES DETALLE",
                tipo:"Texto"
              }
          ]
        }			
            
      ]
    }
  ];
  constructor() {}

}
