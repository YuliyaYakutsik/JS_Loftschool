import { renderFriends } from './renderFriends.js';

/**
 * Инициализирует фильтры, когда начинаем вводить текств текстовые поля
 * @param {*} params - объект со свойствами target: input; list: список, в котором искать значение из target; result: куда выводить отфильтрованные значения
 */
function initFilters(params) {
	params.forEach(item => {
		item.target.addEventListener('input', () => {
			filterLists(item.target, item.list, item.result);
		})
	})
}

/**
 * Проверяет, содержит ли одно значение другое значение
 * @param {*} input - текстовое поле, куда вводим значение
 * @param {*} list - список, в котором искать значение из input
 * @param {*} result - куда выводить отфильтрованные значения
 */
function filterLists(input, list, result) {
	let chunck = input.value;
	let filteredFriends = {items: []};

	for (let friend of list.items) {
		let fullName = `${friend.first_name} ${friend.last_name}`;

		if (isMatching(fullName, chunck)) {
			filteredFriends.items.push(friend);
        }
	}

    renderFriends(filteredFriends, result);
}

/**
 * Проверяет, содержит ли одно значение другое значение
 * @param {*} full - полное значение
 * @param {*} chunk - часть значения
 */
function isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0;
}

export {
	initFilters,
	filterLists
}
