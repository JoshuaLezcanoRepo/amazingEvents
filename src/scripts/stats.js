let arrayFav = [];
function checkFavorite() {
    const storedArrayFav = localStorage.getItem('arrayFav');
    if (storedArrayFav) {
        arrayFav = JSON.parse(storedArrayFav);
        console.log(arrayFav);
    }
}

checkFavorite();

const $baseFavorites = document.getElementById('baseFavorites');
const $btnBody = document.getElementById('btnBody');

function generateTemplateFav(favoriteEvents) {
    return `
    <a href="../pages/details.html?id=${favoriteEvents._id}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <img src="${favoriteEvents.image}" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
        <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
                <h6 class="mb-0">${favoriteEvents.name}</h6>
                <p class="pt-3 mb-0 opacity-75">${favoriteEvents.description}</p>
            </div>
            <small class="opacity-50 text-nowrap">${favoriteEvents.date}</small>
        </div>
    </a>`
}

function createCardFav(event, base) {
    let templateCardsFav = '';
    if (event.length === 0) {
        base.innerHTML = "You don't have any favorite events";
        $btnBody.innerHTML = '';
    } else {
        event.forEach(event => {
            templateCardsFav += generateTemplateFav(event);
        })
        base.innerHTML = templateCardsFav;
        $btnBody.innerHTML = '';
    }
}

createCardFav(arrayFav, $baseFavorites);

function deleteFavorites() {
    localStorage.clear('arrayFav');
    arrayFav = [];
    createCardFav(arrayFav, $baseFavorites);
}