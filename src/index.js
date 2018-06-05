import css from './styles/index.css';
import {reviewTemplate, reviewFormTemplate} from './templates.js';
import click from './containerClicks.js';
import myObj from './data.js';

let myMap = null;
let infoWindowIsOpened = null;
let myClusterer = null;
let added = 'hello';
let activeSinglMark = null;
let container = document.querySelector('.geoOtzyv');

/**
 * Карта загружена
 */
ymaps.ready(() => {
    container.addEventListener('click', clickOnContainer);
    initMap();
    click.myClick();
});

/**
 * Инициализирует карту
 */
function initMap() {
    myMap = new ymaps.Map("map", {
        center: [55.760458, 37.663541],
        zoom: 18
    });

    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // "raw" означает, что данные вставляем "как есть", без экранирования html.
        '<h2 class=balloon__place>{{ properties.balloonContentPlace|raw }}</h2>' +
        '<div class=balloon__address>{{ properties.balloonContentAddress|raw }}</div>' +
        '<div class=balloon__review>{{ properties.balloonContentReview|raw }}</div>' +
        '<div class=balloon__date>{{ properties.balloonContentDate|raw }}</div>'
    );

    myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterHideIconOnBalloonOpen: false,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
        // Настройка внешего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        // clusterBalloonPagerType: 'marker',
        // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
        // clusterBalloonCycling: false,
        // Можно отключить отображение меню навигации.
        // clusterBalloonPagerVisible: false
    });
    myMap.geoObjects.add(myClusterer);

    myMap.events.add('click', clickOnMap);

    myClusterer.balloon.events.add('open', closeForm);
}

/**
 * Обработывает клик по карте
 * @param {*} e 
 */
function clickOnMap(e) {
    const coords = e.get('coords');
    const clientX = e.get('domEvent').get('clientX');
    const clientY = e.get('domEvent').get('clientY');

    myClusterer.balloon.close(myClusterer.getClusters()[0]);
    closeForm();
    openInfo({coords, clientX, clientY}).catch(errorHandler);
}

/**
 * Возвращает адрес, который находится на клике мышкой
 */
function geocodeAddress(coords) {
    return ymaps.geocode(coords).then(result => {
        const address = result.geoObjects.get(0).getAddressLine();
        
        return address;
    });
}

/**
 * Открывыет форму отзыва для отдельного объекта
 */
function openInfo({coords, clientX, clientY}) {

    return geocodeAddress(coords).then(result => {
        const address = result;
        const render = Handlebars.compile(reviewFormTemplate);
        const html = render({address: address});
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
        infoWindowIsOpened = infoWindow;

        return address;
    });
}

/**
 * Перехватывает клики по инфоокну
 * @param {*} e 
 */
function clickOnContainer(e) {

    if (getElement(e.target, 'infoWindow__close__link')) {
        e.preventDefault();
        closeForm();
    }

    if (getElement(e.target, 'infoWindow__footer__link')) {
        e.preventDefault();
        addNewMarker();
    }
    
    if (getElement(e.target, 'balloon__address__link')) {
        e.preventDefault();
        const coords = JSON.parse(e.target.dataset.key);
        const clientX = e.clientX;
        const clientY = e.clientY;

        openInfo({coords, clientX, clientY}).then(address => {
            const data = myObj.getDataByKey(address);

            data.forEach(item => {
                addComment(item);
            });
        }).catch(errorHandler);
        myClusterer.balloon.close(myClusterer.getClusters()[0]);
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

/**
 * Закрывает форму
 */
function closeForm() {
    if (infoWindowIsOpened) {
        infoWindowIsOpened.remove();
        infoWindowIsOpened = null;
        if (activeSinglMark) {
            activeSinglMark.options.set({
                iconImageHref: 'src/images/marker_grey.png'
            });
            activeSinglMark = null;
        }
    }
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
        const key = JSON.parse(infoWindowIsOpened.dataset.coords);
        const address = infoWindowIsOpened.dataset.address;
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
        
        // Добавляем координаты расположения маркера в ключ markerCoords
        myPlacemark.markerCoords = key; 
        
        myPlacemark.events.add('click', clickOnMarker);

        myClusterer.add(myPlacemark);

        // Делаем метку активной после добавления на карте
        activeSinglMark = myPlacemark;

        if (myObj.hasKey(address)) {
            myObj.appendDataToKey(address, data);
        } else {
            myObj.createKey(address);
            myObj.appendDataToKey(address, data);
        }

        form.name.value = '';
        form.place.value = '';
        form.review.value = '';

        addComment(data);
    }
}

/**
 * Выводит дату в формате dd.mm.yyyy
 * @param {*} data 
 */
function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

/**
 * Добавляет комментарий на странице
 * @param {*} data 
 */
function addComment(data) {
    const reviewsList = container.querySelector('.reviews__list');
    const render = Handlebars.compile(reviewTemplate);
    const reviewsItem = document.createElement('li');
    const html = render(data);
    
    reviewsItem.className = 'reviews__item';
    reviewsItem.innerHTML = html;
    
    if (reviewsList.children.length === 0) {
        reviewsList.innerHTML = '';
        reviewsList.appendChild(reviewsItem);
    } else {
        reviewsList.appendChild(reviewsItem);
    }
}

/**
 * Обрабатывает клик по маркеру
 * @param {*} e 
 */
function clickOnMarker(e) {
    e.preventDefault();
    closeForm();
    myClusterer.balloon.close(myClusterer.getClusters()[0]);
    const placemark = e.get('target');

    activeSinglMark = placemark;

    placemark.options.set({
        iconImageHref: 'src/images/marker_orange.png'
    });

    const coords = placemark.markerCoords;
    const clientX = e.get('domEvent').get('clientX');
    const clientY = e.get('domEvent').get('clientY');

    openInfo({coords, clientX, clientY}).then((address) => {
        const data = myObj.getDataByKey(address);

        data.forEach(item => {
            addComment(item);
        });
    }).catch(errorHandler);
}

/**
 * Обработывает ошибки
 * @param {*} error 
 */
function errorHandler(error) {
    console.error(error);
}
