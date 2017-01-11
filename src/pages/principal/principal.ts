import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {ToastController, Slides} from "ionic-angular";
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";
import 'leaflet';
import {NavController, LoadingController} from 'ionic-angular';
import {Empresas} from "../empresas/empresas";
import {MapService} from './../../directives/map/map.service';
import {GeosearchComponent} from './../../directives/map/geosearch.component';
import {ModalMapa} from './modalMapa.component';

@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    @Output() locationFound = new EventEmitter();
    @ViewChild('mySlider') slider: Slides;


    tabs = "0";
    tabBody = 0;

    tipoPublicacion = "all";

    errorNoConexion = false;

    publicaciones: any[];

    promoCalendario: any;

    myDate = new Date();

    // filtros
    notificacionesOnda:any;
    ondas: any;

    showSearch:Boolean = false;

    search = "";

    constructor(private navController: NavController,
                public mainservice: MainService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public mapService: MapService) {
        this.mapService = mapService;

        this.doRefresh(false);

    }

    ngOnInit() {

    }

    onSlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        console.log("Current index is", currentIndex);
        this.tabBody = currentIndex;
        this.tabs = currentIndex.toString();
        if (this.tabs == "1") {
            this.pageEmpresas();
        }
        else if(this.tabs == "2"){
            this.getOndas();
        }
    }

    selectedTab() {
        this.slider.slideTo(+this.tabs, 500);
        this.tabBody = +this.tabs;
    }

    cancelarBusqueda(){
        console.log('cencelar');
        this.showSearch = false;
    }

    doRefresh(refresher, fields?) {

        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getUser().then((user) => {
            this.mainservice.getPublicaciones(user.userID,fields).subscribe((data) => {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err) => {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "Error en la conección a internet",
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);
                },
                () => {
                    loader.dismissAll();
                    this.errorNoConexion = false;
                    if (refresher) {
                        refresher.complete();
                    }

                }
            );
        }, () => {

            this.mainservice.getPublicaciones(null, fields).subscribe((data) => {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err) => {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "Error en la conección a internet",
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);
                },
                () => {
                    loader.dismissAll();
                    this.errorNoConexion = false;
                    if (refresher) {
                        refresher.complete();
                    }

                }
            );

        });


        this.mainservice.getPromoCalendario().subscribe((data) => {
            if (data) {
                this.promoCalendario = data[0];
            } else {
                this.promoCalendario = false;
            }


        }, (err) => {
            console.log('error timeout');

        });


    }


    modalSearch() {

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data) => {


            let fields = "fields=" + JSON.stringify(data);

            this.doRefresh(false, fields);
        });
    }

    modalRanking() {
        let modal = this.mainservice.modalCreate(GeosearchComponent);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    favPublicacion(id) {

    }


    modalEmpresas() {
        let modal = this.mainservice.modalCreate(Empresas);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    pageEmpresas() {
        this.navController.push(Empresas);
    }

    toastPromo(promo) {


        let toast = this.toastCtrl.create({
            message: promo.titulo + " Te lo desea: " + promo.nombre_empresa.toUpperCase(),
            duration: 2000,
            position: 'center'
        });

        toast.present(toast);
    }


    modalUbicaciones() {

        let loader = this.loadingCtrl.create({
            content: "Cargando empresas",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getAllEmpresas().toPromise()
            .then(response => {
                let param = {
                    empresas: response.json()
                }

                let modal = this.mainservice.modalCreate(ModalMapa, param);

                loader.dismissAll();
                modal.present();

                modal.onDidDismiss((data: any[]) => {
                    if (data) {
                    }
                });
            });

    }

    getOndas() {

        let loader = this.loadingCtrl.create({
            content: "Cargando...",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getOndas()
            .subscribe(
                (response) => {
                    this.ondas = response;
                    loader.dismissAll();

                },
                (err) => {
                    console.log('error timeout');
                    loader.dismissAll();
                }
            );
    }

}
