let arrayFav = [];
const $baseFavorites = document.getElementById('baseFavorites');

function checkFavorite() {
    const storedArrayFav = localStorage.getItem('arrayFav');
    if (storedArrayFav) {
        arrayFav = JSON.parse(storedArrayFav);
    }
}

function generateTemplateFav(favoriteEvent) {
    return `
    <a href="../pages/details.html?id=${favoriteEvent._id}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <img src="${favoriteEvent.image}" alt="twbs" width="32" height="32" class="object-fit-cover rounded-circle flex-shrink-0">
        <div class="d-flex gap-2 w-100 justify-content-between">
            <div>
                <h6 class="mb-0">${favoriteEvent.name}</h6>
                <p class="pt-3 mb-0 opacity-75">${favoriteEvent.description}</p>
            </div>
            <small class="opacity-50 text-nowrap">${favoriteEvent.date}</small>
        </div>
    </a>`;
}

checkFavorite();

let button = document.getElementById("btnBody");
function createCardFav(event, base) {
    let templateCardsFav = '';
    if (event.length === 0) {
        base.innerHTML = "You don't have any favorite events";
        button.style.display = "none";
    } else {
        event.forEach(event => {
            templateCardsFav += generateTemplateFav(event);
        })
        base.innerHTML = templateCardsFav;
        button.style.display = "block";
    }
}

createCardFav(arrayFav, $baseFavorites);

function clickBtn() {
    localStorage.clear('arrayFav');
    arrayFav = [];
    createCardFav(arrayFav, $baseFavorites);
}

button.addEventListener('click', clickBtn);