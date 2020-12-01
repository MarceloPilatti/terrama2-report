import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';

import * as L from 'leaflet';

import {ConfigService} from './config.service';

import {PopupComponent} from '../components/map/popup/popup.component';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    constructor(private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private appRef: ApplicationRef,
                private configService: ConfigService
    ) {
    }

    register(marker: L.Marker, layerLabel: string, gid, codGroup, link: string): void {
        marker.on('click', $event => this.popup($event.target, layerLabel, gid, codGroup, link));
    }

    async popup(marker: L.Marker, layerLabel: string, gid, codGroup, link: string) {
        const data = await this.configService.getPopupInfo(gid, codGroup).then((response: Response) => response['data']);
        const reportLink = '/finalReport/';
        let linkDETER = null;
        let linkPRODES = null;
        let linkBurnlight = null;
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'DETER') {
            linkDETER = reportLink + 'deter/' + gid;
        }
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'PRODES') {
            linkPRODES = reportLink + 'prodes/' + gid;
        }
        if (codGroup === 'STATIC' || codGroup === 'CAR' || codGroup === 'BURNED') {
            linkBurnlight = reportLink + 'queimada/' + gid;
        }

        const cmpFactory = this.cfr.resolveComponentFactory(PopupComponent);
        const componentRef = cmpFactory.create(this.injector);
        componentRef.instance.link = link;
        componentRef.instance.linkDETER = linkDETER;
        componentRef.instance.linkPRODES = linkPRODES;
        componentRef.instance.linkBurnlight = linkBurnlight;
        componentRef.instance.layerLabel = layerLabel;
        componentRef.instance.tableData = data;
        this.appRef.attachView(componentRef.hostView);

        const popupContent = componentRef.location.nativeElement;
        marker.bindPopup(popupContent, {maxWidth: 500});
        marker.openPopup();
    }
}
