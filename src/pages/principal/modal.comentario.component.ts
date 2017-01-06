import {Component } from '@angular/core';
import {NavParams, ViewController,LoadingController, ToastController} from 'ionic-angular';
import {MainService} from "../../app/main.service";

@Component({
    selector: 'modal-comentario',
    templateUrl: './modal.comentario.component.html'
})
export class ModalComentario {

    publicacion:any;
    comentario:any;
    constructor(public params:NavParams,
                public viewCtrl:ViewController,
                public toastCtrl:ToastController,
                public mainService:MainService, public loadingCtrl:LoadingController) {
        this.publicacion = this.params.get('publicacion');

        console.log(this.publicacion);
    }

    ngOnInit() {

    }

    dismiss () {

        this.viewCtrl.dismiss(false);
    }

    comentar() {
        if (this.comentario) {
            let loader = this.loadingCtrl.create({
                content: "Enviando comentario",
                // duration: 6000
            });
            loader.present();

            this.mainService.postComentarPublicacion(this.publicacion.id , 3, this.comentario).subscribe((data)=> {
                this.comentario = '';
                loader.dismissAll();
                this.viewCtrl.dismiss(false);

            }, (error)=>{
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: "No se ha podido enviar el comentario. Intentelo nuevamente a la brevedad.",
                    duration: 3250,
                    position: 'center'
                });

                toast.present(toast);
            });
        }

    }




}