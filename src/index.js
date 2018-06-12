import './styles/index.css';
import { addMarkersFromStorage } from './modules/addMarkersFromStorage';
import { clickOnMap } from './modules/clickOnMap.js';
import { clickOnContainer } from './modules/clickOnContainer.js';
import { initMap, getMap, getClusterer } from './modules/initMap.js';
import { closeInfoWindow } from './modules/infoWindow.js';

/**
 * Карта загружена
 */
ymaps.ready(() => {
    initMap();

    // Если есть отзывы в LocalStorage, добавляем их на карту
    addMarkersFromStorage();

    // Добавляем обработку кликов по карте
    getMap().events.add('click', clickOnMap);

    // Добавляем обработку кликов на документе
    document.body.addEventListener('click', clickOnContainer);

    // Закрываем форму отзывов, если открываем балун
    getClusterer().balloon.events.add('open', closeInfoWindow);
});
