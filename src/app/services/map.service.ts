import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

import {Layer} from '../models/layer.model';
import {Util} from '../utils/util';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    resetLayers = new Subject();

    clearMap = new Subject();

    reportTable = new Subject();

    showMarker = new Subject();

    reportTableButton = new Subject<boolean>();

    layerToolOpen = new Subject<object>();

    layerToolClose = new Subject();

    legendClose = new Subject();

    layerExtent = new Subject<Layer>();

    layerOpactity = new Subject<object>();

    layerSlider = new Subject<object>();

    clearMarkers = new Subject();

    constructor() {
    }

    getPopupContent(data, name, infoColumns = null) {
        let popupContent = '';
        let popupContentBody = '';
        Object.keys(data).forEach(key => {
            if (key === 'lat' || key === 'long') {
                return;
            }
            const column = infoColumns[key];
            let show = true;
            let alias;
            if (column) {
                alias = column.alias;
                show = column.show === true;
            } else {
                alias = key;
            }
            if (show) {
                if (alias === 'CPF/CNPJ') {
                    popupContentBody += `
                        <tr>
                           <td>${alias}</td>
                           <td>${this.formatterCpfCnpj(data[key])}</td>
                        </tr>`;
                } else {
                    popupContentBody += `
                        <tr>
                            <td>${alias}</td>
                            <td>${data[key]}</td>
                        </tr>`;
                }
            }
        });

        popupContent += `
            <br />
            <div class="table-responsive">
              <table class="table table-hover">
                  <thead><th colspan="2">${name}</th></thead>
                  ${popupContentBody}
              </table>
            </div>
        `;

        return popupContent;
    }

    formatterCpfCnpj(cpfCnpj) {
        if (cpfCnpj) {
            const listCpfCnpj = cpfCnpj.split(',');

            cpfCnpj = '';
            if (listCpfCnpj.length > 0) {
                listCpfCnpj.forEach(value => {
                    if (!cpfCnpj) {
                        cpfCnpj = Util.cpfCnpjMask(value);
                    } else {
                        cpfCnpj += `, ${Util.cpfCnpjMask(value)}`;
                    }
                });
            }
        }

        return cpfCnpj ? cpfCnpj : '';
    }
}
