import { getClusterer } from './initMap.js';
import { clickOnMarker } from './mapMarkers.js';
import myObj from './myObj.js';

/**
 * Добавляет отзывы из Localstorage на карту
 */
function addMarkersFromStorage() {
    if (localStorage.reviews) {
        let reviews = JSON.parse(localStorage.reviews);

        for (let key in reviews) {
            if (!myObj.hasKey(key)) {
                myObj.createKey(key);
            }

            for (let item of reviews[key]) {
                myObj.appendDataToKey(key, item);

                geocodeCoords(key).then(result => {
                    let coords = result;

                    const placemark = new ymaps.Placemark(coords, {
                        balloonContentPlace: item.place,
                        balloonContentAddress: `<a href="#" class="balloon__address__link" data-key=${JSON.stringify(coords)}>${key}</a>`,
                        balloonContentReview: item.review,
                        balloonContentDate: item.date
                    }, {
                        iconLayout: 'default#image',
                        iconImageHref: 'src/images/marker_grey.png'
                    });

                    placemark.events.add('click', clickOnMarker);
                    getClusterer().add(placemark);
                });
            }
        }
    }
}

/**
 * Возвращает координаты на карте по заданному адресу
 */
function geocodeCoords(address) {
    return ymaps.geocode(address).then(result => {
        return result.geoObjects.toArray()[0].geometry.getCoordinates();
    });
}

export {
    addMarkersFromStorage
}