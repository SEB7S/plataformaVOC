import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'fechaespanol'
})
  //retorna fecha en español introducir dd/mm/yyyy | yyyy/mm/dd hh:mm:ss
  //this.ServicesProvider.remainingDate("2019/05/20 20:00:00") yyyy-mm-dd
  //retorna  Miércoles 29 de Mayo de 2019, 20:00
export class fechaespanol implements PipeTransform {

    transform(value: string): Object {
      var hora:any;
      let fecha_formato_T=value.split("T");
      if(fecha_formato_T.length>1){
        let hora_t=fecha_formato_T[1].split(".");
        let fecha=fecha_formato_T[0].split("-");
        value=fecha[2]+"/"+fecha[1]+"/"+fecha[0]+ " "+hora_t[0];
      }
      hora=value.split(" ");
      if(hora.length>1){
        var  fecha_entrante:any=hora[0].split("/");
        if(fecha_entrante[2].length>2){
          fecha_entrante = fecha_entrante[0]+"/"+fecha_entrante[1]+"/"+fecha_entrante[2];
        }
        else{
          fecha_entrante = fecha_entrante[2]+"/"+fecha_entrante[1]+"/"+fecha_entrante[0];
    
        }

        hora=hora[1].split(":");
        hora=hora[0]+":"+hora[1];

      }
      else{
        var  fecha_entrante:any=hora[0].split("/");
        if(fecha_entrante[2].length>2){
          fecha_entrante = fecha_entrante[0]+"/"+fecha_entrante[1]+"/"+fecha_entrante[2];
        }
        else{
          fecha_entrante = fecha_entrante[2]+"/"+fecha_entrante[1]+"/"+fecha_entrante[0];
    
        }

        hora="";
      }
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
        "mar":"Marzo",
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
      //      return  (oDias[fecha[0].toLowerCase()]+" "+ fecha[2]+" de "+ oMes[fecha[1].toLowerCase()]+" de "+ fecha[3]) + ", "+ (hora);

      return  (oDias[fecha[0].toLowerCase()]+" "+ fecha[2]+" de "+ oMes[fecha[1].toLowerCase()]) + " ("+ (hora)+")";
  
    }

  

  


 
}