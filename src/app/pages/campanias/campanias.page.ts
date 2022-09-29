import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campanias',
  templateUrl: './campanias.page.html',
  styleUrls: ['./campanias.page.scss'],
})
export class CampaniasPage implements OnInit {
 campanias: any;
  constructor() {
   }

  ngOnInit() {
  }
  async ionViewDidEnter(){
    this.campanias = {
      "success": true,
      "relevamientos": [
        {
          "Id": 1,
          "Nombre": "Chaco - Regon II - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 1",
          "Activo": true,
          "FechaInicio": "2022-09-19T00:39:29.000Z",
          "FechaFin": "2022-10-19T00:39:32.000Z",
          "CAP": 123,
          "IdRegion": 1,
          "IdProvincia": null,
          "IdLocalidad": null
        },
        {
          "Id": 2,
          "Nombre": "Chaco 2 - Regon I - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 2",
          "Activo": true,
          "FechaInicio": "2022-09-19T00:39:33.000Z",
          "FechaFin": "2022-10-18T00:39:34.000Z",
          "CAP": 124,
          "IdRegion": null,
          "IdProvincia": null,
          "IdLocalidad": null
        },
        {
          "Id": 3,
          "Nombre": "Chaco 3 - Regon I - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 3",
          "Activo": true,
          "FechaInicio": "2022-09-19T00:39:35.000Z",
          "FechaFin": "2022-10-19T00:39:36.000Z",
          "CAP": 1244,
          "IdRegion": null,
          "IdProvincia": null,
          "IdLocalidad": null
        },
        {
          "Id": 4,
          "Nombre": "Chaco 6 - Regon I - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 3",
          "Activo": true,
          "FechaInicio": "2022-09-19T00:39:37.000Z",
          "FechaFin": "2022-10-19T00:39:38.000Z",
          "CAP": 1255,
          "IdRegion": null,
          "IdProvincia": null,
          "IdLocalidad": null
        },
        {
          "Id": 5,
          "Nombre": "Chaco 5 - Regon I - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 5",
          "Activo": true,
          "FechaInicio": "2022-09-19T00:39:40.000Z",
          "FechaFin": "2022-10-19T00:39:39.000Z",
          "CAP": 1255,
          "IdRegion": null,
          "IdProvincia": null,
          "IdLocalidad": null
        },
        {
          "Id": 6,
          "Nombre": "Chaco 7 - Regon I - CAP 123 - Rcia",
          "Descripcion": "Relevamiento 7",
          "Activo": false,
          "FechaInicio": "2022-09-01T03:00:00.000Z",
          "FechaFin": "2022-10-01T03:00:00.000Z",
          "CAP": 1255,
          "IdRegion": null,
          "IdProvincia": null,
          "IdLocalidad": null
        }
      ]
    }
    
    setTimeout(() => {
      this.campanias['relevamientos']  = this.campanias['relevamientos'].sort((a, b) => b.Id - a.Id );
    }, 500);
  }
}
