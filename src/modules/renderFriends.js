import render from '../templates/friends.hbs';

/**
 * Добавляет в DOM друзей
 * @param {*} friends - друзья
 * @param {*} results - куда добавить
 */
function renderFriends(friends, results) {
	results.innerHTML = '';
	const html = render(friends);

	results.innerHTML = html;
}

export {
	renderFriends
}