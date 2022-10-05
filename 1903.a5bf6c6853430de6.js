"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1903],{1903:(M,C,r)=>{r.r(C),r.d(C,{CampaniasPageModule:()=>S});var d=r(6895),Z=r(4719),s=r(1558),g=r(2905),l=r(5861),b=r(5670),n=r(6353),_=r(617),y=r(7556),x=r(1098);function P(a,c){if(1&a){const t=n.EpF();n.TgZ(0,"ion-buttons",17)(1,"ion-button",18),n.NdJ("click",function(){n.CHM(t);const o=n.oxw();return n.KtG(o.showInstallBanner())}),n._UZ(2,"ion-icon",19),n._uU(3," Instalar "),n.qZA()()}2&a&&(n.xp6(1),n.Q6J("replaceUrl",!0))}function A(a,c){if(1&a&&(n.TgZ(0,"ion-item",22)(1,"ion-thumbnail",17),n._UZ(2,"img",23),n.qZA(),n.TgZ(3,"ion-label",24)(4,"h3"),n._uU(5),n.qZA(),n.TgZ(6,"p"),n._uU(7),n.ALo(8,"date"),n.qZA()()()),2&a){const t=n.oxw().$implicit;n.xp6(5),n.lnq("Id:",null==t?null:t.Id," CAPS: ",null==t?null:t.CAPS," Nom: ",null==t?null:t.Nombre,""),n.xp6(2),n.AsE("",null==t?null:t.Descripcion," - Fecha Fin: ",n.xi3(8,5,null==t?null:t.FechaFin,"dd/MM/yy"),"")}}function J(a,c){if(1&a){const t=n.EpF();n.TgZ(0,"div",20),n.NdJ("click",function(){const i=n.CHM(t).$implicit,u=n.oxw();return n.KtG(u.enviarCampanias(null==i?null:i.Id))}),n.YNc(1,A,9,8,"ion-item",21),n.qZA()}if(2&a){const t=n.oxw();n.xp6(1),n.Q6J("ngIf",(null==t.campaniasJson?null:t.campaniasJson.campanias.length)>0)}}function T(a,c){1&a&&(n.TgZ(0,"div")(1,"h2",25),n._uU(2,"No hay campa\xf1as disponibles... "),n.qZA()())}const F=[{path:"",component:(()=>{class a{constructor(t,e,o,i,u,f,v){var m=this;this.baselocalService=t,this.toastController=e,this.router=o,this.authService=i,this.alertController=u,this.apiVisitArService=f,this.loadingController=v,this.campaniasJson={campanias:""},b.Z.addListener("networkStatusChange",function(){var p=(0,l.Z)(function*(h){m.verificoConectividad(h.connected)});return function(h){return p.apply(this,arguments)}}())}ngOnInit(){}ionViewWillEnter(){var t=this;return(0,l.Z)(function*(){window.addEventListener("beforeinstallprompt",e=>{console.log("beforeinstallprompt Event fired"),e.preventDefault(),t.deferredPrompt=e})})()}ionViewDidEnter(){var t=this;return(0,l.Z)(function*(){b.Z.getStatus().then(function(){var e=(0,l.Z)(function*(o){t.verificoConectividad(o.connected)});return function(o){return e.apply(this,arguments)}}())})()}showInstallBanner(){null!=this.deferredPrompt&&(this.deferredPrompt.prompt(),this.deferredPrompt.userChoice.then(t=>{"accepted"===t.outcome?console.log("User accepted the A2HS prompt"):console.log("User dismissed the A2HS prompt"),this.deferredPrompt=null}))}verificoConectividad(t){var e=this;return(0,l.Z)(function*(){t?(console.log("Conectado Internet Get"),setTimeout(()=>{e.getCampanias()},1500)):(console.log("Sin Internet Get"),e.baselocalService.getArrayCampanias().then(i=>{e.campaniasJson.campanias=i},i=>{console.log(i)}),yield(yield e.toastController.create({message:"Sin conectividad",duration:4e3,cssClass:"custom-toast",buttons:[{text:"cerrar",role:"cancel"}]})).present())})()}getCampanias(){var t=this;return(0,l.Z)(function*(){console.log("Obtengo Campa\xf1as");const e=yield t.loadingController.create({message:"Aguarde pidiendo json..."});e.present(),t.apiVisitArService.getCampanias().subscribe(o=>{e.dismiss(),t.campaniasJson=o,console.log(t.campaniasJson),setTimeout(()=>{t.campaniasJson.campanias=t.campaniasJson.campanias.sort((i,u)=>u.Id-i.Id),t.getModelosEncuentas()},500),t.baselocalService.setArrayCampanias(t.campaniasJson.campanias)},o=>{e.dismiss(),t.presentAlert("Info","Problema",o.message+" "+JSON.stringify(o.error)),console.log(o)})})()}presentAlert(t,e,o){var i=this;return(0,l.Z)(function*(){yield(yield i.alertController.create({backdropDismiss:!1,cssClass:"alertCustomCss",header:t,subHeader:e,message:o,buttons:["OK"],mode:"ios"})).present()})()}cerrar(){this.authService.logout(),this.router.navigate(["/login"])}enviarCampanias(t){this.router.navigate(["misencuestas",{idCampania:t}])}getModelosEncuentas(){var t=this;return(0,l.Z)(function*(){console.log("Obtengo Modelos");const e=yield t.loadingController.create({message:"Aguarde pidiendo json..."});e.present();var o=t.campaniasJson.campanias.length,i=0;yield t.campaniasJson.campanias.forEach(function(){var u=(0,l.Z)(function*(f,v){t.apiVisitArService.getEncuestaModelo(f.Id).subscribe(function(){var m=(0,l.Z)(function*(p){i++,t.baselocalService.setArrayModelo(p),console.log("Modelo ",i),i==o&&(console.log("Finaliza bajada de modelos"),e.dismiss(),yield(yield t.toastController.create({message:"Descarga Completo",duration:3e3,cssClass:"custom-toast",buttons:[{text:"cerrar",role:"cancel"}]})).present())});return function(p){return m.apply(this,arguments)}}(),function(){var m=(0,l.Z)(function*(p){++i==o&&(console.log("Finaliza bajada de modelos"),e.dismiss(),yield(yield t.toastController.create({message:"Descarga Completo",duration:3e3,cssClass:"custom-toast",buttons:[{text:"cerrar",role:"cancel"}]})).present()),console.log(p)});return function(p){return m.apply(this,arguments)}}())});return function(f,v){return u.apply(this,arguments)}}())})()}}return a.\u0275fac=function(t){return new(t||a)(n.Y36(_.c),n.Y36(s.yF),n.Y36(g.F0),n.Y36(y.e),n.Y36(s.Br),n.Y36(x.p),n.Y36(s.HT))},a.\u0275cmp=n.Xpm({type:a,selectors:[["app-campanias"]],decls:23,vars:5,consts:[[3,"translucent"],["color","primary"],["slot","start",4,"ngIf"],["mode","ios"],["slot","end"],["color","secondary",3,"click"],["slot","icon-only","name","log-out"],[3,"fullscreen"],["collapse","condense"],["size","large"],[2,"max-width","500px","width","100%","margin","auto","text-align","center"],["lines","full","detail",""],["color","secondary",2,"height","40px"],[3,"click",4,"ngFor","ngForOf"],[4,"ngIf"],[1,"footer-button"],["expand","block","shape","round",3,"click"],["slot","start"],["color","success","routerLink","/browse",3,"replaceUrl","click"],["slot","start","name","archive-outline"],[3,"click"],["detail","","button","",4,"ngIf"],["detail","","button",""],["src","assets/imgs/campaign_icon.svg"],["text-wrap",""],["text-center",""]],template:function(t,e){1&t&&(n.TgZ(0,"ion-header",0)(1,"ion-toolbar",1),n.YNc(2,P,4,1,"ion-buttons",2),n.TgZ(3,"ion-title",3),n._uU(4," VisitAR "),n.qZA(),n.TgZ(5,"ion-buttons",4)(6,"ion-button",5),n.NdJ("click",function(){return e.cerrar()}),n._UZ(7,"ion-icon",6),n.qZA()()()(),n.TgZ(8,"ion-content",7)(9,"ion-header",8)(10,"ion-toolbar")(11,"ion-title",9),n._uU(12,"VisitAR"),n.qZA()()(),n.TgZ(13,"div",10)(14,"ion-list",11)(15,"ion-item-divider",12)(16,"h3"),n._uU(17,"Campa\xf1as"),n.qZA()(),n.YNc(18,J,2,1,"div",13),n.YNc(19,T,3,0,"div",14),n.qZA(),n.TgZ(20,"div",15)(21,"ion-button",16),n.NdJ("click",function(){return e.getCampanias()}),n._uU(22," Bajar Campa\xf1as "),n.qZA()()()()),2&t&&(n.Q6J("translucent",!0),n.xp6(2),n.Q6J("ngIf",e.deferredPrompt),n.xp6(6),n.Q6J("fullscreen",!0),n.xp6(10),n.Q6J("ngForOf",null==e.campaniasJson?null:e.campaniasJson.campanias),n.xp6(1),n.Q6J("ngIf",(null==e.campaniasJson?null:e.campaniasJson.campanias.length)<=0))},dependencies:[d.sg,d.O5,s.YG,s.Sm,s.W2,s.Gu,s.gu,s.Ie,s.rH,s.Q$,s.q_,s.Bs,s.wd,s.sr,s.YI,g.rH,d.uU],styles:["ion-button[_ngcontent-%COMP%]{--background: linear-gradient(135deg, var(--ion-color-success) 0%, var(--ion-color-tertiary) 100%)!important;--padding-top: 25px!important;--padding-bottom: 25px!important;margin-bottom:12px!important;--color: #fff!important;font-weight:700;font-size:1.1em;text-transform:inherit!important;--box-shadow: none!important}.deshabilitado[_ngcontent-%COMP%]{--background: linear-gradient(135deg, #D9DCDF 0%, #F6F7FB 100%)!important}"]}),a})()}];let I=(()=>{class a{}return a.\u0275fac=function(t){return new(t||a)},a.\u0275mod=n.oAB({type:a}),a.\u0275inj=n.cJS({imports:[g.Bz.forChild(F),g.Bz]}),a})(),S=(()=>{class a{}return a.\u0275fac=function(t){return new(t||a)},a.\u0275mod=n.oAB({type:a}),a.\u0275inj=n.cJS({imports:[d.ez,Z.u5,s.Pc,I]}),a})()}}]);