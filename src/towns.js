/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    const xhr = new XMLHttpRequest();
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
    let loadingBlock = homeworkContainer.querySelector('#loading-block');
    const repeatButton = homeworkContainer.querySelector('.repeat-button');
    
    loadingBlock.textContent = 'Загрузка...';

    if (repeatButton) {
        repeatButton.remove();
    }

    return new Promise((resolve, reject) => {
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 400) {
                reject();
            } else {
                let result = xhr.response.sort((a, b) => a.name > b.name ? 1 : -1);

                resolve(result);
            }
        });

        xhr.addEventListener('error', () => {
            reject();
        });

        xhr.addEventListener('abort', () => {
            reject();
        });
    })
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0 && chunk;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let towns = [];

function checkLoadingTowns() {
    loadTowns()
        .then((towns) => {
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';

            towns = towns;
        }, () => {
            let button = document.createElement('button');
            
            loadingBlock.innerText = 'Не удалось загрузить города';
            button.innerText = 'Повторить';
            button.classList = 'repeat-button';

            button.addEventListener('click', () => {
                towns = checkLoadingTowns();
            });

            homeworkContainer.insertBefore(button, filterBlock);
        })
}

checkLoadingTowns();

filterInput.addEventListener('keyup', function() {
    let searchValue = filterInput.value;
    let fragment = document.createDocumentFragment();

    filterResult.innerHTML = '';

    loadTowns().then(towns => {
        for (let town of towns) {
            if (isMatching(town.name, searchValue)) {
                let div = document.createElement('div');

                div.textContent = town.name;
                fragment.appendChild(div);
            }
        }

        filterResult.appendChild(fragment);
    })
});

export {
    loadTowns,
    isMatching
};
