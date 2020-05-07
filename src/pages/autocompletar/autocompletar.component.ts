import { Component, OnInit, ViewChild,Input,Output, EventEmitter, ElementRef } from '@angular/core';
import { ServicesProvider } from '../../providers/services';
import { Subject } from "rxjs";


@Component({
  selector: 'autocompletar',
  templateUrl: './autocompletar.component.html',
  styleUrls: ['./autocompletar.component.scss']
})
/*
	emit   (eEnviarDatosPadre)
  [icon]="'fas fa-map-marker-alt'"  
  [label]="'Seleccione el Municipio'" 
  [arrayFiltrado]="aMunicipios"    //array con datos en estructura json al nivel {"nombre":"yeison"}
  [sFiltroenArray]="'nombre'"    //campo del json que será reflejado en el dropdown y pertenece al json si no es un json enviar '' 
  [bMultipleSeleccion]="true" >  //si se seleccionaran varias opciones o una  true | false
	[direccion]="position" >  //donde se mostrará el popup left | right

*/



export class AutocompletarComponent implements OnInit {
  @Input() arrayFiltrado:any;
  @Input() sFiltroenArray:any;
  @Input() bMultipleSeleccion:any;
  @Input() label:any;
  @Input() icon:any;
  @Input() direction:any;

  @ViewChild('campo_texto') campo_texto: ElementRef;
  oCoorcampoTexto:any={};
  input_entrada:any;


  @Output() eEnviarDatosPadre = new EventEmitter();
  bMarcar:boolean=false;
  

  bShowAutocomplete:boolean=false; //cerrar o mostrar el autocompletar
  inputText$ = new Subject<any>(); //este campo actua como observable para los campos de texto y el autocompletar
  aFiltradoElementos:any=[];
  aCheckboxSeleccion:any=[];
  constructor(

    public ServicesProvider: ServicesProvider
  ) { 

  }

  ngOnInit(){
    setTimeout(()=>{
      const campo_texto= this.campo_texto.nativeElement.getBoundingClientRect();
      if(this.direction=="right"){
        this.oCoorcampoTexto.x=campo_texto.right-180;
        this.oCoorcampoTexto.y=campo_texto.top;
      }
      else{
        this.oCoorcampoTexto.x=campo_texto.left+180;
        this.oCoorcampoTexto.y=campo_texto.top;
    
      }


    })
    this.aFiltradoElementos = this.arrayFiltrado;
    if(this.bMultipleSeleccion){
      this.aFiltradoElementos.forEach(element => {
        element.check=false;
      });
    }


    this.ServicesProvider.getFilteredDataInput(this.inputText$, this.arrayFiltrado, this.sFiltroenArray).subscribe(result => {
      this.aFiltradoElementos = result;
      console.log(result);
    });

  }
  fn_focusText(event){

    let elementosAutocompletar=document.querySelectorAll(".autocompletar"); //al hacer click se cierran los demás elementos de autocompletar
    for (var i = 0; i < elementosAutocompletar.length; ++i) {
      elementosAutocompletar[i].classList.add('d-none');
    }
    
    setTimeout(()=>{
      this.bShowAutocomplete=true;
      event.target.parentNode.querySelectorAll('.autocompletar')[0].classList.remove("d-none");

    })
  }

  //selecciòn de multiples opciones
  //verificando si el checkbox actual esta marcado o no
  fn_addCheck(item:string){
    //console.log(event.currentTarget.checked);
    let index_item=this.aCheckboxSeleccion.indexOf(item);
    console.log(index_item);
    if(index_item==-1){
      this.aCheckboxSeleccion.push(item)
    }
    else{
      this.aCheckboxSeleccion.splice(index_item,1);
    }
    console.log( this.aCheckboxSeleccion); 
    //5
  }

  fn_enviarSeleccionMultiple(){
    this.eEnviarDatosPadre.emit(this.aCheckboxSeleccion);
    this.bShowAutocomplete=false;
  }



  fn_selectElement(item){
    console.log(item);

    if(this.sFiltroenArray){
      //this.input_entrada=this.ServicesProvider.fn_stringtoNotationJson(item,this.sFiltroenArray);
      //TODO funciona a un nivel ejmplo  { "nombre": 'jose'}    sFiltroenArray='nombre' 
      this.input_entrada=item[this.sFiltroenArray];
    }
    else{
      this.input_entrada=item;
    }



    this.bShowAutocomplete=false;

    this.eEnviarDatosPadre.emit(item);
  }

  fn_selectAll(){
    this.aFiltradoElementos.forEach(element => {
      if(this.bMarcar){
        element.check=true;
      }
      else{
        element.check=false;
      }
    });

    if(this.bMarcar){
      this.aCheckboxSeleccion=this.aFiltradoElementos.slice(0);
    }
    else{
      this.aCheckboxSeleccion=[];
    }


  }

}




