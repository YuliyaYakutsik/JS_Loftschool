import renderReviewTemplate from '../templates/review.hbs';

/**
 * Добавляет комментарий на странице
 * @param {*} data 
 */
function addComment(data) {
    const reviewsList = document.querySelector('.reviews__list');
    const reviewsItem = document.createElement('li');
    const html = renderReviewTemplate(data);
    
    reviewsItem.className = 'reviews__item';
    reviewsItem.innerHTML = html;
    
    if (reviewsList.children.length === 0) {
        reviewsList.innerHTML = '';
    }
        
    reviewsList.appendChild(reviewsItem);
}

export {
    addComment
}