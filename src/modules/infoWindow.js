import renderFormTemplate from '../templates/reviewForm.hbs';
import { getActiveMarker, setActiveMarker } from './mapMarkers.js';

let activeInfoWindow;

/**
 * Возвращает активное инфоокно
 */
function getActiveInfoWindow() {
    return activeInfoWindow;
}

/**
 * Устанавливает новое активное инфоокно
 */
function setActiveInfoWindow(newWindow) {
    activeInfoWindow = newWindow;
}

/**
 * Возвращает адрес, который находится на клике мышкой
 */
function geocodeAddress(coords) {
    return ymaps.geocode(coords).then(result => {
        return result.geoObjects.get(0).getAddressLine();
    });
}

/**
 * Открывыет форму отзыва для отдельного объекта
 */
function openInfoWindow({ coords, clientX, clientY }) {

    return geocodeAddress(coords).then(result => {
        const address = result;
        const html = renderFormTemplate({ address: address });
        const container = document.querySelector('.geoOtzyv');
        const infoWindow = document.createElement('div');
        const left = (clientX + 380 > window.innerWidth ? clientX - 380 : clientX);
        const top = (clientY + 566 < window.innerHeight ? clientY : clientY - 566 > 0 ? clientY - 566 : 10);
            
        infoWindow.className = 'infoWindow';
        infoWindow.innerHTML = html;
        infoWindow.dataset.coords = JSON.stringify(coords);
        infoWindow.dataset.address = address;
        infoWindow.style.left = `${left}px`;
        infoWindow.style.top = `${top}px`;

        container.appendChild(infoWindow);
        setActiveInfoWindow(infoWindow);

        return address;
    });
}

/**
 * Закрывает форму
 */
function closeInfoWindow() {
    if (getActiveInfoWindow()) {
        getActiveInfoWindow().remove();
        setActiveInfoWindow(null);
        if (getActiveMarker()) {
            getActiveMarker().options.set({
                iconImageHref: 'src/images/marker_grey.png'
            });
            setActiveMarker(null);
        }
    }
}

export {
    getActiveInfoWindow,
    setActiveInfoWindow,
    openInfoWindow,
    closeInfoWindow
}

