import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class BaselocalService {
  loccir: {
    idCandidato: number,
    idLocalidad: number,
    IdCircuito: string,
    
  };

  arrayEncuesta: any[] = [];
  arrayEncuestasEnv: any[] = [];


  constructor() { }

  async setLocCirCan(loc: number, cir: string, cand: number) {
    this.loccir = {
      idCandidato: cand,
      idLocalidad: loc,
      IdCircuito: cir,
    }
    await Preferences.set({
      key: 'LOCCIRCAN',
      value: JSON.stringify(this.loccir)
    });
  }

  async getLocCirCan() {
    const ret = await Preferences.get({ key: 'LOCCIRCAN' });
    return  JSON.parse(ret.value);
  }

  async setArrayEncuesta(encuesta: any){
    //console.log('1',this.arrayEncuesta);
    await this.getArrayEncuestas().then(res=>{
      //console.log('res',res);

      if (res !== null){
        this.arrayEncuesta = res;
      }
      
      //console.log('2 = ',this.arrayEncuesta);
      this.arrayEncuesta.push(encuesta);
      //console.log('3 push',this.arrayEncuesta);
      Preferences.set({
        key: 'Encuestas',
        value: JSON.stringify(this.arrayEncuesta)
      });
      //console.log('4 storage',this.arrayEncuesta);
    });
    
  }

  
  async setEncuestas(encuestas: any[]){
    this.arrayEncuesta = encuestas;
    Preferences.set({
      key: 'Encuestas',
      value: JSON.stringify(this.arrayEncuesta)
    });
  }

  async getArrayEncuestas(){
    const res = await Preferences.get({key:'Encuestas'});
    return JSON.parse(res.value);
  }

  
  async limpiarEncuestas(){
      await Preferences.remove({ key: 'Encuestas' });
  }

  async deleteIndexEncuestas(indice: number){
    await this.getArrayEncuestas().then(res=>{
      //console.log('res',res);
      if (res !== null){
        this.arrayEncuesta = res;
      }
      //elimina el indice indicado
      delete this.arrayEncuesta[indice];
      Preferences.set({
        key: 'Encuestas',
        value: JSON.stringify(this.arrayEncuesta)
      });
    });
  }

}
