import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoGaleryComponent } from '../components/photo-galery/photo-galery.component';
import { GraficosPageComponent } from '../graficos-page/graficos-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, SpinnerComponent, CommonModule, PhotoGaleryComponent,GraficosPageComponent],
})
export class HomePage {
  signingOut : boolean = false;
  showGalery = false;
  showGraphs = false;
  tipoPublicacionesMostradas? : 'Buena' | 'Mala' | 'Propias';
  galeryTitleText = "Relevamiento Visual"

  constructor(public _auth: AuthService, private _router : Router) {}

  async handleSingOut(){
  this.signingOut = true;
  await setTimeout(() => {
      this._auth.SignOut().then(() => {
        this._router.navigate(['login']);
      });
    }, 2000);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let imageUrl = image.path;
    console.log(imageUrl);
  };

  homeIconClicked(){
    this.showGalery=false
    this.showGraphs = false;
    this.galeryTitleText = "Relevamiento Visual"
  }

  handleTakeGoodPicture(){
    this.takePicture();
  }

  handleTakeBadPicture(){
    this.takePicture();
  }

  mostrarBuenas(){
    this.tipoPublicacionesMostradas = 'Buena';
    this.galeryTitleText = "Cosas Lindas";
    this.showGalery = true;
    this.showGraphs = false;
  }

  mostrarMalas(){
    this.tipoPublicacionesMostradas = 'Mala';
    this.galeryTitleText = "Cosas Feas";
    this.showGalery = true;
    this.showGraphs = false;
  }

  mostrarPropias(){
    this.tipoPublicacionesMostradas = 'Propias';
    this.galeryTitleText = "Mis Fotos";
    this.showGalery = true;
    this.showGraphs = false;
  }

  mostrarGraficos(){
    this.showGalery = false;
    this.showGraphs = true;
    this.galeryTitleText = "Fotos Destacadas";
  }
}



