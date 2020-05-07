import { Component, OnInit,ViewChild } from '@angular/core';
import  {SERVICES } from '../../config/webservices';
import  {MESSAGES } from '../../config/messages';
import { ServicesProvider } from '../../providers/services';
//import * as M from "materialize-css/dist/js/materialize";
//import * as d3 from 'd3';
import ScrollBooster from 'scrollbooster'
//import { ActivatedRoute } from '@angular/router';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public slides = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];
  hola:any="nada";
  oSlideManual:any={
    index:1,
    translateX:0
  };
  /*aClasses:any=
  [
    {
    "image":"",
    "texto": "hola"
    }
  ]
 

  }*/
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false
  };
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    scrollbar: false,
    navigation: true,
    pagination: true,
    speed:1000,
    simulateTouch:true,
    mousewheel:false,
    autoplay:true
  };
  /*private scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };*/



  @ViewChild('swiperWrapper') public swiperWrapper: any;
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  constructor(

      public ServicesProvider:ServicesProvider/*,
      private route: ActivatedRoute*/

    ) { }

  





  ngOnInit() {
    this.fn_stickyHeader();
    this.fn_carruselManual(this.oSlideManual.index);
    
  }

  fn_goTToSection(section:any){
    
      var elmnt: any = document.getElementById(section);
      elmnt.scrollIntoView({ block: 'start', behavior: 'smooth' });
    
  }
   
  fn_stickyHeader(){
    window.onscroll = function() {myFunction()};
    var header = document.getElementById("header");
    console.log(header);
    var sticky = header.offsetTop;
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        //document.getElementById("logo").setAttribute("src","./assets/img/logo.png")
      } else {
        header.classList.remove("sticky");
        //document.getElementById("logo").setAttribute("src","./assets/img/logo2.png")

      }
    }
  }


  fn_carruselManual(index:any){
    console.log("entra");
    setTimeout(()=>{

          //3 slides
          if(this.oSlideManual.index==5){
            this.oSlideManual.index=1;
            this.oSlideManual.translateX=0;

            (document.querySelector("#slide4")  as HTMLElement).style.transform = "translate(100%,0%)";
            (document.querySelector("#slide3")  as HTMLElement).style.transform = "translate(100%,0%)";            
            (document.querySelector("#slide2")  as HTMLElement).style.transform = "translate(100%,0%)";
            (document.querySelector("#slide1")  as HTMLElement).style.transform = "translate(100%,0%)";
            (document.querySelector("#slide0")  as HTMLElement).style.transform = "translate(0%,0%)";

            (document.querySelector("#slide4 .carrusel_texto")  as HTMLElement).style.transform = "translate(0%,-50%)";
            (document.querySelector("#slide4 .carrusel_texto")  as HTMLElement).style.display = "none";


            (document.querySelector("#slide3 .carrusel_texto")  as HTMLElement).style.transform = "translate(0%,-50%)";
            (document.querySelector("#slide3 .carrusel_texto")  as HTMLElement).style.display = "none";


            (document.querySelector("#slide2 .carrusel_texto")  as HTMLElement).style.transform = "translate(0%,-50%)";
            (document.querySelector("#slide2 .carrusel_texto")  as HTMLElement).style.display = "none";

            (document.querySelector("#slide1 .carrusel_texto")  as HTMLElement).style.transform = "translate(0%,-50%)";
            (document.querySelector("#slide1 .carrusel_texto")  as HTMLElement).style.display = "none";

            (document.querySelector("#slide0 .carrusel_texto")  as HTMLElement).style.transform = "translate(0%,-50%)";

            this.fn_carruselManual( this.oSlideManual.index);


          }
          else{
            //poner logo blanco para los img backgruond que apliquen
            /*if(this.oSlideManual.index==3){
              setTimeout(()=>{
                document.getElementById("logo").setAttribute("src","./assets/img/logo2.png")

              },1000)
            }
            else{
              setTimeout(()=>{
                document.getElementById("logo").setAttribute("src","./assets/img/logo.png")

              },1000)
            }*/
            (document.querySelector("#slide1 .carrusel_texto")  as HTMLElement).style.display = "block";
            (document.querySelector("#slide2 .carrusel_texto")  as HTMLElement).style.display = "block";
            (document.querySelector("#slide3 .carrusel_texto")  as HTMLElement).style.display = "block";
            (document.querySelector("#slide4 .carrusel_texto")  as HTMLElement).style.display = "block";

            (document.querySelector("#slide"+this.oSlideManual.index)  as HTMLElement).style.transform = "translate(0%,0%)";
            let index=this.oSlideManual.index-1;
            (document.querySelector("#slide"+index+" .carrusel_texto")  as HTMLElement).style.transform = "translate(-100%,-50%)";
  
              this.oSlideManual.translateX=this.oSlideManual.translateX-100;
            
            this.oSlideManual.index=this.oSlideManual.index+1;
  
              //(document.querySelector("#slide"+index)  as HTMLElement).style.transform = "translate("+this.oSlideManual.translateX+"%,0%)";
            this.fn_carruselManual( this.oSlideManual.index);
  
          }

    },6000);
  }

 
  public onIndexChange(index: number): void {
    console.log('Swiper index: ', index);
    
    
    

  }
  public onSwiperEvent(event: string): void {
    console.log('Swiper event: ', event);
    console.log('Swiper event: ', event);
    if(event=="transitionStart"){
    }
    else{
    }
  }

 
}