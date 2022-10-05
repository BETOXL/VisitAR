"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8802],{8802:(L,d,a)=>{a.r(d),a.d(d,{LoginPageModule:()=>P});var f=a(6895),r=a(4719),s=a(1558),u=a(2905),p=a(5861),e=a(6353),h=a(1098),v=a(7556);const y=[{path:"",component:(()=>{class n{constructor(o,i,t,g,c,m){this.apiVisitArService=o,this.loadingController=i,this.router=t,this.alertController=g,this.authService=c,this.formBuilder=m,this.userVa={usuario:"",password:""},this.loginForm=m.group({usuario_f:new r.NI("",r.kI.compose([r.kI.minLength(4),r.kI.required])),password_f:new r.NI("",r.kI.compose([r.kI.minLength(4),r.kI.required]))})}ngOnInit(){}login(){var o=this;return(0,p.Z)(function*(){const i=yield o.loadingController.create({message:"Aguarde un momento ingresando..."});yield i.present(),o.apiVisitArService.postLogin(o.userVa).subscribe(t=>{i.dismiss(),console.log(t),t.token?(o.authService.setToken(t.token),setTimeout(()=>{o.router.navigate(["/campanias"])},500)):(o.presentAlert("Info","Problema",t.message),o.userVa.password="")},t=>{console.log(t),o.presentAlert("Info","Problema",t.message+" "+JSON.stringify(t.error)),i.dismiss()})})()}presentAlert(o,i,t){var g=this;return(0,p.Z)(function*(){yield(yield g.alertController.create({backdropDismiss:!1,cssClass:"alertCustomCss",header:o,subHeader:i,message:t,buttons:["OK"],mode:"ios"})).present()})()}}return n.\u0275fac=function(o){return new(o||n)(e.Y36(h.p),e.Y36(s.HT),e.Y36(u.F0),e.Y36(s.Br),e.Y36(v.e),e.Y36(r.qu))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-login"]],decls:17,vars:4,consts:[[1,"ion-no-border"],["mode","md",1,"ion-padding","gradient"],[1,"container"],["color","primary"],[1,"page-title"],[3,"formGroup"],["vali1","ngForm"],["formControlName","usuario_f","color","primary","type","text","placeholder","Ingrese usuario",3,"ngModel","ngModelChange"],["formControlName","password_f","color","primary","type","password","placeholder","Ingrese contrase\xf1a",3,"ngModel","keyup.enter","ngModelChange"],[1,"footer-button"],["expand","block","shape","round",3,"disabled","click"]],template:function(o,i){if(1&o&&(e._UZ(0,"ion-header",0),e.TgZ(1,"ion-content",1)(2,"div",2)(3,"ion-text",3)(4,"h1",4),e._uU(5,"Ingresar a mi cuenta"),e.qZA()(),e.TgZ(6,"p"),e._uU(7,"Escrib\xed tu usuario y contrase\xf1a que asignaste a tu cuenta de VisitAR."),e.qZA(),e.TgZ(8,"form",5,6)(10,"ion-item")(11,"ion-input",7),e.NdJ("ngModelChange",function(g){return i.userVa.usuario=g}),e.qZA()(),e.TgZ(12,"ion-item")(13,"ion-input",8),e.NdJ("keyup.enter",function(){return i.login()})("ngModelChange",function(g){return i.userVa.password=g}),e.qZA()(),e.TgZ(14,"div",9)(15,"ion-button",10),e.NdJ("click",function(){return i.login()}),e._uU(16," Ingresar "),e.qZA()()()()()),2&o){const t=e.MAs(9);e.xp6(8),e.Q6J("formGroup",i.loginForm),e.xp6(3),e.Q6J("ngModel",i.userVa.usuario),e.xp6(2),e.Q6J("ngModel",i.userVa.password),e.xp6(2),e.Q6J("disabled",!t.form.valid)}},dependencies:[r._Y,r.JJ,r.JL,s.YG,s.W2,s.Gu,s.pK,s.Ie,s.yW,s.j9,r.sg,r.u],styles:["ion-button[_ngcontent-%COMP%]{--background: linear-gradient(135deg, var(--ion-color-success) 0%, var(--ion-color-tertiary) 100%)!important;--padding-top: 25px!important;--padding-bottom: 25px!important;margin-bottom:12px!important;--color: #fff!important;font-weight:700;font-size:1.1em;text-transform:inherit!important;--box-shadow: none!important}.deshabilitado[_ngcontent-%COMP%]{--background: linear-gradient(135deg, #D9DCDF 0%, #F6F7FB 100%)!important}"]}),n})()}];let C=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[u.Bz.forChild(y),u.Bz]}),n})(),P=(()=>{class n{}return n.\u0275fac=function(o){return new(o||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[f.ez,r.u5,s.Pc,C,r.UX]}),n})()}}]);