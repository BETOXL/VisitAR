import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class BaselocalService {
  arrayEncuesta: any[] = [];
  arrayEncuestasEnv: any[] = [];
  arrayCampanias: any[] = [];
  arrayCampaniasEnv: any[] = [];
  arrayModelos: any[] = [];
  arrayModelosEnv: any[] = [];
  constructor() { }

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
  async getArrayEncuestasForIdCam(idCampana: number){
    let resEn = await Preferences.get({key:'Encuestas'});
    var resObjEnc = JSON.parse(resEn.value);
    const encuestasSolo = await resObjEnc.filter(x => x.Id == idCampana);
        //return res.find(x => x.Id == idCampaña);
    return encuestasSolo;
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
  async chageEnviadoIndexEncuestas(indice: number){
    await this.getArrayEncuestas().then(res=>{
      //console.log('res',res);
      if (res !== null){
        this.arrayEncuesta = res;
      }
      //Cambio el estado a enviado faltaria agrgar el id de la encuesta
      this.arrayEncuesta[indice].Enviado= true;
      
      Preferences.set({
        key: 'Encuestas',
        value: JSON.stringify(this.arrayEncuesta)
      });
    });
  }

  
  async setArrayCampanias(arrayCampanias_r: any[]){
    console.log(arrayCampanias_r);
    this.arrayCampanias = arrayCampanias_r;
    Preferences.set({
      key: 'CampaniasVisitar',
      value: JSON.stringify(this.arrayCampanias)
    });
  }
  async getArrayCampanias(){
    const res = await Preferences.get({key:'CampaniasVisitar'});
    return JSON.parse(res.value);
  }

  async setArrayModelo(modelo: any){
    await this.getArrayModelos().then(res=>{

      if (res !== null){
        this.arrayModelos = res;
      }
      this.arrayModelos.push(modelo);
      
      var hash = {};
      let uniqueChars = this.arrayModelos.filter(function(current) {
        var exists = !hash[current.Id];
        hash[current.Id] = true;
        return exists;
      });
      this.arrayModelos = uniqueChars;

      Preferences.set({
        key: 'ModelosVisitar',
        value: JSON.stringify(this.arrayModelos)
      });
    });
    
  }

  async getArrayModelos(){
    const res = await Preferences.get({key:'ModelosVisitar'});
    return JSON.parse(res.value);
  }
  
  async getModeloForIdCam(idCampana: number){
    let res = await Preferences.get({key:'ModelosVisitar'});
    var resObj = JSON.parse(res.value);
    const modeloSolo = await resObj.filter(x => x.Id == idCampana)[0];
        //return res.find(x => x.Id == idCampaña);
    return modeloSolo;
  }


}
