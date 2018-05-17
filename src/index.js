/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000)
    })
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    const xhr = new XMLHttpRequest();
    const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise((resolve, reject) => {
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.send();

        xhr.addEventListener('load', () => {
            if (xhr.status >= 400) {
                reject()
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

export {
    delayPromise,
    loadAndSortTowns
};
