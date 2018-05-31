import css from './styles/index.css'

const template = document.querySelector('#user-template').textContent;
const render = Handlebars.compile(template);

const drugofilterContent = document.querySelector('.drugofilter__content');
const drugofilterAuthorization = document.querySelector('.drugofilter__authorization');
const drugofilterAuthorizationLink = document.querySelector('.drugofilter__authorization__link');

const results = document.querySelectorAll('.drugofilter__info__list');
const allResults = document.querySelector('.drugofilter__info__list__all-friends');
const groupResults = document.querySelector('.drugofilter__info__list__group-friends');

const allFriendsSearch = document.querySelector('.search-all-friends');
const groupFriendsSearch = document.querySelector('.search-group-friends');

const saveButton = document.querySelector('.drugofilter__footer__link');
const closeButton = document.querySelector('.drugofilter__header__close-button');

let allFriends = {items: []};
let groupFriends = {items: []};
let currentDrag;

if (localStorage.allFriends) {
	let localAllFriends = JSON.parse(localStorage.allFriends);
	let localGroupFriends = JSON.parse(localStorage.groupFriends);

	renderFriends(localAllFriends, allResults);
	renderFriends(localGroupFriends, groupResults);

	for (let item of localAllFriends.items) {
		allFriends.items.push(item);
	}

	for (let item of localGroupFriends.items) {
		groupFriends.items.push(item);
	}

	drugofilterAuthorization.classList.add('drugofilter__authorization_hidden');
	drugofilterContent.classList.remove('drugofilter__content_hidden');
}

drugofilterAuthorizationLink.addEventListener('click', e => {
	e.preventDefault();
	drugofilterAuthorizationLink.style.display = 'none';
	drugofilterAuthorization.querySelector('span').style.display = 'inline';

	VK.init({
	    apiId: 6490516
	});

	auth()
	    .then(() => {
	        return callAPI('friends.get', { fields: 'photo_50' });
	    })
	    .then(friends => {
	    	for (let item of friends.items) {
	    		allFriends.items.push(item);
	    	}
	    	renderFriends(friends, allResults);

	    	drugofilterAuthorization.classList.add('drugofilter__authorization_hidden');
	    	drugofilterContent.classList.remove('drugofilter__content_hidden');
	    });
});

allResults.addEventListener('dragstart', (e) => {
	const zone = getCurrentZone(e.target);

	if (zone) {
		currentDrag = {
			startZone: zone,
			node: e.target
		}
	}
});

document.addEventListener('dragover', (e) => {
	const zone = getCurrentZone(e.target);
	
	if (zone) {
		e.preventDefault();
	}
});

document.addEventListener('drop', (e) => {
	if (currentDrag) {
		const zone = getCurrentZone(e.target);

		e.preventDefault();

		if (zone && currentDrag.startZone !== zone) {
			/*if (e.target.classList.contains('friend')) {
				zone.insertBefore(currentDrag.node,  e.target.nextElementSibling);
			} else if (getElement(e.target)) {
				zone.insertBefore(currentDrag.node, getElement(e.target).nextElementSibling);
			} else {
				zone.appendChild(currentDrag.node);
			}*/

			refreshFriendsLists(allFriends, groupFriends, currentDrag.node);

			renderFriends(allFriends, allResults);
			renderFriends(groupFriends, groupResults);

			if (groupFriendsSearch.value.trim() !== '') {
				filterLists(groupFriendsSearch, groupFriends, groupResults);
			}
		}

		currentDrag = null;
	}
});

results.forEach((result) => {
	result.addEventListener('click', (e) => {
		let target = e.target;
		let allFriendsClick = result.classList.contains('drugofilter__info__list__all-friends');

		do {
			if (target.classList.contains('friend__link')) {
				e.preventDefault();

				let element = getElement(target);

				if (element) {

					if (allFriendsClick) {
						//groupResults.appendChild(element);
						refreshFriendsLists(allFriends, groupFriends, element);
					} else {
						//allResults.appendChild(element);
						refreshFriendsLists(groupFriends, allFriends, element);
					}

					renderFriends(allFriends, allResults);
					renderFriends(groupFriends, groupResults);

					if (allFriendsSearch.value.trim() !== '') {
						filterLists(allFriendsSearch, allFriends, allResults);
					}

					if (groupFriendsSearch.value.trim() !== '') {
						filterLists(groupFriendsSearch, groupFriends, groupResults);
					}
				}

				break;
			}
		} while (target = target.parentElement);
	});
});

saveButton.addEventListener('click', e => {
	e.preventDefault();

	localStorage.allFriends = JSON.stringify(allFriends);
	localStorage.groupFriends = JSON.stringify(groupFriends);
});

closeButton.addEventListener('click', e => {
	e.preventDefault();

	delete localStorage.allFriends;
	delete localStorage.groupFriends;

	drugofilterAuthorizationLink.style.display = 'inline';
	drugofilterAuthorization.querySelector('span').style.display = 'none';

	drugofilterAuthorization.classList.remove('drugofilter__authorization_hidden');
	drugofilterContent.classList.add('drugofilter__content_hidden');

	groupFriends.items = groupFriends.items.filter(function(item) {
		return false;
	});

	renderFriends(groupFriends, groupResults);
});

initFilters([
	{
		target: allFriendsSearch,
		list: allFriends,
		result: allResults
	},
	{
		target: groupFriendsSearch,
		list: groupFriends,
		result: groupResults
	}
]);

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

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

/**
 * Проверяет, содержит ли одно значение другое значение
 * @param {*} full - полное значение
 * @param {*} chunk - часть значения
 */
function isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0;
}

/**
 * Ищем зону в которой происходит D&D
 * @param {*} from
 */
function getCurrentZone(from) {
	do {
		if (from.classList.contains('drugofilter__info__list')) {
			return from;
		}
	} while (from = from.parentElement);
	
	return false;
}

/**
 * Ищет у элемента родителя с классом 'friend'
 * @param {*} target - элемент, у которого искать такого родителя
 */
function getElement(target) {
	let element = target.parentElement;

	do {
		if (element.classList.contains('friend')) {
			return element;
		}
	} while (element = element.parentElement);
	
	return false;
}


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

function initFilters(params) {
	params.forEach(item => {
		item.target.addEventListener('input', () => {
			filterLists(item.target, item.list, item.result);
		})
	})
}

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
