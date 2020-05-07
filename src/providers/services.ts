import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { URL,SERVICES } from '../config/webservices';
import { VARIABLES } from '../config/variables';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from "../pages/modal/modal.component";
import {  Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
//uso
//import { ServicesProvider } from '../../providers/services';

@Injectable()
export class ServicesProvider {
  protected url = URL;
  bSuperPreload:boolean=false;
  numNotificaciones:any;
  
  aStopwords=["de","a","la","los","las","en","y", "-", ".",""];

  constructor(
    private http: Http,
    private datePipe: DatePipe,
    private router : Router,
    private modalService: NgbModal
  ) {

  }

  open() {
    // const modalRef = this.modalService.open(ModalComponent);
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'About';
}


  //tener en el component
  //import { IMyOptions } from 'ng-uikit-pro-standard';
  //public myDatePickerOptions: IMyOptions;
  //<mdb-date-picker name="mydate" [options]="myDatePickerOptions" [placeholder]="'Selected date'" [(ngModel)]="model"
    //required></mdb-date-picker>
  //this.myDatePickerOptions=this.getDatepickerOpt("posterior");
  //fin_fecha:  'posterior' => valida que no se puedan seleccionar fechas posteriores
  //fin_fecha:  null => no valida que no se puedan seleccionar fechas posteriores
  getDatepickerOpt(fin_fecha:any){

    if(fin_fecha=="posterior"){
      var fechaManana:any = new Date().setDate( new Date().getDate() + 1 );
      fechaManana=this.datePipe.transform(fechaManana, 'yyyy/MM/dd');
      fechaManana=fechaManana.split("/");
      VARIABLES.datepicker["maxYear"]=fechaManana[0];
      //VARIABLES.datepicker["disableSince"]= {year: fechaManana[0], month: fechaManana[1], day: fechaManana[2]};
    }
    else if("anterior"){
      var fechaAyer:any = new Date().setDate( new Date().getDate() - 1 );
      fechaAyer=this.datePipe.transform(fechaAyer, 'yyyy/MM/dd');
      fechaAyer=fechaAyer.split("/");
      VARIABLES.datepicker["disableUntil"]= {year: fechaAyer[0], month: fechaAyer[1], day: fechaAyer[2]};

    }
    return VARIABLES.datepicker;
  }

  fn_sesion(){
    if(!localStorage.getItem("nombre")){
       return this.router.navigate(["/"]);
    }
  }

  fn_cerrarSesion(){
    localStorage.clear();
  }
  //cuenta cuantos dias restan pasada una fecha y la cantidad de dias
  /*getDaysRemaining(dias:any,fecha:any){
    let fechaRecibida:any=new Date(fecha);

    let hoy:any = new Date();
    let fecha_mas_dias:any=fechaRecibida.setDate(fechaRecibida.getDate() + parseInt(dias)+1);
    fecha_mas_dias=new Date(this.datePipe.transform(fecha_mas_dias, 'yyyy/MM/dd')) ;
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    let utc1 = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    let utc2 = Date.UTC(fecha_mas_dias.getFullYear(), fecha_mas_dias.getMonth(), fecha_mas_dias.getDate());
    return (Math.floor((utc2 - utc1) / _MS_PER_DAY));
  }*/

  //quita puntos ?,; etc de una cadena
  fn_quitarPuntuacion(str:any){
    return str.replace(/(~|`|!|\¿|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"");
  }
  
  fn_quitarAcentos(s:any){

    
    if(!isNaN(s)){
      return s;
    }
    s=this.fn_quitarPuntuacion(s);
    var r=s.toLowerCase();
    r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    //s.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    return r;
  }

  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  fn_generarAlerta(tipo:any,mensaje:any){
    /*const options = { toastClass: 'opacity' };
    if(tipo.toLowerCase()=="exito" || tipo.toLowerCase()=="éxito"){
        this.toastService.success(mensaje,'Éxito', options);
    }
    else if(tipo.toLowerCase()=="error" ){
      this.toastService.error(mensaje,'Error', options);
    }
    else{
      this.toastService.warning(mensaje,'Advertencia', options);

    }
    
*/
  }
 

  //pasa un string al estilo 'a.b.c' a un json al ejemplo  json={a:{b :c}}
  //a.b.c   ,  {algo:["a"]}
  fn_stringtoNotationJson(source:any,item:any){
    console.log(source, " -- > ",item);
    if(!source){
      return item;
    }
    let json=source.split('.').reduce((o,i)=>o[i], item);
    return json.toLowerCase();
  }

  fn_filtrarInput(key,campo_texto,input_observable) {
    campo_texto= key;
    input_observable.next({ filterKey: campo_texto });
  }

  //  this.inputs$,  el array antes de iterar ej 'this.oFormNormatividad.controls["otros_anexos"].controls', y cuando se itere el string del objeto que se va a comparar'value.anexo.nombre_anexo' 
  getFilteredDataInput(inputs: Observable<any>,array_a_filtrar:any, condicion_retornar:any) {
    return inputs.pipe(
      debounceTime(750),
      distinctUntilChanged(
        (p, q) => {

        console.log(p,q);
        return p.filterKey === q.filterKey
        }
      ),
      switchMap(input => {
        let key = input.filterKey.trim();

        // Filter the data.
        
        let result = array_a_filtrar.filter((item) =>{
          //return item.value.anexo.nombre_anexo.toLowerCase().includes(key.toLowerCase())
        return this.fn_quitarAcentos(this.fn_stringtoNotationJson(condicion_retornar,item)).includes(this.fn_quitarAcentos(key.toLowerCase()))
        });
        return of(result);
      })
    );
  }
  
  fn_fechaEspanol(fecha_entrante:any){
    //debe estar en formato yyyy/mm/dd
    fecha_entrante=fecha_entrante.split("/");
    let fecha:any= new Date(fecha_entrante[2]+"/"+fecha_entrante[1]+"/"+fecha_entrante[0]);
    fecha=fecha+"";
    fecha=fecha.split(" ");

    let oDias:any={
      "tue":"Martes",
      "wed":"Miércoles",
      "thu":"Jueves",
      "fri":"Viernes",
      "sat":"Sabado",
      "mon": "Lunes",
      "sun":"Domingo"
    }
    
    let oMes:any={
      "jan":"Enero",
      "feb":"Febrero",
      "mar":"March",
      "apr":"Abril",
      "may":"Mayo",
      "jun":"Junio",
      "jul":"Julio",
      "aug":"Agosto",
      "sep":"Septiembre",
      "oct":"Octubre",
      "nov":"Noviembre",
      "dec":"Diciembre"
    }

    return  oDias[fecha[0].toLowerCase()]+" "+ fecha[2]+" "+ oMes[fecha[1].toLowerCase()]+", "+ fecha[3]

  }
  //dd/mm/yyyy
  checkDateBetween(fecha_inicio:any,fecha_fin:any,fecha_comparar:any){
    var dateFrom,dateTo,dateCheck:any;

    if(fecha_comparar.split(" ").length>1){
      fecha_comparar=fecha_comparar.split(" ")[0];
    }

     /* Normalizacion a dd/mm/yyyy pues se recibe como yyyyy*/
    fecha_inicio=fecha_inicio.split(":");
    let tempDate2=fecha_inicio[0].split("/");
    if(tempDate2[2].length>2){
      fecha_inicio = tempDate2[2]+"/"+tempDate2[1]+"/"+tempDate2[0];
    }
    else{
      fecha_inicio = tempDate2[0]+"/"+tempDate2[1]+"/"+tempDate2[2];
    }


    fecha_fin=fecha_fin.split(":");
    tempDate2=fecha_fin[0].split("/");
    if(tempDate2[2].length>2){
      fecha_fin = tempDate2[2]+"/"+tempDate2[1]+"/"+tempDate2[0];
    }
    else{
      fecha_fin = tempDate2[0]+"/"+tempDate2[1]+"/"+tempDate2[2];
    }

    fecha_comparar=fecha_comparar.split(":");
    tempDate2=fecha_comparar[0].split("/");
    if(tempDate2[2].length>2){
      fecha_comparar = tempDate2[2]+"/"+tempDate2[1]+"/"+tempDate2[0];
    }
    else{
      fecha_comparar = tempDate2[0]+"/"+tempDate2[1]+"/"+tempDate2[2];
    }



    dateFrom = fecha_inicio;
    dateTo = fecha_fin;
    dateCheck = fecha_comparar;
    var d1:any = dateFrom.split("/");
    var d2:any = dateTo.split("/");
    var c:any = dateCheck.split("/");

    var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
    var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
    var check = new Date(c[2], parseInt(c[1])-1, c[0]);

    return (check >= from && check <= to)
  }


  // retorna desde donde empieza la semana,termina y fecha actual en dd/mm/yyyy
  getCurrentDates(){
    var oFecha:any={};
    let today:any = new Date();
    let dd:any = today.getDate();
    let mm:any = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    //today = dd + '/' + mm + '/' + yyyy;
    today = yyyy+ "/"+mm + '/' +dd ;

    oFecha["hoy"]=today;
    //inicio de semana
    let d:any=new Date(new Date());
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday


    today= new Date(d.setDate(diff));
    dd = today.getDate();
    mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    today = dd + '/' + mm + '/' + yyyy;
    oFecha["inicio_semana"]=today;


    var td = new Date(); 
    var nextSunday= new Date(td.getFullYear(),td.getMonth(),td.getDate()+(7-td.getDay()))

    today= new Date(nextSunday);
    dd = today.getDate();
    mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    today = dd + '/' + mm + '/' + yyyy;

    oFecha["fin_semana"]=today;
    return oFecha;
  }

  getCurrentYear(){
    let aAnios=[];
    let aAnioActual;
    for(let i=2017; i<=new Date().getFullYear(); i ++){
      aAnios.push(i);
    }

    aAnioActual=(new Date()).getFullYear();
    return { "aAnios":aAnios, "iAnioActual":aAnioActual};
  }

  getCurrentYear_mas1(){
    let aAnios=[(new Date()).getFullYear(),(new Date()).getFullYear()+1];    
    return aAnios;
  }

  //yyyy-mm-dd
  //si se quiere restar dias entre 2 fechsa incluir el primer argumento, asi como esta solo resta desde el dia actual a una fecha
  countDays(date2:any)
  {

      let _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // por defecto se resta desde el dia actual
      let hoy:any = new Date();
      date2 = new Date(date2);
      let utc1 = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      return (Math.floor((utc2 - utc1) / _MS_PER_DAY));
  }

  generarPopupGenerico(titulo:string, cuerpo:string,funcion?:any,scope?:any,param?:any){
    /*this.modalRef =  this.modalService.show(ModalgenericoComponent);
    this.modalRef.content.title = titulo;
    this.modalRef.content.body = cuerpo;
    this.modalRef.content.component=scope;
    this.modalRef.content.funcion=funcion;
    this.modalRef.content.param=param;

    if(titulo.toLowerCase()=="exito" || titulo.toLowerCase()=="éxito"){
      this.modalRef.content.estilo="success";
    }
    else if(titulo.toLowerCase()=="error" ){
      this.modalRef.content.estilo="danger";
    }
    else{
      this.modalRef.content.estilo="warning";
    }*/
  }

  /*
    esta funcion genera un popup dinámico y además permite llamar funciones
    genera un popup genérico.
    titulo: titulo del modal, de ahi se depende el color ej: 'Éxito', 'error', 'info'
    cuerpo: cuerpo del modal

    estos parametros son para llamar una funcion contenida en el mismo componente

    funcion: nombre de la funcion en string
        scope: enviar  this

    param: parametros en cadena
    this.generarPopupGenerico("Advertencia", "¿Desea eliminar este avance del entregable","fn_deleteDetalleEntregable",this,id);
  }
  */
  /*generarPopupGenerico(titulo:string, cuerpo:string,funcion?:any,scope?:any,param?:any){
    this.modalRef =  this.modalService.show(ModalgenericoComponent);
    this.modalRef.content.title = titulo;
    this.modalRef.content.body = cuerpo;
    this.modalRef.content.component=scope;
    this.modalRef.content.funcion=funcion;
    this.modalRef.content.param=param;

    if(titulo.toLowerCase()=="exito" || titulo.toLowerCase()=="éxito"){
      this.modalRef.content.estilo="success";
    }
    else if(titulo.toLowerCase()=="error" ){
      this.modalRef.content.estilo="danger";
    }
    else{
      this.modalRef.content.estilo="warning";
    }
  }*/

  //retorna el icono de la extension
  fn_getIconMedia(extension:any){
    extension=extension.toLowerCase();
    extension=extension.split(".");
    extension=extension[extension.length-1];
    if(extension=="jpg" || extension=="jpeg" || extension=="png" || extension=="gif" || extension=="bmp" || extension=="tif"){
       return  "fas fa-image";
    }
    else if(extension=="pdf"){
      return "far fa-file-pdf";
    }
    else if(extension=="doc" || extension=="docx"){
      return "far fa-file-word";
    }
    else if(extension=="ppt" || extension=="pptx"){
      return "fa-file-powerpoint-o";
    }
    else if(extension=="xls" || extension=="xlxs"){
      return "fa-file-powerpoint";
    }
    else{
      return "far fa-file";
    }
  }

  //bSuperPreload si es true el preloadOff también debe ser true, con esto se garantiza que ningun preloader sin el parametro true lo pueda cerrar
  preloaderOn(bSuperPreload?:boolean){
    if(bSuperPreload){
      this.bSuperPreload=bSuperPreload;
    }
    if(document.querySelector('#preloader')){
      document.querySelector('#preloader')!.classList.remove("hide_preloader");
      document.querySelector('#preloader')!.classList.add("show_preloader");
    }
    else{
      var d1 = document.querySelector('body');
      //d1!.insertAdjacentHTML('beforeend', '<div  id="preloader"><div class="showbox"><div class="loader1"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg><div class="cargando">Cargando...</div></div></div><div class="preloader view" style="height:100vh; width:100vw; position:fixed; top:0; left:0; z-index:9999 !important; opacity:0.5; background:black;"><div class="flex-center"></div></div></div>');
      d1!.insertAdjacentHTML('beforeend', '<div  id="preloader" class="position-fixed" style="top:0px; z-index:99999999999999999999999;"><div class="position-fixed backdrop_preload w-100 h-100vh flex-center"><div  class="avatar sombra  animated infinite pulse"><img class="logo_circulo" src="./assets/img/datalab.png"></div><div class="text-white texto_cargando">Cargando...</div></div></div>')  


    }
  }
  preloaderOff(bSuperPreload?:boolean){
    if(bSuperPreload){
      this.bSuperPreload=false;
    }
    if(!this.bSuperPreload){
      if(document.querySelector('#preloader')){
        document.querySelector('#preloader')!.classList.remove("show_preloader");
        document.querySelector('#preloader')!.classList.add("hide_preloader");      
      }
    }
  }
  //define color en escala de 1 a 100
  estadoSemaforo(valor:any){
    if(valor>=99){
      return "background_verde";
    }
    else if(valor>=20 && valor<= 44){
      return "background_rojo_amarillo";
    }

    else if(valor>=45 && valor<= 70){
      return "background_amarillo";
    }
    else if(valor>=71 && valor<99){
      return "background_amarillo_verdoso";
    }

    else{
      return "background_rojo";
    }     
  }
  //define color en escala de 1 a 100
    getColorestadoSemaforo(valor:any){
    if(valor==100){
      return {"color": "a8e063", "class":"background_verde"};
    }
    else if(valor>20 && valor<=65){
      return  {"color": "ff4800", "class":"background_naranja"};
    }

    else if(valor>=66 && valor<= 99){
      return  {"color": "c79810", "class":"background_amarillo"};
    }
    else{
      return {"color": "ed213a", "class":"background_rojo"};
    }     
  }

  //define color segun diferencia de dias para entregables
  estadoSemaforoDia(dia:any){
    if(dia>=31){
      return "background_verde";
    }
    else if(dia>11 && dia< 30){
      return "background_amarillo";
    }
    else{
      return "background_rojo";
    }     
  }
  //define color segun diferencia de dias para entregables
  estadoSemaforoDiaSolicitudes(dia:any){
    if(dia>=7){
      return "background_verde";
    }
    else if(dia>3 && dia< 6){
      return "background_amarillo";
    }
    else{
      return "background_rojo";
    }     
  }

  alertaOn(titulo_alerta:string, cuerpo_alerta:string){
      if(titulo_alerta.toLowerCase()=='éxito' || titulo_alerta.toLowerCase()=='exito'){
        var clase_titulo="alert-success";
      }
      else if(titulo_alerta.toLowerCase()=='error' ){
        var clase_titulo="alert-danger";
      }
      else{
        var clase_titulo= "alert-warning";
      }

      if(document.querySelector('#alerta')){
        document.querySelector('#alerta')!.classList.remove("ocultar_animacion");
        document.querySelector('#alerta')!.classList.remove("ocultar");
        document.querySelector('#alerta')!.classList.remove("alert-success");
        document.querySelector('#alerta')!.classList.remove("alert-danger");
        document.querySelector('#alerta')!.classList.remove("alert-alert-warning");
        document.querySelector('#alerta')!.classList.add(clase_titulo);
      }
      else{
        var d1 = document.querySelector('body');
        d1!.insertAdjacentHTML('beforeend', '  <div #alert id="alerta" onclick="cerrarAlerta()" style="position:fixed; width:80%; top:0px; right:0px; z-index: 999999999 !important;" class="alert '+clase_titulo +' alert-dismissible fade show animated fadeIn" role="alert"><button type="button" class="close" aria-label="Close" (click)="closeAlert()"><span aria-hidden="true">&times;</span></button><strong id="titulo_alerta">*</strong> <span id="cuerpo_alerta">*</span>.</div>');
      }
      document.getElementById("titulo_alerta")!.innerHTML =titulo_alerta;
      document.getElementById("cuerpo_alerta")!.innerHTML =cuerpo_alerta;
      this.alertaOff();

  }

  alertaOff(){
      setTimeout(()=>{
        document.querySelector('#alerta')!.classList.add("ocultar_animacion");
        setTimeout(()=>{
          document.querySelector('#alerta')!.classList.add("ocultar");
        },3000)
      },2000)
  }


  //this.post(SERVICES.CONSULTAR_INFO, query,true/false)
  //is_file determina si el formulario envia un archivo
  public post(inUrl: string, query?: any,is_file?:boolean,token?: any): Promise<any> {
    return new Promise((resolve, reject) => {
 
      var headers;
      if(!is_file){
        headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization':  token

        });        

      }
      else{
        console.log("aqui")
        headers = new Headers({
        });        
      }

      const options = new RequestOptions({
        headers: headers
      });
      this.http.post(this.url +  inUrl, query, options)
      .subscribe(response => {
        try {
          response = response.json();
          resolve(response);
        } catch (error) {
          console.log('[api-274]', response);
          reject(response);
        }
      }, fail => {
        try {
          fail = fail.json();
        } catch (error) {
          console.log('[api-108]', fail);
        }
        reject(fail);
      });
    });
  }
  //this.get("https://reqres.in/api/users", {"page":2}).then((data) => {

  public get(inUrl: string, params: any): Promise<any> {
    //const formedUrl = this.filterAccents(inUrl.split(' ').join('-'));
    return new Promise((resolve, reject) => {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      const options = new RequestOptions({
        headers: headers,
        params: params
      });
      this.http.get(this.url + inUrl, options)
      .subscribe(response => {
        try {
          response = response.json();
          resolve(response);
        } catch (error) {
          console.log('[api-274]', response);
          reject(response);
        }
      }, fail => {
        try {
          fail = fail.json();
        } catch (error) {
          console.log('[api-162]', fail);
        }
        reject(fail);
      });
    });
  }

  public getjson(inUrl: string, params: any): Promise<any> {
    //const formedUrl = this.filterAccents(inUrl.split(' ').join('-'));
    return new Promise((resolve, reject) => {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      const options = new RequestOptions({
        headers: headers,
        params: params
      });
      this.http.get(inUrl, options)
      .subscribe(response => {
        try {
          response = response.json();
          resolve(response);
        } catch (error) {
          console.log('[api-274]', response);
          reject(response);
        }
      }, fail => {
        try {
          fail = fail.json();
        } catch (error) {
          console.log('[api-162]', fail);
        }
        reject(fail);
      });
    });
  }

  public delete(inUrl: string,params:any): Promise<any> {
    //const formedUrl = this.url +  inUrl;
    return new Promise((resolve, reject) => {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      const options = new RequestOptions({
        headers: headers,
        params: params
      });
      this.http.delete(this.url + inUrl, options)
      .subscribe(response => {
        try {
          response = response.json();
          resolve(response);
        } catch (error) {
          console.log('[api-274]', response);
          reject(response);
        }
      }, fail => {
        try {
          fail = fail.json();
        } catch (error) {
          console.log('[api-227]', fail);
        }
        reject(fail);
      });
    });
  }

  public put(inUrl: string,id:any, query?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      const options = new RequestOptions({
        headers: headers,
        params:id
      });
      this.http.put(this.url + inUrl, query, options)
      .subscribe(response => {
        try {
          response = response.json();
          resolve(response);
        } catch (error) {
          console.log('[api-274]', response);
          reject(response);
        }
      }, fail => {
        try {
          fail = fail.json();
        } catch (error) {
          console.log('[api-284]', fail);
        }
        reject(fail);
      });
    });
  }


 

  

}
