import {getActiveInfoWindow, openInfoWindow, closeInfoWindow} from './infoWindow.js';
import {getClusterer} from './initMap.js';
import myObj from './myObj.js';
import {addComment} from './addComment.js';
import {errorHandler} from './errorHandler.js';

let activeMarker;

/**
 * Выводит дату в формате dd.mm.yyyy
 * @param {*} date 
 */
function formatDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear() % 100;

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

/**
 * Возвращает активный маркер
 */
function getActiveMarker() {
    return activeMarker;
}

/**
 * Устанавливает новый активный маркер
 */
function setActiveMarker(newMarker) {
    activeMarker = newMarker;
}

/**
 * Добавляет новый маркер
 */
function addNewMarker() {
    const form = document.forms.reviewsForm;
    const name = form.name.value.trim();
    const place = form.place.value.trim();
    const review = form.review.value.trim();

    if (name.length === 0 || place.length === 0 || review.length === 0) {
        alert('Заполните все поля');
    } else {
        const key = JSON.parse(getActiveInfoWindow().dataset.coords);
        const address = getActiveInfoWindow().dataset.address;
        const date = formatDate(new Date());
        const data = {name: name, place: place, review: review, date: date};
        const myPlacemark = new ymaps.Placemark(key, {
            balloonContentPlace: place,
            balloonContentAddress: `<a href="#" class="balloon__address__link" data-key=${JSON.stringify(key)}>${address}</a>`,
            balloonContentReview: review,
            balloonContentDate: date
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'src/images/marker_orange.png'
        });
        
        myPlacemark.events.add('click', clickOnMarker);

        getClusterer().add(myPlacemark);

        // Делаем метку активной после добавления на карте
        setActiveMarker(myPlacemark);

        if (!myObj.hasKey(address)) {
            myObj.createKey(address);
        }
            
        myObj.appendDataToKey(address, data);
        localStorage.reviews = JSON.stringify(myObj.getObject());

        form.name.value = '';
        form.place.value = '';
        form.review.value = '';

        addComment(data);
    }
}

/**
 * Обрабатывает клик по маркеру
 * @param {*} e 
 */
function clickOnMarker(e) {
    const placemark = e.get('target');
    const coords = placemark.geometry.getCoordinates();
    const clientX = e.get('domEvent').get('clientX');
    const clientY = e.get('domEvent').get('clientY');

    e.preventDefault();
    closeInfoWindow();
    getClusterer().balloon.close(getClusterer().getClusters()[0]);
    placemark.options.set({
        iconImageHref: 'src/images/marker_orange.png'
    });

    activeMarker = placemark;

    openInfoWindow({coords, clientX, clientY}).then((address) => {
        const data = myObj.getDataByKey(address);

        data.forEach(item => {
            addComment(item);
        });
    }).catch(errorHandler);
}

export {
    getActiveMarker,
    setActiveMarker,
    addNewMarker,
    clickOnMarker
}
