import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ActionSheetController,Animation, AnimationController, IonIcon, IonicModule } from '@ionic/angular';
import { Publicacion } from 'src/app/entities/publicacion';
import { AngularMaterialModule } from 'src/app/material/angular-material.module';

@Component({
  selector: 'app-publicacion-detalle',
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss'],
  standalone : true,
  imports: [IonicModule, CommonModule, AngularMaterialModule]
})
export class PublicacionDetalleComponent  implements OnInit {

  @Input() publicacionConLikes? : {publicacion : Publicacion, liked : boolean};
  @Input() displayLikeButton : boolean = true;
  @Input() displayDeleteBtn : boolean = false;
  @Output() publicacionClicked = new EventEmitter<string>();
  @Output() deleteBtnClicked = new EventEmitter<string>();
  @Output() imageLoaded = new EventEmitter<void>();

  @ViewChild(IonIcon, { read: ElementRef }) heartIcon?: ElementRef<HTMLIonIconElement>;

  private animation?: Animation;
  public loadedImage : boolean = false;

  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.animation = this.animationCtrl
    .create()
    .addElement(this.heartIcon!.nativeElement)
    .duration(1000)
    .iterations(1)
    .keyframes([
      {offset : 0, transform: 'scale(1) rotate(0deg)'},
      {offset : 0.25, transform: 'scale(2) rotate(90deg)'},
      {offset : 0.5, transform: 'scale(3) rotate(180deg)'},
      {offset : 0.75, transform: 'scale(2) rotate(270deg)'},
      {offset : 1, transform: 'scale(1) rotate(360deg)'},
    ]);
  }

  onImageClicked(idPublicacionClikeada : string){
    this.animation!.play();
    setTimeout(() => {
      this.publicacionClicked.emit(idPublicacionClikeada);
    }, 1000);
  }

  onDeleteBtnClicked(idPublicacionClikeada : string){
    this.deleteBtnClicked.emit(idPublicacionClikeada);
  }

  onImageLoaded(){
    this.loadedImage = true;
    this.imageLoaded.emit();
  }
}
