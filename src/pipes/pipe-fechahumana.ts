import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'fechahumana'
})
  //retorna año, meses, dia, minutos,segundos
  //this.ServicesProvider.remainingDate("2019/05/20 20:00:00") yyyy-mm-dd

export class fechahumana implements PipeTransform {
    private cache:any = new Map<string, Object>();

    transform(value: string): Object {
        if (!this.cache.has(value)) {
          this.cache.set(value, this.fn_mostrarFechaHumana(value));
        }
        return this.cache.get(value);
    }

  //retorna diferencia al formato dd/mm/yyy| yyy/mm/dd hh:mm:ss
  //retorna mensaje que es el calculo, o  dias, o si es expirado
  fn_mostrarFechaHumana(date2: any): any {


    let fecha_formato_T=date2.split("T");
    if(fecha_formato_T.length>1){
      let hora_t=fecha_formato_T[1].split(".");
      let fecha=fecha_formato_T[0].split("-");
      date2=fecha[2]+"/"+fecha[1]+"/"+fecha[0]+ " "+hora_t[0];
    }
    
    date2=date2.split(" ");

    //recibe yyyy-mm-dd
    let tempDate2=date2[0].split("/");
    if(tempDate2[2].length>2){
      date2 = tempDate2[2]+"/"+tempDate2[1]+"/"+tempDate2[0]+"/"+ " "+date2[1];
    }
    else{
      date2 = tempDate2[0]+"/"+tempDate2[1]+"/"+tempDate2[2]+"/"+" "+date2[1];

    }

    //date2 = date2[0].split("/").reverse().join("/")+" "+date2[1];
    let date1:any = new Date();
    date2 = new Date(date2);
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days:number = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    var mins=(date2.getMinutes()==0?60:date2.getMinutes())-(date1.getMinutes()==0?60:date1.getMinutes());
    let mes:any=(days/30.417);
    mes=parseInt(mes);
    let oRemaining:any={
      "anos":yrs,
      "anos_texto":yrs==1?"Año":"Años",
      "dias":days,
      "dias_texto":days==1?"Día":"Días",
      "mes":mes,
      "mes_texto":mes==1?"Mes":"Meses",
      "minutos":mins,
      "minutos_texto":mins==1?"Min":"Min", 
      "horas":hrs,
      "horas_texto":hrs==1?"Hora":"Horas",      
      "segundos":msec,
      "segundos_texto":msec==1?"Segundo":"Segundos"    
    };
    var message="";
    message+= oRemaining.anos!=0?oRemaining.anos+" "+oRemaining.anos_texto+" ":"";
    if(oRemaining.anos==0){
      message+= oRemaining.mes!=0?oRemaining.mes+" "+oRemaining.mes_texto+" ":"";
      if(oRemaining.mes==0){
        message+= oRemaining.dias!=0?oRemaining.dias+" "+oRemaining.dias_texto+" ":"";
        if(oRemaining.dias==0){
          message+= oRemaining.horas!=0?oRemaining.horas+" "+oRemaining.horas_texto+" ":"";

           //if(oRemaining.horas==0){
            //if(oRemaining.minutos==0){
              message+= oRemaining.minutos!=0?oRemaining.minutos+" "+oRemaining.minutos_texto+" ":"";
  
            //}
          //}
  
        }
      }

    }
    /*if(oRemaining.minutos==0){
      message= "pocos segundos";
      return {"mensaje":message,"tiempo":oRemaining,"expirado":false};
    }*/
    if(message.search("-")!=-1){
      return {"mensaje":"En curso!","tiempo":"","expirado":true};
    }
    return {"mensaje":message,"tiempo":oRemaining,"expirado":false};
    //return "En "+message 
  }

  


 
}