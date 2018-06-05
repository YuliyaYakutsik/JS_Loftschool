// Шаблон отдельного отзыва.
const reviewTemplate = `<div class="reviews__item__title">
                            <p class="reviews__item__name">{{name}}</p>
                            <p class="reviews__item__place">{{place}}</p>
                            <p class="reviews__item__date">{{date}}</p>
                        </div>
                        <div class="reviews__item__text">
                            {{review}}
                        </div>`;

// Шаблон формы отзыва по адресу.
const reviewFormTemplate = `<div class="infoWindow__header">
			                    <div class="infoWindow__title">
			                        <img src="./src/images/marker_address.png" alt="marker" class="infoWindow__title__picture">
			                        <div class="infoWindow__title__address">
			                            {{ address }}
			                        </div>
			                    </div>
			                    <div class="infoWindow__close">
			                        <a href="#" class="infoWindow__close__link">
			                            <img src="./src/images/close.png" alt="close" class="infoWindow__close__picture">
			                        </a>
			                    </div>
			                </div>
			                <div class="infoWindow__content">
			                    <div class="reviews">
			                        <ul class="reviews__list">
			                            Пока нет отзывов!
			                        </ul>
			                    </div>
			                    <form class="reviewsForm" name="reviewsForm">
			                        <div class="reviewsForm__title">
			                            Ваш отзыв
			                        </div>
			                        <input type="text" class="reviewsForm__element reviewsForm__name" name="name" placeholder="Ваше имя">
			                        <input type="text" class="reviewsForm__element reviewsForm__place" name="place" placeholder="Укажите место">
			                        <textarea class="reviewsForm__element reviewsForm__review" name="review" placeholder="Поделитесь впечатлениями"></textarea>
			                    </form>
			                </div>
			                <div class="infoWindow__footer">
			                    <a href="#" class="infoWindow__footer__link">
			                        Добавить
			                    </a>
			                </div>`;

export {reviewTemplate};
export {reviewFormTemplate};