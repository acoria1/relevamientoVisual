import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { Publicacion } from 'src/app/entities/publicacion';
import { Feature } from 'src/app/interfaces/feature';
import { AngularMaterialModule } from 'src/app/material/angular-material.module';
import { PhotoService} from 'src/app/services/photo.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { PublicacionDetalleComponent } from "../publicacion-detalle/publicacion-detalle.component";
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/entities/user';
import { SpinnerComponent } from "../spinner/spinner.component";
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-photo-galery',
    templateUrl: './photo-galery.component.html',
    styleUrls: ['./photo-galery.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, AngularMaterialModule, PublicacionDetalleComponent, SpinnerComponent]
})
export class PhotoGaleryComponent  implements OnInit {

  @Input() tipoPublicacion? : 'Buena' | 'Mala' | 'Propias';

  public publicacionesConLikes$ = new Observable<{publicacion : Publicacion, liked : boolean}[] | undefined>();
  public imagenesCargadasCount : number = 0;
  uploadingPhoto = false;

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController, public publicacionesService : PublicacionesService, private usersService : UsersService) {
  }

  ngOnInit() {
    
  }
  
  ngOnChanges(changes: SimpleChanges){
    if (this.usersService.auth.isLoggedIn && changes["tipoPublicacion"]){
      this.imagenesCargadasCount = 0;
      this.createStreamPublicaciones();
    }
  }

  private createStreamPublicaciones () {
    this.publicacionesConLikes$ = this.getSelectedPublicaciones()
      .pipe(
        map((publicaciones)=> {
          this.imagenesCargadasCount = 0;
          return publicaciones
          .map((snap : any)=> {
            const p =  snap.payload.doc.data() as Publicacion
            p.id = snap.payload.doc.id;
            return {
              publicacion : p,
              liked : p.likes.findIndex(l => l.userID == this.usersService.getCurrentUser().uid) >= 0
            }
          })
          .filter((obj : any) => 
            (this.tipoPublicacion == 'Propias' && obj.publicacion.user.userID == this.usersService.getCurrentUser().uid) 
            || 
            this.tipoPublicacion != 'Propias')
          .sort((a : {publicacion : any, liked : boolean}, b : {publicacion : any, liked : boolean}) => {
            let dateA : Date = new Date(parseInt(a.publicacion.fechaCreacion));
            let dateB : Date = new Date(parseInt(b.publicacion.fechaCreacion));
            return (dateA < dateB) ? 1 : -1;
          })
          }
        )
      )
    }

  getSelectedPublicaciones() : Observable<any>{
    switch (this.tipoPublicacion) {
      case 'Buena':
        return this.publicacionesService.getBuenasPublicaciones();
      case 'Mala':
        return this.publicacionesService.getMalasPublicaciones();
      case 'Propias':
        return this.publicacionesService.getPublicaciones();
      default:
        return this.publicacionesService.getPublicaciones();
    }
  }


  public publicacionClickeada(idPublicacion : string){
    this.publicacionesService.toggleLike(idPublicacion, this.usersService.getCurrentUser().uid);
  }

  imagenCargada(event : any){
    this.imagenesCargadasCount++;
  }

  async handleRealizarPublicacion(){
  this.uploadingPhoto = true;
  await this.publicacionesService.realizarPublicacion(this.tipoPublicacion == 'Propias' ? undefined : this.tipoPublicacion);
  this.uploadingPhoto = false;
  }

  deleteRequestReceived(idPublicacion : string){
    this.showActionSheet(idPublicacion);
  }

  public async showActionSheet(idPublicacion : string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Confirmar',
      cssClass:"photo-options-sheet",
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.imagenesCargadasCount--;
          this.publicacionesService.deletePublicacion(idPublicacion);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    // this.ref?.unsubscribe();
  }

}
