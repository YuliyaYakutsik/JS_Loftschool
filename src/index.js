/* ДЗ 4 - работа с DOM */

/*
 Задание 1:

 1.1: Функция должна создать элемент с тегом DIV

 1.2: В созданный элемент необходимо поместить текст, переданный в параметр text

 Пример:
   createDivWithText('loftschool') // создаст элемент div, поместит в него 'loftschool' и вернет созданный элемент
 */
function createDivWithText(text) {
    let element = document.createElement('div');

    element.textContent = text;

    return element;
}

/*
 Задание 2:

 Функция должна вставлять элемент, переданный в параметре what в начало элемента, переданного в параметре where

 Пример:
   prepend(document.querySelector('#one'), document.querySelector('#two')) 
   // добавит элемент переданный первым аргументом в начало элемента переданного вторым аргументом
 */
function prepend(what, where) {
    let firstChild = where.firstChild;

    where.insertBefore(what, firstChild);
}

/*
 Задание 3:

 3.1: Функция должна перебрать все дочерние элементы узла, переданного в параметре where

 3.2: Функция должна вернуть массив, состоящий из тех дочерних элементов,
 следующим соседом которых является элемент с тегом P

 Пример:
   Представим, что есть разметка:
   <body>
      <div></div>
      <p></p>
      <a></a>
      <span></span>
      <p></p>
   </body>

   findAllPSiblings(document.body) // функция должна вернуть массив с элементами div и span,
   т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    let children = where.children;
    let result = [];

    for (let element of children) {
        if (element.nextElementSibling && element.nextElementSibling.tagName.toLowerCase() === 'p') {
            result.push(element);
        }
    }

    return result;
}

/*
 Задание 4:

 Функция представленная ниже, перебирает все дочерние узлы типа "элемент" внутри узла,
 переданного в параметре where и возвращает массив из текстового содержимого найденных элементов
 Но похоже, что в код функции закралась ошибка и она работает не так, как описано.

 Необходимо найти и исправить ошибку в коде так, чтобы функция работала так, как описано выше.

 Пример:
   Представим, что есть разметка:
   <body>
      <div>привет</div>
      <div>loftschool</div>
   </dody>

   findError(document.body) // функция должна вернуть массив с элементами 'привет' и 'loftschool'
 */
function findError(where) {
    var result = [];

    for (var child of where.children) {
        result.push(child.innerText);
    }

    return result;
}

/*
 Задание 5:

 Функция должна перебрать все дочерние узлы элемента переданного в параметре where и удалить из него все текстовые узлы

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
   должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
    let elements = where.childNodes;

    for (let element of elements) {
        if (element.nodeType === 3) {
            element.remove();
        }
    }
}

/*
 Задание 6:

 Выполнить предудыщее задание с использованием рекурсии - то есть необходимо заходить
 внутрь каждого дочернего элемента (углубляться в дерево)

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
   должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
    let elements = where.childNodes;

    for (let i = 0; i < elements.length; i++) {
        if (elements[i].nodeType === 3) {
            elements[i].remove();
            --i;
        } else if (elements[i].childNodes.length) {
            deleteTextNodesRecursive(elements[i]);
        }
    }
}

/*
 Задание 7 *:

 Необходимо собрать статистику по всем узлам внутри элемента переданного в параметре root и вернуть ее в виде объекта
 Статистика должна содержать:
 - количество текстовых узлов
 - количество элементов каждого класса
 - количество элементов каждого тега
 Для работы с классами рекомендуется использовать classList
 Постарайтесь не создавать глобальных переменных

 Пример:
   Для дерева <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
   должен быть возвращен такой объект:
   {
     tags: { DIV: 1, B: 2},
     classes: { "some-class-1": 2, "some-class-2": 1 },
     texts: 3
   }
 */
function collectDOMStat(root) {
    const statistics = {
        tags: {},
        classes: {},
        texts: 0
    };

    function statisticsCount(item) {
        let elements = item.childNodes;

        for (const element of elements) {
            if (element.nodeType === 3) {
                statistics.texts += 1;
            } else if (element.nodeType === 1) {
                let elementTag = element.tagName;
                let elementClasses = element.classList;

                if (statistics.tags[elementTag]) {
                    statistics.tags[elementTag] += 1;
                } else {
                    statistics.tags[elementTag] = 1;
                }

                for (const eachClass of elementClasses) {
                    if (statistics.classes[eachClass]) {
                        statistics.classes[eachClass] += 1;
                    } else {
                        statistics.classes[eachClass] = 1;
                    }  
                }
            }

            if (element.childNodes.length) {
                statisticsCount(element);
            }
        }
    }

    statisticsCount(root);

    return statistics;
}

/*
 Задание 8 *:

 8.1: Функция должна отслеживать добавление и удаление элементов внутри элемента переданного в параметре where
 Как только в where добавляются или удаляются элементы,
 необходимо сообщать об этом при помощи вызова функции переданной в параметре fn

 8.2: При вызове fn необходимо передавать ей в качестве аргумента объект с двумя свойствами:
   - type: типа события (insert или remove)
   - nodes: массив из удаленных или добавленных элементов (в зависимости от события)

 8.3: Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов

 Рекомендуется использовать MutationObserver

 Пример:
   Если в where или в одного из его детей добавляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'insert',
     nodes: [div]
   }

   ------

   Если из where или из одного из его детей удаляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'remove',
     nodes: [div]
   }
 */
function observeChildNodes(where, fn) {
    // создаём экземпляр MutationObserver
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            let changesType = (mutation.addedNodes.length > 0) ? 'insert' : 'remove';
            let changesArray = (mutation.addedNodes.length > 0) ? mutation.addedNodes : mutation.removedNodes;
            let myArray = [];

            for (const item of changesArray) {
                myArray.push(item);
            }

            fn({ type: changesType, nodes: myArray });
        });    
    });

    // конфигурация нашего observer
    let config = { childList: true, subtree: true }; 

    // передаём целевой элемент и его конфигурацию в качестве аргументов
    observer.observe(where, config); 
}

export {
    createDivWithText,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};
