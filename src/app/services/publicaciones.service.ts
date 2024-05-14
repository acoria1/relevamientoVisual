import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { FilesService } from './files.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Observable, lastValueFrom } from 'rxjs';
import { UserFactory } from '../entities/user-factory';
import { Publicacion } from '../entities/publicacion';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private publicaciones: AngularFirestoreCollection<any>;

  constructor(private _db : AngularFirestore, private filesService : FilesService, private platform: Platform, private usersService : UsersService) { 
    this.publicaciones = this._db.collection('rv_publicaciones');
  }

  getPublicaciones() : Observable<any>{
    return this.publicaciones.snapshotChanges();
  }

  getBuenasPublicaciones(){
    return this.getPublicacionesByFieldValue('tipo', "Buena");
  }

  getMalasPublicaciones(){
    return this.getPublicacionesByFieldValue('tipo', "Mala");
  }

  getPublicacionesByFieldValue(fieldName : string, fieldValue : any ){
    return this._db.collection('rv_publicaciones', ref => ref
    .where(fieldName,'==', fieldValue))
    .snapshotChanges();
  }

  async realizarPublicacion(tipoPublicacion? : 'Buena' | 'Mala' | undefined){
    let currentUser = this.usersService.getCurrentUser();
    let url : string = "";

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
    });

    let base64Data = await this.readAsBase64(capturedPhoto);
    if (base64Data.includes(',')){
      base64Data = base64Data.split(',')[1];
    }

    let fileName = `${currentUser.uid}_${Date.now()}`;
    try {
      url = await this.filesService.uploadBase64File(fileName, base64Data, {});
      let newPublicacion : Publicacion = {
      photoUrl : url,
      photoFileName : fileName,
      user : {
        userID : currentUser.uid, 
        userName : currentUser.nombre},
      fechaCreacion : `${Date.now()}`,
      tipo : tipoPublicacion,
      likes : []
    }
      let result = await this.publicaciones.add(newPublicacion);
      newPublicacion.id = result.id;
      return newPublicacion;
    } catch (error) {
      console.log(error)
    }
    return undefined;
  }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path ?? "",
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


  public async updatePublicacion(publicacion : Publicacion){
    this.publicaciones.doc(publicacion.id).set(publicacion);
  }

  public async deletePublicacion(idPublicacion : string){
    this.publicaciones.doc(idPublicacion).get().subscribe(doc => {
      this.publicaciones.doc(doc.id).delete();
      this.filesService.deleteFile(doc.data().photoFileName!);
    });
  }

  async toggleLike(idPublicacion : string, userID : string){
    let userName = (await lastValueFrom(this.usersService.getUsuario(userID))).data().nombre;
    this.publicaciones.doc(idPublicacion).get().subscribe(doc => {
      let p = doc.data() as Publicacion;
      p.id = doc.id;
      let userLikeIndex = p.likes.findIndex(like => like.userID === userID);
      if (userLikeIndex >= 0){
        p.likes.splice(userLikeIndex,1)
      } else {
        p.likes.push({ userID : userID, userName : userName})
      }
      this.updatePublicacion(p);
    });
  }

  public sortByDate(publicaciones : Publicacion[], ascDesc : 'asc' | 'desc' = 'asc'){
    return publicaciones
    .sort((a , b ) => {
      let dateA : Date = new Date(parseInt(a.fechaCreacion));
      let dateB : Date = new Date(parseInt(b.fechaCreacion));
      return ((dateA > dateB) ? 1 : -1) * (ascDesc === 'asc' ? 1 : -1);
    });
  }

  public mapLikes (publicaciones : Publicacion[]){
    return publicaciones
    .map((obj : Publicacion) => {
      const imgLikedbyuser : boolean = obj.likes.findIndex(l => l.userID == this.usersService.getCurrentUser().uid) >= 0 ? true : false;
      return {
        publicacion : obj,
        liked : imgLikedbyuser
      }
    })
  }
}
