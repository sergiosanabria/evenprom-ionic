import {Component, Input} from '@angular/core';
import {ToastController, NavController} from "ionic-angular";
import {MainService} from "../app/main.service";
import {SocialSharing} from 'ionic-native';
import {ModalComentario} from "../pages/principal/modal.comentario.component";
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";


@Component({
    selector: 'item-list-empresa',
    templateUrl: 'empresa-list.html'

})
export class ItemListEmpresa {

    @Input() publicacion;
    @Input() isFirst;
    @Input() fecha;

    grupoFecha: any;


    constructor(public toastCtrl: ToastController,
                public mainservice: MainService,
                public navController: NavController) {

    }


    getMesByFecha(fecha) {

        let fechaHumana = fecha.split("-");

        let hoy = new Date();
        let fechaPubli = new Date(fechaHumana[2], fechaHumana[1] - 1, fechaHumana[0]);

        if (hoy.getTime() >= fechaPubli.getTime()) {
            fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
        } else {
            fecha = fechaPubli.getDate() + '-' + (fechaPubli.getMonth() + 1) + '-' + fechaPubli.getFullYear();
        }

        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let arrayFecha = fecha.split("-");

        let mes = meses[parseInt(arrayFecha[1]) - 1];


        return arrayFecha[0] + " " + mes.substring(0, 3);

    }


    modalComentario(publicacion) {

        this.mainservice.getUser()
            .then((user) => {
                let modal = this.mainservice.modalCreate(ModalComentario, {
                    publicacion: publicacion
                });

                modal.present();

                modal.onDidDismiss((data: any[]) => {
                    if (data) {
                        console.log(data);
                    }
                });
            }).catch(
            () => this.mainservice.sinUsuario()
        );

    }

    sharedTwitter(message: string, image?: string, url?: string) {


        SocialSharing.shareViaTwitter(message, image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    share(message: string, subject?: string, image?: string, url?: string) {


        SocialSharing.share(message, '@evenprom', image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    addPublicacionFav(id) {

        this.mainservice.getUser()
            .then((user) => {
                let url = 'favears/' + id + '/publicacions/' + user.userID;
                this.mainservice.post(url)
                    .then(
                        (data) => {
                            let mensaje = this.mainservice.getTranslate('agregadoFavoritos');

                            if (data.publicacion.like_persona == true) {
                                this.publicacion.likes += 1;
                            } else {
                                this.publicacion.likes -= 1;
                                mensaje = this.mainservice.getTranslate('sacadoFavoritos');
                            }
                            this.publicacion.like_persona = data.publicacion.like_persona;
                            let toast = this.toastCtrl.create({
                                message: mensaje,
                                duration: 2000,
                                position: 'bottom'
                            });

                            toast.present(toast);

                        });
            }).catch(() => {
            this.mainservice.sinUsuario();
        });


    }

    pagePublicacion(publicacion) {

        this.navController.push(ModalPreviewPublicacion, {publicacion: publicacion});
    }

}

