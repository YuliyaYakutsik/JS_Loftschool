import {getClusterer} from './initMap.js';
import {openInfoWindow, closeInfoWindow} from './infoWindow.js';
import {errorHandler} from './errorHandler.js';

/**
 * Обработывает клик по карте
 * @param {*} e 
 */
function clickOnMap(e) {
    const coords = e.get('coords');
    const clientX = e.get('domEvent').get('clientX');
    const clientY = e.get('domEvent').get('clientY');

    getClusterer().balloon.close(getClusterer().getClusters()[0]);
    closeInfoWindow();
    openInfoWindow({coords, clientX, clientY}).catch(errorHandler);
}

export {
    clickOnMap
}
