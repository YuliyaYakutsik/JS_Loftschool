/**
 * Обновляет списки друзей: всех друзей и выбранных друзей
 * @param {*} sourceList - список, из которого переносится элемент-друг
 * @param {*} resultList - список, в который переносится элемент-друг
 * @param {*} sourceElement - элемент-друг, который переносится
 */
function refreshFriendsLists(sourceList, resultList, sourceElement) {
	let elementId = sourceElement.id;

	sourceList.items = sourceList.items.filter(function(item) {
		let fullId = `${item.id}`;

		if (elementId === fullId) {
			resultList.items.push(item);
		} else {
			return true;
		}
	});
}

export {
	refreshFriendsLists
}
