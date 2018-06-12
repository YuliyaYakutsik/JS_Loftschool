let myMap;
let myClusterer;

/**
 * Возвращает карту
 */
function getMap() {
    return myMap;
}

/**
 * Возвращает кластер
 */
function getClusterer() {
    return myClusterer;
}

/**
 * Инициализирует карту
 */
function initMap() {
    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // "raw" означает, что данные вставляем "как есть", без экранирования html.
        '<h2 class=balloon__place>{{ properties.balloonContentPlace|raw }}</h2>' +
        '<div class=balloon__address>{{ properties.balloonContentAddress|raw }}</div>' +
        '<div class=balloon__review>{{ properties.balloonContentReview|raw }}</div>' +
        '<div class=balloon__date>{{ properties.balloonContentDate|raw }}</div>'
    );

    myMap = new ymaps.Map('map', {
        center: [55.760458, 37.663541],
        zoom: 18
    });

    myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        preset: 'islands#invertedDarkOrangeClusterIcons',
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

    // Добавляем кластер на нашу карту
    myMap.geoObjects.add(myClusterer);
}

export {
    getMap,
    getClusterer,
    initMap
}