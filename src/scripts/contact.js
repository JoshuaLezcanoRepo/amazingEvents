let arrayFav = [];
const $baseFavorites = document.getElementById('baseFavorites');
const $btnBody = document.getElementById('btnBody');

function checkFavorite() {
    const storedArrayFav = localStorage.getItem('arrayFav');
    if (storedArrayFav) {
        arrayFav = JSON.parse(storedArrayFav);
    }
}

function generateTemplateFav(favoriteEvent) {
    return `
    <a href="../pages/details.html?id=${favoriteEvent._id}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <img src="${favoriteEvent.image}" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
        <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
                <h6 class="mb-0">${favoriteEvent.name}</h6>
                <p class="pt-3 mb-0 opacity-75">${favoriteEvent.description}</p>
            </div>
            <small class="opacity-50 text-nowrap">${favoriteEvent.date}</small>
        </div>
    </a>`;
}

function createCardFav(events, base) {
    let templateCardsFav = '';
    if (events.length === 0) {
        base.innerHTML = "You don't have any favorite events";
        $btnBody.innerHTML = '';
    } else {
        events.forEach(event => {
            templateCardsFav += generateTemplateFav(event);
        });
        base.innerHTML = templateCardsFav;
        $btnBody.innerHTML = '<button type="button" class="btn btn-danger rounded-0" onClick="deleteFavorites()"><i class="bi bi-trash"></i> Remove all Favorite Events</button>';
    }
}

function deleteFavorites() {
    localStorage.clear('arrayFav');
    arrayFav = [];
    createCardFav(arrayFav, $baseFavorites);
}

// Call the functions
checkFavorite();
createCardFav(arrayFav, $baseFavorites);