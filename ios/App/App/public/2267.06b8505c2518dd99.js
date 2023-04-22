"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2267],{3726:(A,h,t)=>{t.d(h,{n:()=>i});class i{constructor(g,d,c,f,u,r,p=!1,S,O="User"){this.uid=S,this.email=g,this.nombre=d,this.apellido=c,this.edad=f,this.dni=u,this.imagenes=r,this.isAdmin=p,this.typename=O}static filterPrivate(g){return Object.fromEntries(Object.entries(g).filter(([d])=>!["uid"].includes(d)))}}},2267:(A,h,t)=>{t.r(h),t.d(h,{HomePage:()=>d});var i=t(2879),n=t(4650),g=t(3651);let d=(()=>{class c{constructor(u){this._auth=u}handleSingOut(){this._auth.SignOut()}}return c.\u0275fac=function(u){return new(u||c)(n.Y36(g.e))},c.\u0275cmp=n.Xpm({type:c,selectors:[["app-home"]],standalone:!0,features:[n.jDz],decls:13,vars:1,consts:[[3,"translucent"],["color","primary"],["slot","end"],[3,"click"],[1,"ion-padding"],[1,"welcome-message"]],template:function(u,r){1&u&&(n.TgZ(0,"ion-header",0)(1,"ion-toolbar",1)(2,"ion-title"),n._uU(3," Home "),n.qZA(),n.TgZ(4,"ion-buttons",2)(5,"ion-button",3),n.NdJ("click",function(){return r.handleSingOut()}),n._uU(6,"Sign Out"),n.qZA()()()(),n.TgZ(7,"ion-content",4)(8,"div",5)(9,"h1"),n._uU(10,"Welcome to my app!"),n.qZA(),n.TgZ(11,"p"),n._uU(12,"Thanks for using our service."),n.qZA()()()),2&u&&n.Q6J("translucent",!0)},dependencies:[i.Pc,i.YG,i.Sm,i.W2,i.Gu,i.wd,i.sr],styles:["#container[_ngcontent-%COMP%]{text-align:center;position:absolute;left:0;right:0;top:50%;transform:translateY(-50%)}#container[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:20px;line-height:26px}#container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;line-height:22px;color:#8c8c8c;margin:0}#container[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-decoration:none}.welcome-message[_ngcontent-%COMP%]{text-align:center;margin-top:100px}.welcome-message[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:36px;margin-bottom:20px}.welcome-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:20px;color:#666}"]}),c})()},3651:(A,h,t)=>{t.d(h,{e:()=>y});var i=t(5861),n=t(3726),g=t(8277),r=(t(2090),t(9681),t(1877),t(4859),t(4650)),p=t(3101),S=t(1205),O=t(6159);let y=(()=>{class m{constructor(e,o,s,a,l){this.afs=e,this.afAuth=o,this.router=s,this.ngZone=a,this._db=l,this.afAuth.authState.subscribe(v=>{var P;v?(this.userData=v,localStorage.setItem("auth",JSON.stringify(this.userData)),this.sub=this._db.collection("users").doc(v.uid).get().subscribe(U=>{localStorage.setItem("user",JSON.stringify(U.data())),console.log("sign in")})):(null===(P=this.sub)||void 0===P||P.unsubscribe(),localStorage.setItem("auth","null"),localStorage.setItem("user","null"),console.log("sign out"))})}get isLoggedIn(){return null!==JSON.parse(localStorage.getItem("auth"))}get isVerified(){const e=JSON.parse(localStorage.getItem("auth"));return null!==e&&e.emailVerified}get isAdmin(){const e=JSON.parse(localStorage.getItem("user"));return null!==e&&e.isAdmin}SignIn(e,o){return this.afAuth.signInWithEmailAndPassword(e,o)}SignUp(e,o){var s=this;return(0,i.Z)(function*(){try{let a=yield s.afAuth.createUserWithEmailAndPassword(e.email,o);return s.SendVerificationMail(),yield a.user.updateProfile({displayName:e.nombre,photoURL:e.imagenes[0]}),s.SetUserData(a.user.uid,e),s.router.navigate(["home"]),new Promise((l,v)=>{l("success")})}catch(a){return new Promise((l,v)=>{l(JSON.parse(JSON.stringify(a)))})}})()}GoogleAuth(){return this.AuthLogin(new g.V)}AuthLogin(e){return this.afAuth.signInWithPopup(e).then(o=>{var s,a;let l=o.user;this.SetUserData(l.uid,new n.n(l.email,null!==(s=l.displayName)&&void 0!==s?s:"","",0,"",[null!==(a=l.photoURL)&&void 0!==a?a:""])),console.log(o.user)}).catch(o=>{window.alert("An error occured when attemping sign in")})}SetUserData(e,o){const s=this.afs.doc(`users/${e}`);return o.uid=e,console.log("user updated in db"),s.set(JSON.parse(JSON.stringify(o)),{merge:!0})}SignOut(){return this.afAuth.signOut().then(()=>{localStorage.removeItem("user"),localStorage.removeItem("auth"),this.router.navigate(["login"])})}SendVerificationMail(){return this.afAuth.currentUser.then(e=>e.sendEmailVerification()).then(()=>{console.log("correo de verificacion enviado")})}ForgotPassword(e){return this.afAuth.sendPasswordResetEmail(e).then(()=>{window.alert("Password reset email sent, check your inbox.")}).catch(o=>{window.alert(o)})}}return m.\u0275fac=function(e){return new(e||m)(r.LFG(p.ST),r.LFG(S.zQ),r.LFG(O.F0),r.LFG(r.R0b),r.LFG(p.ST))},m.\u0275prov=r.Yz7({token:m,factory:m.\u0275fac,providedIn:"root"}),m})()}}]);