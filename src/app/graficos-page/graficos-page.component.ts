import { Chart, ChartModule } from 'angular-highcharts';
import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, Directive,  ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActionSheetController,Animation, AnimationController, IonIcon, IonicModule } from '@ionic/angular';
import { Publicacion } from 'src/app/entities/publicacion';
import { AngularMaterialModule } from 'src/app/material/angular-material.module';
import { PublicacionesService } from '../services/publicaciones.service';
import { take } from 'rxjs';
import { ChartService } from 'angular-highcharts/lib/chart.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Component({
  selector: 'app-graficos-page',
  templateUrl: './graficos-page.component.html',
  styleUrls: ['./graficos-page.component.scss'],
  standalone : true,
  imports: [IonicModule, CommonModule, AngularMaterialModule, ChartModule, SpinnerComponent]
})
export class GraficosPageComponent  implements OnInit, AfterViewChecked {

  loading = true;

  cosasLindasChart? : Chart;
  cosasFeasChart? : Chart;
  public srcSelectedImg? : string;

  constructor(private publicacionesService : PublicacionesService, private cdRef : ChangeDetectorRef) { }

  ngOnInit() {
    this.constructInformes();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  async constructInformes(){
    this.loading = true;
    const publicacionesBuenas = await this.publicacionesService.getBuenasPublicaciones().pipe(take(1));
    const publicacionesMalas = await this.publicacionesService.getMalasPublicaciones().pipe(take(1));

    publicacionesBuenas.subscribe((docChanges) => {
      const publicaciones = docChanges.map((snap : any)=> {
        const p =  snap.payload.doc.data() as Publicacion;
        p.id = snap.payload.doc.id;
        return p
      })
      this.loadCosasLindasChart(this.getTopPublicaciones(publicaciones,5))
    });
    publicacionesMalas.subscribe((docChanges) => {
      const publicaciones = docChanges.map((snap : any)=> {
        const p =  snap.payload.doc.data() as Publicacion;
        p.id = snap.payload.doc.id;
        return p
      })
      this.loadCosasFeasChart(this.getTopPublicaciones(publicaciones,5))
    });
    this.loading = false;
  }

  loadCosasLindasChart(publicaciones : any[]){
    this.cosasLindasChart = new Chart ({
      chart: {
        type: 'pie',
        backgroundColor : '#effbf1'
      },
      title: {
        text: 'Cosas Lindas más Votadas'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function() {
                console.log(publicaciones[this.index]);
              }
            }
          }
        }
      },
      series: [
        {
          type : 'pie',
          name: 'Votos',
          data: publicaciones.map(p  => {
              return [p.user.userName,p.likes.length]
            })
        }
      ]
    });
  }

  loadCosasFeasChart(publicaciones : any[]){
    this.cosasFeasChart = new Chart ({
      chart: {
        type: 'column',
        backgroundColor : '#fce7e7'
      },
      title: {
        text: 'Cosas Feas más odiadas',
        align : 'center'
      },
      credits: {
        enabled: false
      },
      xAxis : {
        categories : publicaciones.map(p  => p.user.userName),
        crosshair: true,
        accessibility: {
            description: 'Votos'
        }
      },
      yAxis: {
        min: 0,
        tickInterval : 1,
        title: {
            text: 'Votos'
        }
      },
      plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
          point: {
            events: {
              click: function() {
                console.log(publicaciones[this.index]);
              }
            }
          }
        }
     },
      series: [
        {
          type : 'column',
          name: 'Votos',
          showInLegend : false,
          data: publicaciones.map(p  => p.likes.length),
          color : '#7400b3'
        }
      ]
    });
  }

  getTopPublicaciones(publicaciones : any[], nrDePublicaciones : number){
    return publicaciones
    .filter(p => p.likes.length > 0)
    .sort((a : any, b : any) => {
      let pubA : Publicacion = {...a};
      let pubB : Publicacion = {...b};
      let likesA : number = pubA.likes.length;
      let likesB : number = pubB.likes.length;
      return likesB - likesA;
    })
    .slice(0, nrDePublicaciones);
  }

  setSelectedImg(photoUrl : string){
    this.srcSelectedImg = photoUrl;
  }
}