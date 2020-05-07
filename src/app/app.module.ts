import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import {NgbModule,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { routing, appRoutingProviders } from './app-routing.module'
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import { Ng2OdometerModule } from 'ng2-odometer'; // <-- import the module


import { ServicesProvider } from '../providers/services';
import { DatePipe } from '@angular/common';
import { fechahumana } from '../pipes/pipe-fechahumana';
import { fechaespanol } from '../pipes/pipe-fecha-espanol';
import { fecha_mes_espanol } from '../pipes/pipe-fecha-mes-espanol';
import { fechanormal } from '../pipes/pipe-fecha-normal';
import { ellipsis } from '../pipes/pipe-ellipsis';
import { pipekeys } from '../pipes/pipe-keys';
import { safepipe } from '../pipes/pipe-safe';
import { inicialesnombre } from '../pipes/pipe-iniciales-usuario';



import { SwiperModule, SwiperConfigInterface,
  SWIPER_CONFIG } from 'ngx-swiper-wrapper';
  const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    observer: true,
    direction: 'vertical',
    threshold: 50,
    spaceBetween: 5,
    slidesPerView: 1,
    centeredSlides: true
  };
  


import { NotFoundComponent,
         HomeComponent,
         LandingComponent,
         ModalComponent,
         GeneralComponent,
         AutocompletarComponent 
        } from '../pages/index.paginas';

//import * as M from "materialize-css/dist/js/materialize";
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LandingComponent,
    fechahumana,
    fechaespanol,
    fecha_mes_espanol,
    fechanormal,
    ellipsis,
    inicialesnombre,
    pipekeys,
    safepipe,
    ModalComponent,
    GeneralComponent,
    AutocompletarComponent
  ],
  imports: [
    BrowserModule,
    //NgbModule,
    NgbModule.forRoot(),
    Ng2OdometerModule.forRoot(), // <-- include it in your app module

    FormsModule,
    ReactiveFormsModule,
	  HttpModule,
    routing,

    SwiperModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },

  DatePipe,
  appRoutingProviders,
  ServicesProvider

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent
  ]

})
export class AppModule { }
