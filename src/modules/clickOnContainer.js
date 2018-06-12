import {openInfoWindow, closeInfoWindow} from './infoWindow.js';
import {addNewMarker} from './mapMarkers.js';
import myObj from './myObj.js';
import {addComment} from './addComment.js';
import {errorHandler} from './errorHandler.js';
import {getClusterer} from './initMap.js';

/**
 * Перехватывает клики по инфоокну
 * @param {*} e 
 */
function clickOnContainer(e) {

    if (getElement(e.target, 'infoWindow__close__link')) {
        e.preventDefault();
        closeInfoWindow();
    }

    if (getElement(e.target, 'infoWindow__footer__link')) {
        e.preventDefault();
        addNewMarker();
    }
    
    if (getElement(e.target, 'balloon__address__link')) {
        const coords = JSON.parse(e.target.dataset.key);
        const clientX = e.clientX;
        const clientY = e.clientY;

        e.preventDefault();
        openInfoWindow({coords, clientX, clientY}).then(address => {
            const data = myObj.getDataByKey(address);

            data.forEach(item => {
                addComment(item);
            });
        }).catch(errorHandler);
        getClusterer().balloon.close(getClusterer().getClusters()[0]);
    }
}

/**
 * Ищет у элемента либо у родителя заданный класс
 * @param {*} target - элемент
 */
function getElement(target, searchClass) {
    let element = target;

    do {
        if (element.classList.contains(searchClass)) {
            return element;
        }
    } while (element = element.parentElement);
    
    return false;
}

export {
    clickOnContainer
}
