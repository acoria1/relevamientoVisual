import { User } from "./user";

export interface Publicacion {
    id? : string;
    photoUrl: string;
    photoFileName? : string;
    user : {
        userID : string;
        userName : string;
    };
    likes : {
        userID : string;
        userName : string;
    }[];
    fechaCreacion : string;
    tipo? : 'Buena' | 'Mala' | undefined;
}

// export class PublicacionHandler{
//     public static toggleLike (publicacion : Publicacion, userID : string){
//         publicacion.likes.findIndex()
//     }
// }