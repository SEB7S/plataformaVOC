import { Component, OnInit, ViewChild } from '@angular/core';
import { SERVICES } from '../../config/webservices';
import { MESSAGES } from '../../config/messages';
import { ServicesProvider } from '../../providers/services';
//import * as M from "materialize-css/dist/js/materialize";
import * as d3 from 'd3';
import * as c3 from 'c3';

import ScrollBooster from 'scrollbooster'
//import { ActivatedRoute } from '@angular/router';
import {
  SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface
} from 'ngx-swiper-wrapper';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
var self:any = this;

//elementos globales del mapa
var g_map;
var filtrosMapa=["positivo","negativo","neutro","sin_valor"];
var tooltip = d3.select("body").append("div")
.attr("class", "tooltip_mapa")
.style("opacity", 0);


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  showCalendar: boolean = false; // permite ocultar o mostrar el calendario
  @ViewChild('dp') public dp: any;
  fecha: any;
  /*oEmocion:any={
    "Alegría":{
      color:"#fbfb1e"
    },
    "Confianza":{
      color:"#2ca02c"
    },    
    "Enfado":{
      color:"#f7240b" 
    },    
    "Incertidumbre":{
      color:"gray"
    },    
    "Sorpresa":{
      color:"#c830d2"
    },    
    "Tristeza":{
      color:"#0c30b1"
    }  
  
  }*/

  oVistaGeneral:any;
  /*oVistaGeneral={
    "oPuntaje":
   [
      {
         "Emocion predominante":"enfado",
         "Nivel Neutral":37.5,
         "Nivel de Negativismo":42.5,
         "Nivel de Positivismo":20.0
      }
   ],
   "aAgentesIndicadores":[
    {
      "estrellas":5,
      "indicador": "Presentación",
      "total":79
    },
    {
      "estrellas":4,
      "indicador": "Manera de hablar",
      "total":79
    },
    {
      "estrellas":3,
      "indicador": "Trato con el cliente",
      "total":79
    },  {
      "estrellas":2,
      "indicador": "Solicitudes",
      "total":79
    }
    ,  {
      "estrellas":1,
      "indicador": "Finalización llamadas",
      "total":79
    }
  
  ],
  "aCategoriasGeneral":
  {
    "categorias":[
      {
        "nombre_categoria":"Facturación",
        "num_incidencias":15,
        "imagen":"positivo",
        "subcategoria":[
          {
            "subcategoria_nombre":"Pago Doble",
            "num_indicencias":1
          },
          {
            "subcategoria_nombre":"Pago Doble2",
            "num_indicencias":1
          }
  
        ]
      },
      {
        "nombre_categoria":"Servicio de Energía",
        "num_incidencias":15,
        "imagen":"positivo",
        "subcategoria":[
          {
            "subcategoria_nombre":"Servicio 1",
            "num_indicencias":1
          },
          {
            "subcategoria_nombre":"Servicio 2",
            "num_indicencias":1
          }
  
        ]
      }
  
    ]
  },
  "aPie":[
    {label: "Incertidumbre", count: 34},
    {label: "Tristeza", count: 83},
    {label: "Alegría", count: 324},
    {label: "Enfado", count: 56},
    {label: "Confianza", count: 46},
    {label: "Sorpresa", count: 300}
  ],
  "sentiment_map":{
    "QUINCHIA": { "sentimiento":"positivo"},
    "BALBOA": { "sentimiento":"positivo"},
    "BELEN DE UMBRIA": { "sentimiento":"positivo"},
    "MISTRATO": { "sentimiento":"positivo"},
    "MANIZALES":{ "sentimiento":"positivo"},
    "DOSQUEBRADAS":  { "sentimiento":"negativo"},
    "LA VIRGINIA": { "sentimiento":"positivo"},
    "CHINCHINA": { "sentimiento":"positivo"},
    "PALESTINA":{ "sentimiento":"sin_valor"},
    "VILLAMARIA": { "sentimiento":"negativo"},
    "SANTA ROSA": { "sentimiento":"positivo"},
    "RISARALDA":{ "sentimiento":"positivo"},
    "ANSERMA": { "sentimiento":"positivo"},
    "VITERBO":  { "sentimiento":"positivo"},
    "NEIRA": { "sentimiento":"positivo"},
    "MARMATO": { "sentimiento":"negativo"},
    "PACORA": { "sentimiento":"positivo"},
    "SUPIA": { "sentimiento":"positivo"},
    "VICTORIA":{ "sentimiento":"negativo"},
    "NORCASIA":  { "sentimiento":"positivo"},
    "LA DORADA": { "sentimiento":"positivo"},
    "MARULANDA": { "sentimiento":"negativo"},
    "PENSILVANIA":  { "sentimiento":"positivo"},
    "SAMANA": { "sentimiento":"negativo"},
    "SALAMINA": { "sentimiento":"positivo"},
    "AGUADAS": { "sentimiento":"positivo"},
    "ARANZAZU": { "sentimiento":"positivo"},
    "SAN JOSE": { "sentimiento":"positivo"},
    "BELALCAZAR":  { "sentimiento":"positivo"},
    "APIA": { "sentimiento":"positivo"},
    "SANTUARIO": { "sentimiento":"positivo"},
    "FILADELFIA": { "sentimiento":"positivo"},
    "LA MERCED": { "sentimiento":"negativo"},
    "RIOSUCIO": { "sentimiento":"positivo"},
    "GUATICA": { "sentimiento":"positivo"},
    "MARQUETALIA":{ "sentimiento":"neutro"},
    "MANZANARES": { "sentimiento":"neutro"},
    "LA CELIA": { "sentimiento":"negativo"},
    "PUEBLO RICO": { "sentimiento":"positivo"}
  }
  
  }  
*/

  aTipo = [
    { "fuente": "Contact Center" },
    { "fuente": "Chat" },
    { "fuente": "PQR" }

  ];

  aMunicipios = [
    { "nombre": "Aranzazu" },
    { "nombre": "Manizales" },
    { "nombre": "Dorada" },
    { "nombre": "Marquetalia" },
    { "nombre": "chinchina" }
  ];

  aAgentes = [
    { "nombre": "Santiago Giraldo" },
    { "nombre": "Juan Carlos Serna" },
    { "nombre": "Yulian Mejía Prado" },
    { "nombre": "Yeison José Velez" },
    { "nombre": "Juliana Osorio" }
  ];

  oSentimiento={
    "positivo":"#2ca02c",
    "negativo":"#f7240b",
    "neutro":"#c1b8b1",
    "sin_valor":"white"
  }

  radio_chat:any="chat1";
  dropdownChat:any="0";
  oEmocionPrincipal: any =
    {
      "alegria": {
        "imagen": "./assets/img/Alegria.png",
        "texto": "Alegría"
      },
      "confianza": {
        "imagen": "./assets/img/Confianza.png",
        "texto": "Confianza"
      },
      "enfado": {
        "imagen": "./assets/img/Enfado.png",
        "texto": "Enfado"
      },
      "incertidumbre": {
        "imagen": "./assets/img/Incertidumbre.png",
        "texto": "Incertidumbre"
      },

      "sorpresa": {
        "imagen": "./assets/img/Sorpresa.png",
        "texto": "Sorpresa"
      },
      "tristeza": {
        "imagen": "./assets/img/Tristeza.png",
        "texto": "Tristeza"
      },
      "es Ira": {
        "imagen": "./assets/img/Enfado.png",
        "texto": "Enfado"
      }
    };
  marcarCaracterizacion: boolean = true;
  oClasesCategorias =
    {
      "positivo": {
        "clase": "positivo",
        "icono": "fas fa-plus-square",
        "nombre": "Positivo",
        "tipo":"sentimiento",
        "index_tipo":true, //para no repetir en la vista
      },
      "negativo": {
        "clase": "negativo",
        "icono": "fas fa-minus-square",
        "nombre": "Negativo",
        "tipo":"sentimiento"
      },
      /*"Superlativos": {
        "clase": "Superlativos",
        "icono": "fas fa-plus",
        "nombre": "Superlativo"

      },
      "Negaciones": {
        "clase": "Negaciones",
        "icono": "fas fa-minus",
        "nombre": "Negación"
      },*/

      "Tiempo": {
        "clase": "Tiempo",
        "icono": "fas fa-clock",
        "nombre": "Tiempo",
        "tipo":"tipo_entidad",
        "index_tipo":true, 
      },
      "Municipio": {
        "clase": "Municipio",
        "icono": "fas fa-map-marker-alt",
        "nombre": "Municipio",
        "tipo":"tipo_entidad"
      },
      "Lugar": {
        "clase": "Lugar",
        "icono": "fas fa-map-marked-alt",
        "nombre": "Lugar",
        "tipo":"tipo_entidad"
      },
      "Empresa": {
        "clase": "Empresa",
        "icono": "fas fa-building",
        "nombre": "Empresa",
        "tipo":"tipo_entidad"
      },
      "atencionalcliente": {
        "clase": "atencionalcliente",
        "icono": "fas fa-user-check",
        "nombre": "Atención al Cliente",
        "tipo":"categoria",
        "icono_file":"./assets/img/atencionalcliente.svg",
        "index_tipo":true
      },
      "facturacion": {
        "clase": "facturacion",
        "icono": "fas fa-file-invoice-dollar",
        "nombre": "Facturacion",
        "tipo":"categoria",
        "icono_file":"./assets/img/facturacion.svg"

      },
      
      "serviciodeenergia": {
        "clase": "serviciodeenergia",
        "icono": "fas fa-charging-station",
        "nombre": "Servicio de Energía",
        "tipo":"categoria",
        "icono_file":"./assets/img/serviciodeenergia.svg"
      },
      "otrosnegocioschec": {
        "clase": "otrosnegocioschec",
        "icono": "fas fa-concierge-bell",
        "nombre": "Otros Negocios CHEC",
        "tipo":"categoria",
        "icono_file":"./assets/img/otrosnegocioschec.svg"
      },


      "alertas": {
        "clase": "alertas",
        "icono": "fas fa-exclamation-triangle",
        "nombre": "Alertas",
        "tipo":"categoria",
        "icono_file":"./assets/img/alertas.svg"
      },

    }
  //contiene los positivos, negativos, y entidaddes de tipo lugar, temporalidad etc..
  aResumenDetallado:any;
  bDisplay: boolean = false;
  bTitulos: boolean = false;
  bInstruccionInicial: boolean = false;
  //contendrá la estructura para hacer la linkeación del dendrograma
  aCategorias = {};
  // indica los badge seleccionados
  aCategoriasSeleccionadas: any = [];
  aConversacion: any;
  //mostrará la ocurrencia donde se repite la palabra
  oIndexOcurrencia:any={ contador:0,limite:0};
  public slides = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];
  //contendrá las frases de sumarización
  aFrase:any=[];

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false
  };
  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'vertical',
    slidesPerView: 1,
    keyboard: true,
    scrollbar: false,
    navigation: false,
    pagination: false,
    speed: 1000,
    simulateTouch: false,
    mousewheel: false
  };
  /*private scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };*/



  @ViewChild('swiperWrapper') public swiperWrapper: any;
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  constructor(
    private calendar: NgbCalendar,
    public ServicesProvider: ServicesProvider/*,
      private route: ActivatedRoute*/

  ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.fecha = this.fromDate.year + "/" + this.fromDate.month + "/" + this.fromDate.day + " - " + this.toDate.year + "/" + this.toDate.month + "/" + this.toDate.day;
      this.showCalendar = false;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  fn_fitProjection(projection, data, box, center) {
    // get the bounding box for the data - might be more efficient approaches
    var left = Infinity,
      bottom = -Infinity,
      right = -Infinity,
      top = Infinity;
    // reset projection
    projection
      .scale(1)
      .translate([0, 0]);
    data.forEach(function (feature) {
      d3.geoBounds(feature).forEach(function (coords) {
        coords = projection(coords);
        var x = coords[0],
          y = coords[1];
        if (x < left) left = x;
        if (x > right) right = x;
        if (y > bottom) bottom = y;
        if (y < top) top = y;
      });
    });
    // project the bounding box, find aspect ratio
    function width(bb) {
      return (bb[1][0] - bb[0][0])
    }
    function height(bb) {
      return (bb[1][1] - bb[0][1]);
    }
    function aspect(bb) {
      return width(bb) / height(bb);
    }
    var startbox = [[left, top], [right, bottom]],
      a1 = aspect(startbox),
      a2 = aspect(box),
      widthDetermined = a1 > a2,
      scale = widthDetermined ?
        // scale determined by width
        width(box) / width(startbox) :
        // scale determined by height
        height(box) / height(startbox),
      // set x translation
      transX = box[0][0] - startbox[0][0] * scale,
      // set y translation
      transY = box[0][1] - startbox[0][1] * scale;
    // center if requested
    if (center) {
      if (widthDetermined) {
        transY = transY - (transY + startbox[1][1] * scale - box[1][1]) / 2;
      } else {
        transX = transX - (transX + startbox[1][0] * scale - box[1][0]) / 2;
      }
    }
    return projection.scale(scale).translate([transX, transY])
  }

  zoomedMap() {
    g_map.selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);
  }

  fn_drawPie(){
    /*var color=d3.scaleOrdinal()
    .domain(["Alegría", "Confianza", "Enfado", "Incertidumbre", "Sorpresa", "Tristeza"])
    .range(["#f7f735", "#2ca02c", "#f7240b", "gray", "#c830d2", "#0c30b1"]);
    */
    let aPie=[];
    let colors={
      "Alegría":"#f7f735",
      "Confianza":"#2ca02c",
      "Enfado":"#f7240b", 
      "Incertidumbre":"gray",
      "Sorpresa":"#c830d2", 
      "Tristeza":"#0c30b1"

    };

    this.oVistaGeneral.aPie.forEach((element:any,i:any) => {
      aPie.push([]);
      aPie[i].push(element.label);
      aPie[i].push(element.count);
    });


    
    var donut = c3.generate({
      size:{
        height:(document.getElementById("contenedor_pie").offsetHeight-50)
      },
      bindto:"#pie",
      data: {
          columns: aPie,
          colors: colors,

          type : 'donut'/*,
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }*/
      },

      legend: {
        position: 'right'
      }
  });

// define data



  }

  fn_restorDendrogramaGeneral(){
    d3.selectAll(".general.elementodendograma").style("opacity",1)
  }

  fn_drawDendogramaGeneral() {
    let aDendograma: any = {};
    let graph: any =
    {
      "nodes": [],
      "links": []
    }
   
    let aCategoriasGeneral:any=this.oVistaGeneral.aCategoriasGeneral;
    for (var i in aCategoriasGeneral) {
      aCategoriasGeneral[i].group= this.ServicesProvider.fn_quitarAcentos(aCategoriasGeneral[i].nombre_categoria);
      aCategoriasGeneral[i].id= aCategoriasGeneral[i].nombre_categoria;
      aCategoriasGeneral[i].contexto= aCategoriasGeneral[i].imagen;
      //creando objeto de categoria general
      graph.nodes.push({
        group: this.ServicesProvider.fn_quitarAcentos(aCategoriasGeneral[i].nombre_categoria),
        id: aCategoriasGeneral[i].nombre_categoria,
        image: null,
        label: aCategoriasGeneral[i].nombre_categoria,
        ocurrencias: aCategoriasGeneral[i].num_incidencias,
        score: 1,
        contexto: aCategoriasGeneral[i].imagen,
        categoria: true //significa si es nodo padre 
      });
      for (var j in aCategoriasGeneral[i].subcategoria) {
        //creando nodos hijos
        aCategoriasGeneral[i].subcategoria[j].id=aCategoriasGeneral[i].subcategoria[j].subcategoria_nombre;
        aCategoriasGeneral[i].subcategoria[j].label=aCategoriasGeneral[i].subcategoria[j].subcategoria_nombre;
        aCategoriasGeneral[i].subcategoria[j].group=this.ServicesProvider.fn_quitarAcentos(aCategoriasGeneral[i].nombre_categoria);

        if(aCategoriasGeneral[i].subcategoria[j].id){

          graph.nodes.push(aCategoriasGeneral[i].subcategoria[j]);

          graph.links.push({
            "source": aCategoriasGeneral[i].id,
            "target":aCategoriasGeneral[i].subcategoria[j].id
          });

     
        }



        
      }
    }

    //se define esta variable para acceder a las variables de angular cuando se esta dentro de una variable de angular
    var width = document.getElementById('contenedor_categorias_general').offsetWidth - 10;
    var height = document.getElementById('contenedor_categorias_general').offsetHeight - 10;

    var NodeCircleEnterGeneral = d3.selectAll(".nodes.general");
    var images = d3.selectAll(".nodes.general");
    var images_icon = d3.selectAll(".nodes.general");

    var link = d3.selectAll(".link.general");
    //var color = d3.scaleOrdinal(d3.schemeCategory20);
    var color = d3.scaleOrdinal(d3.schemeYlGnBu[9]);
    var graphLayout: any = "";

   
   
      graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-5000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function (d) { return d.id; }).distance(100).strength(1))
        .on("tick", tickedGeneral);

      var adjlist = [];
      graph.links.forEach(function (d) {

        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
      });

      function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
      }

      window.addEventListener('resize', resize);

      function resize() {
        //contenedor_dendrograma
        var width = document.getElementById('categorias_general').offsetWidth - 10;
        var height = document.getElementById('categorias_general').offsetHeight - 10;
        svg.attr("width", width).attr("height", height);
        //se replicó el código mientras se encuentra una manera de reiniciar el código
        /*graphLayout.restart();
        graphLayout.force("charge", d3.forceManyBody().strength(-2000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(100).strength(1))
        .on("tick", tickedGeneral);
*/
      }

      var svg = d3.select("#categorias_general").attr("width", width).attr("height", height);
      var container = svg.append("g");

      svg.call(
        d3.zoom()
          //.scaleExtent([.1, 4])
          .scaleExtent([.1, 4])
          .on("zoom", function () { container.attr("transform", d3.event.transform); })
      );

      /*var link = container.append("g").attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1px");
     */

      link = container.append("g").attr("class", "links")
        .selectAll("path.link.general")
        .data(graph.links)

      link.exit().remove();

      link = link.enter().append("path")
        .attr("class", function (d) {
          return "link " + d.source.group + " " + self.fn_quitarAcentos(d.target.label) + " elementodendograma"
        }
        )

        // .attr("marker-end", "url(#end)")
        .style("stroke", "#eee");

      var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes);

      NodeCircleEnterGeneral =
        node.enter().append("g");


      NodeCircleEnterGeneral.append("circle")



        .attr("r", function (d) {
          var tamanoNodo = 0;
          if (d.categoria) {
            tamanoNodo = 25;
          }
          else {
            tamanoNodo = 15;

          }
          if (d.ocurrencias == undefined || d.ocurrencias == null) {
            d3.select(this).attr("radio_original", tamanoNodo);
            return tamanoNodo;
          }
          d3.select(this).attr("radio_original", tamanoNodo + d.ocurrencias);

          return tamanoNodo + d.ocurrencias;
        })
        .attr("fill", function (d) {
          
          if (d.categoria) {

            return self.oSentimiento[d.contexto];
            /*
            if (d.score > 0) {
              return "#2ca02c";
            }
            else if (d.score < 0) {
              return "#f7240b";
            }
            else {
              return "#c1b8b1";
            }*/
          }
          else {
            return color(d.group);
          }

        })
        .attr("class", function (d) { return "general "+ d.group + " elementodendograma" + " " + self.fn_quitarAcentos(d.label) + " " + (d.categoria ? 'nodopadre' : 'nodohijo'); })
        .attr("display", function (d) {
          if (d.image != null) {
            return "none";
          }
          else {
            return "block";
          }
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")

      /*.attr("fill", function(d){
        return color(d.group);
      })*/



      


      images_icon = NodeCircleEnterGeneral
        //filtrar los nodos que no tengan imagen
        .filter(function (d, i) { // <-E
          return d.categoria;
        })
        .append("svg:image")
        .attr("xlink:href", function (d) {

          return self.oClasesCategorias[d.group].icono_file
        })
        .attr("x", function (d) {
          return -15;
        })
        .attr("y", function (d) { return -15; })


        .attr("height", function (d) {
          return 30;
        })
        .attr("width", function (d) {
          return 30;

        })
        .style("pointer-events", "none");








      images = NodeCircleEnterGeneral
        //filtrar los nodos que no tengan imagen
        .filter(function (d, i) { // <-E
          return d.image != null;
        })
        .append("svg:image")
        .attr("xlink:href", function (d) { return d.image; })
        .attr("x", function (d) {
          return -20;
        })
        .attr("y", function (d) { return -20; })
        .classed("image_circle", true)
        .attr("class", function (d) {
          return "general "+d.group;
        })

        .attr("height", function (d) {
          if (d.image != null) {
            return 40;
          }
          else {
            return 50;
          }
        })
        .attr("width", function (d) {
          if (d.image != null) {
            return 40;
          }
          else {
            return 50;
          }
        });




      NodeCircleEnterGeneral.on("mouseover", focusGeneral).on("mouseout", unfocusGeneral).on("click", clicknodeGeneral);

      NodeCircleEnterGeneral.call(
        d3.drag()
          .on("start", dragstartedGeneral)
          .on("drag", draggedGeneral)
          .on("end", draggedEnGeneral)
      );

      var text = NodeCircleEnterGeneral.append("text")
        /*.style("dominant-baseline", "central")
        .style("text-anchor", "middle")
        .style("font-family", "Roboto")*/
        .attr("class", function (d) {
          return "general "+ d.group + " elementodendograma" + " " + self.fn_quitarAcentos(d.label);
        })
        .classed('arthur', true)
        .classed('text_image', function (d) {
          if (d.image != null) {
            return true;
          }
          else {
            return false;
          }
        })

        .classed('texto_nodo', true)
        .style("font-size", function (d) {
          if (d.image != null) {
            return "0.9em"
          }
          return "0.7em";
        })
        .attr('x', function (d) {
          let texto = d3.select(this).attr("posicion_texto_x", parseInt(d3.select(this.parentNode).select("circle").attr("radio_original")) + 4);
          return texto.attr("posicion_texto_x");

          if (d.image != null) {
            return -22;
          }
          else {
            return 6;
          }
        })
        .attr('y', function (d) {
          let texto = d3.select(this).attr("posicion_texto_y", parseInt(d3.select(this.parentNode).select("circle").attr("radio_original")) - 8);
          return texto.attr("posicion_texto_y");
          if (d.image != null) {
            return 31;
          }
          else {
            return 6;
          }
        })
        .text(function (d) {
          return d.label;
        });



      /*var labelNode = container.append("g").attr("class", "labelNodes")
          .selectAll("text")
          .data(label.nodes)
          .enter()
          .append("text")
          .text(function(d, i) { return i % 2 == 0 ? "" : d.node.id; })
          .style("fill", "#555")
          .style("font-family", "Arial")
          .style("font-size", 12)
          .style("pointer-events", "none"); // to prevent mouseover/drag capture
     */
      node.on("mouseover", focusGeneral).on("mouseout", unfocusGeneral)

      function tickedGeneral() {

        NodeCircleEnterGeneral.call(updateNode);
        link.call(updateLinkGeneral);

        /*labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function(d, i) {
            if(i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {


                var b = this.getBBox();
               
                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;
   
                var dist = Math.sqrt(diffX * diffX + diffY * diffY);
   
                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);*/

      }

      function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
      }

      function focusGeneral(d) {







        var index = d3.select(d3.event.target).datum().index;
        //pilas, este con node
        d3.selectAll("circle." + "general."+d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("r", function (d) {
            return parseInt(d3.select(this).attr("radio_original")) + 3;
          })


        d3.selectAll("image." + "general."+d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 60)
          .attr("width", 60)

        d3.selectAll("text." + "general."+d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 60)
          .attr("width", 60)
          .style("font-size", function (d) {
            if (d.image != null) {
              return "1em"
            }
            return "0.8em";
          })
          .attr('x', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_x")) + 3
            if (d.image != null) {
              return -8;
            }
            else {
              return 10;
            }
          })
          .attr('y', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_y")) + 3

            if (d.image != null) {
              return 51;
            }
            else {
              return 11;
            }
          })



        /*NodeCircleEnterGeneral.style("opacity", function (o) {
          return neigh(index, o.index) ? 1 : 0.1;
        })
 
        link.style("opacity", function (o) {
          return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });*/
      }



      function clicknodeGeneral(d) {

        let subcategoria = self.fn_quitarAcentos(d.label);




        //link.style("opacity",0.1);
        // mostrando la categoria cuando se hace hovering en el nodo
        self.restablecer_node();

        //al hacer hover en el nodo padre se muestran los nodos con dicha categoria
        if (d.categoria) {

          //opacidad de los nodos que no estan seleccionado
          d3.selectAll(".general.elementodendograma").style("opacity", function () {
            if (!d3.select(this).classed(d.group)) {
              return 0.1;
            }
            else {
              return 1;
            }
          });

        }



        else {

 
          d3.selectAll(".general.elementodendograma").style("opacity", function () {
            if (d3.select(this).classed("texto_nodo") && d3.select(this).classed(d.group)) {
              return 1;
            }
            if (d3.select(this).classed("nodopadre") && d3.select(this).classed(d.group)) {
              return 1;
            }
            else {

              if (!d3.select(this).classed(subcategoria)) {
                return 0.1;
              }
              else {

                return 1;
              }
            }

          });
        }

        //se quitan las categorias seleccionadas
        //dummy no hace nada, pero se usa simplemente para eliminar el icono de sentimiento posiitvo o negativo


      }






      function unfocusGeneral(d) {
        d3.selectAll(".texto_nodo.general").attr("display", "block");

        d3.selectAll("circle." + "general."+d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("r", function (d) {
            return parseInt(d3.select(this).attr("radio_original"));
          })

        d3.selectAll("image." +"general."+ d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 40)
          .attr("width", 40)


        d3.selectAll("text." +"general."+ d.group)
          .transition()
          .ease(d3.easeLinear)
          .style("font-size", function (d) {


            if (d.image != null) {
              return "0.9em"
            }
            return "0.7em";
          })
          .attr('x', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_x"));

            if (d.image != null) {
              return -22;
            }
            else {
              return 6;
            }
          })
          .attr('y', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_y"));


            if (d.image != null) {
              return 31;
            }
            else {
              return 3;
            }
          })



        //labelNode.attr("display", "block");
        //pilas este con node

        //mouseout

        /*NodeCircleEnterGeneral.style("opacity", 1);
        link.style("opacity", 1);
*/


      }

      function updateLinkGeneral(link) {
        /*link.attr("x1", function(d) { return fixna(d.source.x); })
             .attr("y1", function(d) { return fixna(d.source.y); })
             .attr("x2", function(d) { return fixna(d.target.x); })
             .attr("y2", function(d) { return fixna(d.target.y); });*/

        //lineas curvas
        link.attr("d", function (d) {

          var dx = fixna(d.target.x) - fixna(d.source.x),
            dy = fixna(d.target.y) - fixna(d.source.y),
            dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + d.source.x + ","
            + fixna(d.source.y)
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + fixna(d.target.x) + ","
            + fixna(d.target.y);
        });

      }

      function updateNode(node) {
        node.attr("transform", function (d) {
          return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
      }

      function dragstartedGeneral(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        //todo
        //d3.selectAll(".texto_nodo").style("opacity", "1");
        d.fx = d.x;
        d.fy = d.y;
      }

      function draggedGeneral(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function draggedEnGeneral(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }








  }



  










  /*fn_setOpacityHover(categoria:any){
    //document.querySelectorAll(".badge").clas
    if(!this.marcarCaracterizacion){
      d3.selectAll(".badge").classed("badge_opacity",false);
      d3.selectAll(".badge."+categoria).classed("no_badge",false).classed("badge_opacity",false);
    }

    d3.selectAll(".badge").classed("badge_opacity",true);
    d3.selectAll(".badge."+categoria).classed("badge_opacity",false);
  }
  fn_setOpacityOut(categoria:any){
    //document.querySelectorAll(".badge").clas
    if(!this.marcarCaracterizacion){
      d3.selectAll(".badge."+categoria).classed("no_badge",false);
    }
    d3.selectAll(".badge").classed("badge_opacity",false);

  }*/
  //agrega todas las palabras al array de categorias seleccionadas

  fn_llenarCategoriasSeleccionadas() {
    for (var i in this.oClasesCategorias) {
      this.aCategoriasSeleccionadas.push(i);
    }
    d3.selectAll(".badge_palabras.badge").classed("no_badge", false);
    d3.selectAll(".titulos_categoria.badge").classed("badge_opacity", false);

  }

  fn_vaciarCategoriasSeleccionadas() {
    this.aCategoriasSeleccionadas = [];
    d3.selectAll(".badge_palabras").classed("no_badge", true);
    d3.selectAll(".titulos_categoria.badge").classed("badge_opacity", true);

  }
  scrollToJustAbove(element, margin=20) {
    let dims = element.getBoundingClientRect();
    window.scrollBy({
     top: dims.top - margin,
     behavior: 'smooth'
    });
  }
  fn_quitarAcentos(palabra:any){
    return this.ServicesProvider.fn_quitarAcentos(palabra);
  }

  fn_scrollToClass(element?:any,no_marcar?:any){
    //scroll hasta el elemento que contentga el nombre de la palabra


      var classElement:any="";
      if(element){
        //si es una frase no se tiene en cuenta la logica de buscar iteraciones
        if(element.search("frase")!=-1){
          classElement= document.querySelectorAll("."+element);
        }
        else{
        this.oIndexOcurrencia.clase=element;
        this.oIndexOcurrencia.elemento= document.querySelectorAll(".badge_palabras"+"."+element);
        classElement= this.oIndexOcurrencia.elemento;
        this.oIndexOcurrencia.limite=  this.oIndexOcurrencia.elemento.length;
        }


      }
      else{

        classElement= this.oIndexOcurrencia.elemento;
      }


        //const classElement = document.getElementsByClassName(element);




        if(classElement.length > 0){
          //this.scrollToJustAbove(classElement[0]);
          if(!no_marcar){
            d3.selectAll(".badge_palabras").classed("seleccion_palabra",false);
            d3.select(classElement[this.oIndexOcurrencia.contador]).classed("seleccion_palabra",true);
          }

          //este fix es para frases, esto se cuando la primera accion que se hace es el hovering
          if(element && element.search("frase")!=-1){
            classElement[0].scrollIntoView({ block: 'start',  behavior: 'smooth' });
            return "";
          }

          classElement[this.oIndexOcurrencia.contador].scrollIntoView({ block: 'start',  behavior: 'smooth' });
        }


      /*const yourElement = document.getElementById(section);
      const yCoordinate = yourElement.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -100; 
      
      window.scrollTo({
          top: yCoordinate + yOffset,
          behavior: 'smooth'
      });*/

    }

  fn_MarcarCategoriasSeleccionadas(){
    setTimeout(()=>{
      d3.selectAll(".badge_palabras.badge").classed("no_badge", true).attr("dummy",function(){
        d3.select(this).selectAll("i").classed("d-none",true);

       });

      for(var i in this.aCategoriasSeleccionadas){
        d3.selectAll(".titulos_categoria.badge." + this.aCategoriasSeleccionadas[i]).classed("badge_opacity", false);
        d3.selectAll(".badge_palabras.badge." + this.aCategoriasSeleccionadas[i]).classed("no_badge", false).attr("dummy",function(){
          d3.select(this).selectAll("i").classed("d-none",false);

         })
      }
    })

    /**/

  }


  fn_AddRemoveCategoria(item: any) {
    let index = this.aCategoriasSeleccionadas.indexOf(item);
    if (index == -1) {
      d3.selectAll(".titulos_categoria.badge." + item).classed("badge_opacity", false);
      d3.selectAll(".badge_palabras.badge." + item).classed("no_badge", false).attr("dummy",function(){
        d3.select(this).selectAll("i").classed("d-none",false);

       return "";
     })
      this.aCategoriasSeleccionadas.push(item);
    }
    else {
      this.aCategoriasSeleccionadas.splice(index, 1);
      d3.selectAll(".titulos_categoria.badge." + item).classed("badge_opacity", true);
      d3.selectAll(".badge_palabras.badge." + item).classed("no_badge", true).attr("dummy",function(){
        d3.select(this).selectAll("i").classed("d-none",true);

       return "";
     });



    }
  }

  fn_changeMararCaracterizacion() {
    if (this.marcarCaracterizacion) {
      d3.selectAll(".container_chat i").classed("d-none",false);

      this.fn_llenarCategoriasSeleccionadas();
    }
    else {
      d3.selectAll(".badge_palabras.badge").classed("no_badge", true);
      this.fn_vaciarCategoriasSeleccionadas();
      d3.selectAll(".container_chat i").classed("d-none",true);

    }
  }



  restablecer_node(){
       
    //se quitan las categorias seleccionadas
    //dummy no hace nada, pero se usa simplemente para eliminar el icono de sentimiento posiitvo o negativo
    d3.selectAll(".container_chat i").classed("d-none",true);


    d3.selectAll(".badge_palabras").classed("no_badge", true)

/*
.attr("dummy",function(){
        d3.select(this).selectAll("i").classed("d-none",true);
  
       });*/ 

     for(var i in this.aCategoriasSeleccionadas){
       //se pintan las categorias segun el nodo con el hovering
       d3.selectAll(".badge_palabras."+this.aCategoriasSeleccionadas[i]).classed("no_badge", false)
     }
    //quitar las ocurrencias porque se resetea
    this.oIndexOcurrencia.limite=0;
    d3.select(".seleccion_palabra").classed("seleccion_palabra",false);
  }

  fn_restablecerOpacityNode(){
    //volviendo nodos a la normalidad
    d3.selectAll(".individual.elementodendograma").style("opacity",1)
  }

  fn_nextOcurrencia(){
    this.oIndexOcurrencia.contador=this.oIndexOcurrencia.contador+1;
    if(this.oIndexOcurrencia.contador==this.oIndexOcurrencia.limite){
      this.oIndexOcurrencia.contador=0;
    }
    this.fn_scrollToClass();
    //fn_scrollToClass(d.id);
  }

  fn_drawDendograma() {
    let aDendograma: any = {};
    for (var i in this.aConversacion.Emocion) {
      /*aDendograma.push({

      })*/
      //no sobrescribir la key
      if (!aDendograma[this.aConversacion.Emocion[i].Palabra]) {
        aDendograma[this.aConversacion.Emocion[i].Palabra] = this.aConversacion.Emocion[i];
        aDendograma[this.aConversacion.Emocion[i].Palabra].ocurrencias = 1;
        //corner cases de palabras que no son emociones principales como el caso de neutro y superlativos
        /*if (this.ServicesProvider.fn_quitarAcentos(this.aConversacion.Emocion[i]["Emocion"]) == "superlativos" || this.ServicesProvider.fn_quitarAcentos(this.aConversacion.Emocion[i]["Emocion"]) == "negaciones") {
          this.aConversacion.Emocion[i]["Emocion"] = "neutro";
        }*/
        aDendograma[this.aConversacion.Emocion[i].Palabra].id = this.aConversacion.Emocion[i].Palabra;
        aDendograma[this.aConversacion.Emocion[i].Palabra].group = this.ServicesProvider.fn_quitarAcentos(this.aConversacion.Emocion[i]["Emocion"]);

        aDendograma[this.aConversacion.Emocion[i].Palabra].image = null;
        aDendograma[this.aConversacion.Emocion[i].Palabra].label = this.aConversacion.Emocion[i].Palabra;

      }
      else {
        aDendograma[this.aConversacion.Emocion[i].Palabra].ocurrencias = aDendograma[this.aConversacion.Emocion[i].Palabra].ocurrencias + 1;

      }
      //contar ocurrencias

    }

    this.aResumenDetallado={
      "positivo": { "palabras": [], "ocurrencias":0 },
      "negativo":{ "palabras": [], "ocurrencias":0 }
    };

    for(var i in aDendograma){
      if(this.aResumenDetallado[aDendograma[i].sentimiento]){
        this.aResumenDetallado[aDendograma[i].sentimiento].nombre=aDendograma[i].sentimiento;
        this.aResumenDetallado[aDendograma[i].sentimiento].ocurrencias= this.aResumenDetallado[aDendograma[i].sentimiento].ocurrencias+aDendograma[i].ocurrencias;
        this.aResumenDetallado[aDendograma[i].sentimiento].palabras.push(
          aDendograma[i]
        )
      }
      if(aDendograma[i].Tipo!="" && aDendograma[i].Tipo!=" " && aDendograma[i].Tipo!=null && aDendograma[i].Tipo!="Keyword") {

        //si no existe se crea
        if(!this.aResumenDetallado[aDendograma[i].Tipo]){

          this.aResumenDetallado[aDendograma[i].Tipo]={};
          this.aResumenDetallado[aDendograma[i].Tipo].palabras=[];
          this.aResumenDetallado[aDendograma[i].Tipo].ocurrencias=0;
          this.aResumenDetallado[aDendograma[i].Tipo].nombre=aDendograma[i].Tipo;

        }
        this.aResumenDetallado[aDendograma[i].Tipo].palabras.push(aDendograma[i]);
        this.aResumenDetallado[aDendograma[i].Tipo].ocurrencias=this.aResumenDetallado[aDendograma[i].Tipo].ocurrencias+aDendograma[i].ocurrencias;



      }
      
    }





    let aEmocionesPrincipales =
      [
        {
          "id": "alegria",
          "label": "Alegría",
          "group": "alegria",
          "image": "./assets/img/Alegria.png"
        },
        {
          "id": "confianza",
          "label": "Confianza",
          "group": "confianza",
          "image": "./assets/img/Confianza.png"
        },
        {
          "id": "enfado",
          "label": "Enfado",
          "group": "enfado",
          "image": "./assets/img/Enfado.png"
        },
        {
          "id": "incertidumbre",
          "label": "Incertidumbre",
          "group": "incertidumbre",
          "image": "./assets/img/Incertidumbre.png"
        },
        {
          "id": "sorpresa",
          "label": "Sorpresa",
          "group": "sorpresa",
          "image": "./assets/img/Sorpresa.png"
        },
        {
          "id": "tristeza",
          "label": "Tristeza",
          "group": "tristeza",
          "image": "./assets/img/Tristeza.png"
        },
        {
          "id": "neutro",
          "label": "Neutro",
          "group": "neutro",
          "image": "./assets/img/Neutro.png"
        }
      ];

 

    let graph: any =
    {
      "nodes": [],
      "links": []
    }
    /*
    emociones
    graph.nodes.push(...aEmocionesPrincipales);
    for (var i in aDendograma) {
      graph.nodes.push(aDendograma[i]);
      graph.links.push({
        "source": this.ServicesProvider.fn_quitarAcentos(aDendograma[i]["Emocion"]),
        "target": aDendograma[i].id
      });
    }*/


  
    //console.log(this.aResumenDetallado);
    
    for(var i in this.aCategorias){
      //creando objeto de categoria general
      graph.nodes.push({
        group: this.ServicesProvider.fn_quitarAcentos(i),
        id: i,
        image: null,
        label: i,
        ocurrencias:  this.aCategorias[i].ocurrencias,
        score:this.aCategorias[i].score,
        contexto:this.aCategorias[i].contexto,
        categoria:true //significa si es nodo padre 
      });
      for(var j in this.aCategorias[i]){
        //creando nodos hijos

        if(this.aCategorias[i][j].id){
          graph.nodes.push(this.aCategorias[i][j]);

          graph.links.push({
            "source": i,
            "target": this.aCategorias[i][j].id
          });
        }
      }
    }
    //abarcar tamaño completo de la pantalla
/*    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      height = w.innerHeight || e.clientHeight || g.clientHeight;
*/

    //se define esta variable para acceder a las variables de angular cuando se esta dentro de una variable de angular
    let self=this;
    var width= document.getElementById('contenedor_dendrograma').offsetWidth-10;
    var height= document.getElementById('contenedor_dendrograma').offsetHeight-10;

    var NodeCircleEnter = d3.selectAll(".individual.nodes");
    var images = d3.selectAll(".individual.nodes");
    var images_icon = d3.selectAll(".individual.nodes");

    var link = d3.selectAll(".individual.link");
    //var color = d3.scaleOrdinal(d3.schemeCategory20);
    var color =   d3.scaleOrdinal( d3.schemeYlGnBu[9]);
    var graphLayout: any = "";


    d3.json("./assets/data/data.json").then(function (data) {

      var label = {
        'nodes': [],
        'links': []
      };

      /*graph.nodes.forEach(function (d, i) {
        label.nodes.push({ node: d });
        label.nodes.push({ node: d });
        label.links.push({
          source: i * 2,
          target: i * 2 + 1
        });
      });*/



      /*var labelLayout = d3.forceSimulation(label.nodes)
          .force("charge", d3.forceManyBody().strength(-50))
          .force("link", d3.forceLink(label.links).distance(0).strength(2));*/

      graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-5000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function (d) { return d.id; }).distance(100).strength(1))
        .on("tick", ticked);

      var adjlist = [];
      graph.links.forEach(function (d) {
        
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
      });

      function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
      }

      window.addEventListener('resize', resize);

      function resize() {
        //contenedor_dendrograma
        var width= document.getElementById('contenedor_dendrograma').offsetWidth-10;
        var height= document.getElementById('contenedor_dendrograma').offsetHeight-10;
        svg.attr("width", width).attr("height", height);
        //se replicó el código mientras se encuentra una manera de reiniciar el código
        /*graphLayout.restart();
        graphLayout.force("charge", d3.forceManyBody().strength(-2000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(100).strength(1))
        .on("tick", ticked);
*/
      }

      var svg = d3.select("#grafica_emocion").attr("width", width).attr("height", height);
      var container = svg.append("g");

      svg.call(
        d3.zoom()
          //.scaleExtent([.1, 4])
          .scaleExtent([.1, 4])
          .on("zoom", function () { container.attr("transform", d3.event.transform); })
      );
        
      /*var link = container.append("g").attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1px");
     */

      link = container.append("g").attr("class", "links")
        .selectAll(".individual.path.link")
        .data(graph.links)

      link.exit().remove();

      link = link.enter().append("path")
        .attr("class", function(d){

          return "individual link "+d.source.group+ " "+self.fn_quitarAcentos(d.target.label)+ " elementodendograma"}
          )
        
        // .attr("marker-end", "url(#end)")
        .style("stroke", "#eee");





      var node = container.append("g").attr("class", "individual nodes")
        .selectAll("g")
        .data(graph.nodes);

      NodeCircleEnter =
        node.enter().append("g");


      NodeCircleEnter.append("circle")



        .attr("r", function (d) {
          var tamanoNodo=0;
          if(d.categoria){
            tamanoNodo=25;
          }
          else{
            tamanoNodo=15;

          }
          if (d.ocurrencias == undefined || d.ocurrencias == null) {
            d3.select(this).attr("radio_original", tamanoNodo);
            return tamanoNodo;
          }
          d3.select(this).attr("radio_original", tamanoNodo + d.ocurrencias);

          return tamanoNodo + d.ocurrencias;
        })
        .attr("fill", function(d){
        
          if(d.categoria){
            if(d.score>0){
              return "#57FF84";
            }
            else if(d.score<0){
              return "#f7240b";
            }
            else{
              return "#c1b8b1";
            }
          }
          else{
            return color(d.group);
          }

        })
        .attr("class", function (d) { return "individual "+d.group+ " elementodendograma"+ " "+self.fn_quitarAcentos(d.label) + " "+(d.categoria?'nodopadre':'nodohijo'); })
        .attr("display", function (d) {
          if (d.image != null) {
            return "none";
          }
          else {
            return "block";
          }
        })
        .style("stroke","black")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")

        /*.attr("fill", function(d){
          return color(d.group);
        })*/



      images_icon = NodeCircleEnter
        //filtrar los nodos que no tengan imagen
        .filter(function (d, i) { // <-E
          return d.categoria;
        })
        .append("svg:image")
        .attr("xlink:href", function (d) { 
          
          return self.oClasesCategorias[d.group].icono_file })
        .attr("x", function (d) {
          return -15;
        })
        .attr("y", function (d) { return -15; })
        

        .attr("height", function (d) {
            return 30;
        })
        .attr("width", function (d) {
          return 30;

        })
        .style("pointer-events","none");








      images = NodeCircleEnter
        //filtrar los nodos que no tengan imagen
        .filter(function (d, i) { // <-E
          return d.image != null;
        })
        .append("svg:image")
        .attr("xlink:href", function (d) { return d.image; })
        .attr("x", function (d) {
          return -20;
        })
        .attr("y", function (d) { return -20; })
        .classed("image_circle", true)
        .attr("class", function (d) {
          return "individual "+ d.group;
        })

        .attr("height", function (d) {
          if (d.image != null) {
            return 40;
          }
          else {
            return 50;
          }
        })
        .attr("width", function (d) {
          if (d.image != null) {
            return 40;
          }
          else {
            return 50;
          }
        });




      NodeCircleEnter.on("mouseover", focus).on("mouseout", unfocus).on("click", clicknode);

      NodeCircleEnter.call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

      var text = NodeCircleEnter.append("text")
        /*.style("dominant-baseline", "central")
        .style("text-anchor", "middle")
        .style("font-family", "Roboto")*/
        .attr("class", function (d) {
          return "individual "+ d.group+ " elementodendograma"+ " "+self.fn_quitarAcentos(d.label);
        })
        .classed('arthur', true)
        .classed('text_image', function (d) {
          if (d.image != null) {
            return true;
          }
          else {
            return false;
          }
        })

        .classed('texto_nodo', true)
        .style("font-size", function (d) {
          if (d.image != null) {
            return "0.9em"
          }
          return "0.7em";
        })
        .attr('x', function (d) {
          let texto=d3.select(this).attr("posicion_texto_x",parseInt(d3.select(this.parentNode).select("circle").attr("radio_original"))+4);
          return texto.attr("posicion_texto_x");

          if (d.image != null) {
            return -22;
          }
          else {
            return 6;
          }
        })
        .attr('y', function (d) {
          let texto=d3.select(this).attr("posicion_texto_y",parseInt(d3.select(this.parentNode).select("circle").attr("radio_original"))-8);
          return texto.attr("posicion_texto_y");
          if (d.image != null) {
            return 31;
          }
          else {
            return 6;
          }
        })
        .text(function (d) {
          return d.label;
        });



      /*var labelNode = container.append("g").attr("class", "labelNodes")
          .selectAll("text")
          .data(label.nodes)
          .enter()
          .append("text")
          .text(function(d, i) { return i % 2 == 0 ? "" : d.node.id; })
          .style("fill", "#555")
          .style("font-family", "Arial")
          .style("font-size", 12)
          .style("pointer-events", "none"); // to prevent mouseover/drag capture
     */
      node.on("mouseover", focus).on("mouseout", unfocus)

      function ticked() {

        NodeCircleEnter.call(updateNode);
        link.call(updateLink);

        /*labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function(d, i) {
            if(i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {


                var b = this.getBBox();
               
                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;
   
                var dist = Math.sqrt(diffX * diffX + diffY * diffY);
   
                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);*/

      }

      function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
      }

      function focus(d) {


  




        var index = d3.select(d3.event.target).datum().index;
        //pilas, este con node
        d3.selectAll(".individual.circle." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("r", function (d) {
            return parseInt(d3.select(this).attr("radio_original")) + 3;
          })


        d3.selectAll(".individual.image." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 60)
          .attr("width", 60)

        d3.selectAll(".individual.text." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 60)
          .attr("width", 60)
          .style("font-size", function (d) {
            if (d.image != null) {
              return "1em"
            }
            return "0.8em";
          })
          .attr('x', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_x") ) + 3
            if (d.image != null) {
              return -8;
            }
            else {
              return 10;
            }
          })
          .attr('y', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_y") ) + 3

            if (d.image != null) {
              return 51;
            }
            else {
              return 11;
            }
          })



        /*NodeCircleEnter.style("opacity", function (o) {
          return neigh(index, o.index) ? 1 : 0.1;
        })
 
        link.style("opacity", function (o) {
          return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });*/
      }

 

      function clicknode(d){

              let subcategoria=self.fn_quitarAcentos(d.label);




              //link.style("opacity",0.1);
               // mostrando la categoria cuando se hace hovering en el nodo
              self.oIndexOcurrencia.contador=0;
              self.restablecer_node();

               //d3.selectAll(".texto_nodo").attr("display", "none");
               d3.selectAll("." + d.group).attr("display", "block")
               
       
               d3.selectAll(".badge_palabras.badge").classed("no_badge", true);
               //al hacer hover en el nodo padre se muestran los nodos con dicha categoria
               if(d.categoria){
                 d3.selectAll(".badge_palabras."+d.group).classed("no_badge", false)
                 //se va agregar la clase a los iconos en el elmento al hacer hovering dummy no hace nada pero permite hacer esta asignacion
                 .attr("dummy",function(){
                    d3.select(this).selectAll("i").classed("d-none",false);

                   return "";
                 })
       
                 self.fn_scrollToClass(d.group);
              //opacidad de los nodos que no estan seleccionado
              d3.selectAll(".individual.elementodendograma").style("opacity",function(){
                if(!d3.select(this).classed(d.group)){
                  return 0.1;
                }
                else{
                  return 1;
                }
              });

               }
       

               
               else{

               //se muestra nodos hijos
               d3.selectAll(".badge_palabras."+subcategoria).classed("no_badge", false).filter(function () { // <-E
                 return d.sentimiento!=undefined && d.sentimiento!=null;
               }).attr("dummy",function(){
                d3.select(this).selectAll("i").classed("d-none",false);

                 return "";
               })
               self.fn_scrollToClass(subcategoria);
                d3.selectAll(".elementodendograma").style("opacity",function(){
                  if(d3.select(this).classed("texto_nodo") && d3.select(this).classed(d.group) ){
                    return 1;
                  }
                  if(d3.select(this).classed("nodopadre") && d3.select(this).classed(d.group) ){
                    return 1;
                  }
                  else{

                    if(!d3.select(this).classed(subcategoria) ){
                      return 0.1;
                    }
                    else{

                      return 1;
                    }
                  }

                });
               }

        //se quitan las categorias seleccionadas
        //dummy no hace nada, pero se usa simplemente para eliminar el icono de sentimiento posiitvo o negativo


      }






      function unfocus(d) {
        d3.selectAll(".individual.texto_nodo").attr("display", "block");

        d3.selectAll(".individual.circle." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("r", function (d) {
            return parseInt(d3.select(this).attr("radio_original"));
          })

        d3.selectAll(".individual.image." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .attr("height", 40)
          .attr("width", 40)


        d3.selectAll(".individual.text." + d.group)
          .transition()
          .ease(d3.easeLinear)
          .style("font-size", function (d) {


            if (d.image != null) {
              return "0.9em"
            }
            return "0.7em";
          })
          .attr('x', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_x") );

            if (d.image != null) {
              return -22;
            }
            else {
              return 6;
            }
          })
          .attr('y', function (d) {
            return parseInt(d3.select(this).attr("posicion_texto_y") );


            if (d.image != null) {
              return 31;
            }
            else {
              return 3;
            }
          })



        //labelNode.attr("display", "block");
        //pilas este con node

          //mouseout

        /*NodeCircleEnter.style("opacity", 1);
        link.style("opacity", 1);
*/
 

      }

      function updateLink(link) {
        /*link.attr("x1", function(d) { return fixna(d.source.x); })
             .attr("y1", function(d) { return fixna(d.source.y); })
             .attr("x2", function(d) { return fixna(d.target.x); })
             .attr("y2", function(d) { return fixna(d.target.y); });*/

        //lineas curvas
        link.attr("d", function (d) {
          var dx = fixna(d.target.x) - fixna(d.source.x),
            dy = fixna(d.target.y) - fixna(d.source.y),
            dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + d.source.x + ","
            + fixna(d.source.y)
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + fixna(d.target.x) + ","
            + fixna(d.target.y);
        });

      }

      function updateNode(node) {
        node.attr("transform", function (d) {
          return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
      }

      function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        //todo
        //d3.selectAll(".texto_nodo").style("opacity", "1");
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

    }); // d3.json







  }

  fn_hightlightFrase(index){
    d3.selectAll(".badge_palabras").filter(function () { // <-E
      return !d3.select(this).classed("sinrelevancia");
    }).classed("badge",false);
    d3.selectAll("."+"frase"+index).classed("frase_actual",true);
    this.fn_scrollToClass("frase"+index,true);
    //si estan los menos y más (iconos) apareceran si estan marcados, con esto se arreglar
    d3.selectAll(".container_chat i").classed("d-none",true);
  }
  fn_removehightlightFrase(index){
    d3.selectAll(".badge_palabras").classed("badge",true);
    d3.selectAll("."+"frase"+index).classed("frase_actual",false);
     //(iconos) volveran a la normalida
    
    //d3.selectAll(".container_chat i").classed("d-none",false);
    //console.log(d3.selectAll(".badge_palabras.badge"));
    d3.selectAll(".badge_palabras.badge").attr("dummy",function(){
      if(d3.select(this).classed("no_badge")) {
        d3.select(this).selectAll("i").classed("d-none",true)
      }
      else{
        d3.select(this).selectAll("i").classed("d-none",false)

      }
    })
  }
  fn_getConversacion(index:any) {
    
    d3.select("#grafica_emocion g").remove();
    this.aCategorias={};
    this.oIndexOcurrencia.limite=0;
    this.ServicesProvider.getjson("./assets/data/data.json", {}).then((data: any) => {
      this.aConversacion = data[index][0];

      /* pagina 1*/
      //this.aConversacion.Chat.splice(0, 1);
      let indexSumarizacion=0;
      this.aFrase=[];
      let flagFrase=false;

      for (var i in this.aConversacion.Chat) {

        let chat = this.aConversacion.Chat[i].mensaje.split(" ");
        //se almacena palabra a palabra en el chat
        let aPalabraChat = [];
        for (var j in chat) {
          aPalabraChat[j] = { "palabra": chat[j] };

          if(this.aConversacion.Chat[i].emisor=="cliente"){
            if(this.aConversacion.Frase[indexSumarizacion]){

              if(this.fn_quitarAcentos(chat[j])==this.fn_quitarAcentos(this.aConversacion.Frase[indexSumarizacion]["Primera palabra"])){
                flagFrase=true;
              }
              //fix, si la primera palabra es vacia, quiere decir que no hay otr aantes, entonces desde aqui empezará
              if(this.aConversacion.Frase[indexSumarizacion]["Primera palabra"]=="") {
                flagFrase=true;
              }

            }
  
            if(flagFrase){
              aPalabraChat[j]["frase"]="frase"+indexSumarizacion;

              if(!this.aFrase[indexSumarizacion]){
                this.aFrase[indexSumarizacion]="";
                if(chat[parseInt(j)-1]){
                  //a cobrar por ejemeplo se quita la a y se toma la que sigue anterior
                  if(chat[parseInt(j)-1]=="a"){
                    if(chat[parseInt(j)-2]){
                      this.aFrase[indexSumarizacion]+=(chat[parseInt(j)-2])+" "+(chat[parseInt(j)-1])+" ";
                      aPalabraChat[parseInt(j)-1]["frase"]="frase"+indexSumarizacion;
                      aPalabraChat[parseInt(j)-2]["frase"]="frase"+indexSumarizacion;
                    }
                  }
                  else{
                    this.aFrase[indexSumarizacion]+=(chat[parseInt(j)-1])+" ";
                    aPalabraChat[parseInt(j)-1]["frase"]="frase"+indexSumarizacion;

                  }

                }

              }
              this.aFrase[indexSumarizacion]+=(chat[j])+" ";

              if(this.aConversacion.Frase[indexSumarizacion]){

                if(this.fn_quitarAcentos(chat[j])==this.fn_quitarAcentos(this.aConversacion.Frase[indexSumarizacion]["Ultima palabra"])){
                  flagFrase=false;
                  indexSumarizacion=indexSumarizacion+1;
                }
              }

            }

          }


          for (var t in this.aConversacion.Emocion) {

            if (this.aConversacion.Chat[i].emisor == "cliente") {


  
              // si la palabra es una keyword o entidad se agrega el detalle

              if (this.ServicesProvider.fn_quitarPuntuacion(chat[j]).toLowerCase() == this.aConversacion.Emocion[t].Palabra.toLowerCase()) {
                aPalabraChat[j].detallePalabra = this.aConversacion.Emocion[t];
                if( this.aConversacion.Emocion[t].Tipo=="Tiempo"){
                  //coger palabra anterior al tiempo ejemplo "12 horas" se coge el 12
                  if(aPalabraChat[parseInt(j)-1] &&  !aPalabraChat[parseInt(j)-1].detallePalabra && !isNaN(aPalabraChat[parseInt(j)-2].palabra)){
                    

                    if(isNaN(this.aConversacion.Emocion[t].Palabra)){
                      //se coje la trasanterior palabra ejemplo 12 de enero
                      if(aPalabraChat[parseInt(j)-2] &&  !aPalabraChat[parseInt(j)-2].detallePalabra && !isNaN(aPalabraChat[parseInt(j)-2].palabra)){


                        
                        aPalabraChat[j].palabra=aPalabraChat[parseInt(j)-2].palabra+" "+aPalabraChat[parseInt(j)-1].palabra+" "+aPalabraChat[j].palabra;

                        aPalabraChat[parseInt(j)-1].palabra=undefined;
                        aPalabraChat[parseInt(j)-2].palabra=undefined;

                        

                      }
                      //aPalabraChat[parseInt(j)-1].detallePalabra= this.aConversacion.Emocion[t];
                    }
                    //aPalabraChat[parseInt(j)-1].detallePalabra.dato_auxiliar=true;
                    //todo arreglar que se hereda dato_auxiliar e información relevante
                  }
                  else{
                    if(!isNaN(aPalabraChat[parseInt(j)-1].palabra)){
                      aPalabraChat[j].palabra=aPalabraChat[parseInt(j)-1].palabra+ " "+aPalabraChat[j].palabra;
                      aPalabraChat[parseInt(j)-1].palabra= undefined;

                    }

                  }
                }
                aPalabraChat[j].detallePalabra.informacion_relevante=true;
                 let score= parseInt(this.aConversacion.Emocion[t].score);
                if ( score>= -5 && score <=5 ) { 
 
 
                //if (!this.aConversacion.Emocion[t].Tipo && !this.aConversacion.Emocion[t].Entidad) {
                  let sentimiento = "";
                  if (score > 0) {
                    sentimiento = "positivo";
                  }
                  else if (score < 0) {
                    sentimiento = "negativo";
                  }
                  /*if (score == 0 && this.aConversacion.Emocion[t]['Emocion']=="neutro" && this.aConversacion.Emocion[t]['SubEmocion']=="neutro" && this.aConversacion.Emocion[t]['Tipo']=="") {
                    aPalabraChat[j].detallePalabra.tipo2="sinrelevancia";
                  }*/
  
                  if (this.aConversacion.Emocion[t]['SubEmocion'] != "Superlativos" && this.aConversacion.Emocion[t]['SubEmocion'] != "Negaciones" && this.aConversacion.Emocion[t]['SubEmocion']!=""  ) {
                    aPalabraChat[j].detallePalabra.sentimiento = sentimiento;
                    /**/
                  }
//&& this.aConversacion.Emocion[t]['Tipo']=="" 
                  if (score == 0 && this.aConversacion.Emocion[t]['Emocion']=="neutro" && this.aConversacion.Emocion[t]['SubEmocion']=="neutro" && this.aConversacion.Emocion[t]['Tipo']=="" && this.aConversacion.Emocion[t]['Entidad']=="") {
                    aPalabraChat[j].detallePalabra.tipo2="sinrelevancia";

                  }
                 
            

                }

                else {
                  //superlaciones, negaciones y nuetros
                  //aPalabraChat[j].detallePalabra.tipo2 = this.aConversacion.Emocion[t]["SubEmocion"];
                    aPalabraChat[j].detallePalabra.tipo2="sinrelevancia";
                  

                }


                //else {
                  //console.log(this.aConversacion.Emocion[t]["Palabra"])
                  //agregando las categorias para el dendrogama
                  //evitar las categorias vacias
                  if (this.aConversacion.Emocion[t]["Entidad"]) {
                    //la llave principal es la categoria
                    if (!this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]) {
                      this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]] = [];
                      this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["ocurrencias"] = 0;
                      this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["score"]=0;
                    }
                    //ocurrencias de la categoria
                    this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["ocurrencias"] = this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["ocurrencias"] + 1;
                    this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["score"]= parseInt(this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]]["score"]) + parseInt(this.aConversacion.Emocion[t]["score"]);
                    if ((this.aConversacion.Emocion[t]["subCategoria"] != " ") || (!this.aConversacion.Emocion[t]["subCategoria"])) {
                      //quitando subcategorias duplicadas
                      let subcategoria_duplicada = false;
                      for (var n = 0; n < this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]].length; n++) {

                        if (this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]][n]["label"] == this.aConversacion.Emocion[t]["subCategoria"]) {
                          subcategoria_duplicada = true;
                          //sumador de subcategorias
                          this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]][n]["ocurrencias"] = this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]][n]["ocurrencias"] + 1;
                          //this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]][n]["score"] = this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]][n]["score"] + this.aConversacion.Emocion[t]["score"];
                          break;
                        }
                      }
                      if (!subcategoria_duplicada) {
                        //este objeto es para la subcategoria
                        this.aCategorias[this.aConversacion.Emocion[t]["Entidad"]].push(
                          { 

                            "id": this.aConversacion.Emocion[t]["Palabra"],
                            //entidad
                            "group": this.ServicesProvider.fn_quitarAcentos(this.aConversacion.Emocion[t]["Entidad"]),
                            "image": null,
                            "label": this.aConversacion.Emocion[t]["subCategoria"],
                            "ocurrencias": 1,
                            "score":parseInt(this.aConversacion.Emocion[t].score),
                            "contexto":this.aConversacion.Emocion[t].Contexto,
                            "sentimiento":this.aConversacion.Emocion[t].sentimiento
                          }
                        );
                      }

                    }

                  }

                //}


                break;
              }
            }
          }
        }

        //array con palabra a palabra
        this.aConversacion.Chat[i].aPalabras = aPalabraChat;
      }

      this.config.pagination = this.pagination;
      /*let viewport: any = document.querySelector('.app')
      let content: any = document.querySelector('.app-inner')

      let sb = new ScrollBooster({
        viewport,
        content,
        mode: 'y',
        onUpdate: (data) => {
          content.style.transform = `translate(
            ${-data.position.x}px,
            ${-data.position.y}px
          )`
          // and also metrics: data.viewport['width'|'height'] and data.cotent['width'|'height']
        },
      })
      setTimeout(() => {
        //necesario para hacer funcionar chat
        window.dispatchEvent(new Event('resize'));
      })*/
      /*fin pagina 1*/


      this.fn_drawDendograma();
      this.fn_MarcarCategoriasSeleccionadas();

      /* dendograma emocion
      */


    }, (_fail: any) => {
      this.ServicesProvider.preloaderOff();
      this.ServicesProvider.generarPopupGenerico("Error", "Ha ocurrido un problema, por favor intentalo de nuevo", null);
    });


  }


  ngOnInit() {
    this.ServicesProvider.preloaderOn();
    setTimeout(()=>{
      this.ServicesProvider.getjson("./assets/data/datageneral.json",{}).then(data=>{
        this.oVistaGeneral=data[0];
        this.fn_drawMap();
        this.fn_drawPie();
        this.fn_drawDendogramaGeneral();
        this.ServicesProvider.preloaderOff();

        



      })
  
    },3000);

    this.fn_llenarCategoriasSeleccionadas();

    setTimeout(()=>{
      this.fn_getConversacion(0);

    },6000)

    setTimeout(()=>{
      //hack para no mostrar por defecto cuando se cargue la demo
     document.getElementById("mostrar").click(); 
    })
/*    setTimeout(()=>{
      this.fn_getConversacion(1);

    },10000)


    setTimeout(()=>{
      this.fn_getConversacion(2);

    },20000)
*/


    /*  
    setTimeout(()=>{
        var elems = document.querySelectorAll('.fixed-action-btn');
        console.log(elems);
        var instances = M.FloatingActionButton.init(elems);
    
       },1000)
    */



  }
  //muestra los elementos con la clase seleccionada
  fn_highlightMun(categoria:any){


    //municipio son todos los municipios, se pondrán opacos para resaltar a la selecicon de la clase
    //d3.selectAll("#mapa_caldas path, #mapa_caldas "+" .municipio_cuadro").transition().style("opacity",0.1);
    if(filtrosMapa.includes(categoria)){
      d3.selectAll("#mapa_caldas ."+categoria).transition().duration(500).style("opacity",0.1);
      let index=filtrosMapa.indexOf(categoria);
      filtrosMapa.splice(index,1);
    }
    else{
      filtrosMapa.push(categoria);
      d3.selectAll("#mapa_caldas ."+categoria).transition().duration(500).style("opacity",1);
    }
  }

  fn_highlightMunOut(categoria:any){
    //municipio son todos los municipios, se pondrán opacos para resaltar a la selecicon de la clase
    d3.selectAll("#mapa_caldas path, #mapa_caldas "+".municipio_cuadro").transition().duration(500).style("opacity",1);
  }

  fn_fullScreenGeneral(id_contenedor:any){
    document.querySelector("#"+id_contenedor).classList.add("fullscreen");
  }

  fn_drawMap() {
    self=this;
    var data = this.oVistaGeneral.sentiment_map[0];
    //balboa belen de humbria mistrato
   


    let tamanoMapa = document.getElementById('mapa_caldas');
    var width = tamanoMapa.offsetWidth;
    var height = tamanoMapa.offsetHeight;

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', self.zoomedMap);




    var color = d3.scaleLinear()
      .domain([0, 100])
      .range(["#A1E5A0", "#09008D"]);

    //var projection = d3.geo.mercator()
    /*var projection = d3.geoMercator()
        .scale(height*35)
        // Center the Map in Colombia
        .center([-75.4, 5.4])
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()
        .projection(projection);*/

    // Set svg width & height
    var svg = d3.select('#mapa_caldas').append("svg")
      .attr('width', width)
      .attr('height', height);




    svg.call(zoom);
    g_map = svg.append('g');

    var mapLayer = g_map.classed('map-layer', true);




    // Load map data
    //d3.json('map2.geojson', function(error, mapData) {
    //d3.json('Colombia.json', function(error, mapData) {

    d3.json('./assets/data/caldas.geojson').then(function (mapData) {
      var features = mapData;
      /*  var projection = d3.geoMercator()
        .scale(height*35)
        // Center the Map in Colombia
        .center([-75.4, 5.4])
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()
        .projection(projection)
    */

      var projection = self.fn_fitProjection(d3.geoMercator(), features, [[0, 0], [width, height]], true)
      var path = d3.geoPath()
        .projection(projection);

/*        var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes);


        NodeCircleEnterGeneral =
        node.enter().append("g");


      NodeCircleEnterGeneral.append("circle")


      NodeCircleEnterGeneral.append("text").attr("class", "fa fa-user");


      images = NodeCircleEnterGeneral
        //filtrar los nodos que no tengan imagen
        .filter(function (d, i) { // <-E
          return d.image != null;
        })
*/



        var elementosMapa=g_map.selectAll('path')
        .data(features.filter(function (d) { return data[d.properties.name] != undefined; }))

        var grupoMapa=elementosMapa.enter().append('g');

        var MapaPath=grupoMapa.append('path').classed('map-layer', true)
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr("fill", function (d) {
          //var valor = parseInt((Math.floor(Math.random() * 10) + 0));
          return self.oSentimiento[data[d.properties.name].sentimiento];
          //return color(data[d.properties.name]);
        })
        .attr("class", function (d) {

          //var valor = parseInt((Math.floor(Math.random() * 10) + 0));
          return data[d.properties.name].sentimiento;
          //return color(data[d.properties.name]);
        })

        .attr("text", function (d) {
          return data[d.properties.name];
        })
        .attr('vector-effect', 'non-scaling-stroke')
        .on("mouseover", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .0);
          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        });


        /*
        grupoMapa
        .append("text")
        .text(function (d) {
          return data[d.properties.name];
        })
        .attr("x", function (d) {
          return path.centroid(d)[0];
        })
        .attr("y", function (d) {
          return path.centroid(d)[1];
        })
        .style('fill', 'white')
        .attr("text-anchor", "middle")
        .attr('font-size', '7pt')
        .attr('color', 'black');
*/
        

/*        grupoMapa.selectAll("text")
        .data(features)
        .enter()
        .append("svg:text")
        .text(function (d) {
          return data[d.properties.name];
        })
        .attr("x", function (d) {
          return path.centroid(d)[0];
        })
        .attr("y", function (d) {
          return path.centroid(d)[1];
        })
        .style('fill', 'white')
        .attr("text-anchor", "middle")
        .attr('font-size', '7pt')
        .attr('color', 'black');
*/


      /*
       features.forEach(function(feature) {
         if(feature.geometry.type == "MultiPolygon") {
           feature.geometry.coordinates.forEach(function(polygon) {
              
             polygon.forEach(function(ring) {
               ring.reverse();
             })
           })
         }
         else if (feature.geometry.type == "Polygon") {
           feature.geometry.coordinates.forEach(function(ring) {
             ring.reverse();
           })  
         }
       })
      console.log(JSON.stringify(features));*/


      // Draw each province as a path
      /*  mapLayer.selectAll('path')
            .data(features.filter(function(d){return data[d.properties.name]!=undefined;}))
      
            .enter().append('path')
            .attr('d', path)
            .attr("fill", function (d) {
                //var valor = parseInt((Math.floor(Math.random() * 10) + 0));
                return color(data[d.properties.name]);
            })
            .attr("text", function (d) {
                return data[d.properties.name];
            })
            .attr('vector-effect', 'non-scaling-stroke')
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .0);
                tooltip.html(d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            });
        mapLayer.selectAll("text")
            .data(features)
            .enter()
            .append("svg:text")
            .text(function (d) {
                return data[d.properties.name];
            })
            .attr("x", function (d) {
                return path.centroid(d)[0];
            })
            .attr("y", function (d) {
                return path.centroid(d)[1];
            })
            .style('fill','white')
            .attr("text-anchor", "middle")
            .attr('font-size', '7pt')
            .attr('color', 'black');
    */


      /*.style('fill', fillFn)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('click', clicked);*/
    });
  }

  fn_getbyNiu() {
    /*this.ServicesProvider.preloaderOn();
      this.ServicesProvider.post(SERVICES.GETBYNIU,  this.parametros,true).then(data=>{
        console.log(data);
        this.aDataUser=data[0];
        console.log(this.aDataUser);
        this.ServicesProvider.preloaderOff();
      }, _fail => {
        this.ServicesProvider.preloaderOff();
        this.ServicesProvider.generarPopupGenerico("Error", "Ha ocurrido un problema, por favor intentalo de nuevo",null);
      });
      */

  }


  public onIndexChange(index: number): void {
    this.bInstruccionInicial = true;
    /*this.bTitulos = true;

    setTimeout(() => {
      this.bTitulos = false;
    }, 2000)
*/
    //2 debe ser las emociones generales
    /*if (index == 2) {
      setTimeout(() => {
        this.bDisplay = false;
      }, 500)


    }
    if (index != 2) {
      setTimeout(() => {
        this.bDisplay = true;
      }, 500)

    }*/

  }
  public onSwiperEvent(event: string): void {

   if (event == "transitionStart") {
      this.bTitulos = true;

    }
    else {
      this.bTitulos = false;

    }

  }


}