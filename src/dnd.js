/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
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
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    let newElement = document.createElement('div');
    let color = getColorRandom();
    let minSize = 10;
    let screenWidth = document.documentElement.clientWidth;
    let screenHeight = document.documentElement.clientHeight;
    let divWidth = minSize + Math.floor(Math.random() * (screenWidth-minSize));
    let divHeight = minSize + Math.floor(Math.random() * (screenHeight-minSize));
    let divPositionX = Math.floor(Math.random() * (screenWidth-divWidth));
    let divPositionY = Math.floor(Math.random() * (screenHeight-divHeight));

    function getColorRandom() {
        let possibleNumbers = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += possibleNumbers[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    newElement.classList.add('draggable-div');
    newElement.style.backgroundColor = color;
    newElement.style.width = `${divWidth}px`;
    newElement.style.height = `${divHeight}px`;
    newElement.style.position = 'absolute';
    newElement.style.left = `${divPositionX}px`;
    newElement.style.top = `${divPositionY}px`;
    newElement.style.cursor = 'move';
    newElement.draggable = true;

    return newElement;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners() {
    let element;
    let positionXOnDrag;
    let positionYOnDrag;
    let positionXOnDrop;
    let positionYOnDrop;

    document.addEventListener('dragstart', e => {
        if (e.target.tagName === 'DIV') {
            element = e.target;
            element.style.opacity = 0.5;
            positionXOnDrag = e.clientX - parseInt(element.style.left);
            positionYOnDrag = e.clientY - parseInt(element.style.top);
        }
    });

    document.addEventListener('dragover', e => {
        if (element) {
            e.preventDefault();
        }
    });

    document.addEventListener('drop', e => {
        if (element) {
            positionXOnDrop = e.clientX - positionXOnDrag;
            positionYOnDrop = e.clientY - positionYOnDrag;

            element.style.left = `${positionXOnDrop}px`;
            element.style.top = `${positionYOnDrop}px`;
            element.style.opacity = 1;
            element = undefined;
        }
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

addListeners();

export {
    createDiv
};
