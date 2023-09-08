const queryString = location.search;
const params = new URLSearchParams(queryString);
const events = data.events;
const curDate = data.currentDate;
const id = params.get('id');
const toastLiveExample = document.getElementById('liveToast');
const $messageToast = document.getElementById('messageToast');


const eventSelected = events.find(event => event._id == id);
const $base = document.getElementById('baseCard');


let detail = "";
function pastOrUpcoming() {
    if (Date.parse(curDate) < Date.parse(`${eventSelected.date}`)) {
        detail = ` Estimate: ${eventSelected.estimate}`;
    } else {
        detail = ` Assistance: ${eventSelected.assistance}`;
    }
}

pastOrUpcoming();

function generateTemplate(eventSelected) {
    return `
    <div class="col-md-4">
        <img src="${eventSelected.image}" class="img-fluid rounded-start h-100 object-fit-cover" alt="Card Image Element">
        <div id="containerBtn"><i class="favorite btn position-absolute top-0 end-0 bi bi-heart-fill"></i></div>
    </div>
    <div class="col-md-8">
        <div class="card-body lh-sm">
            <div class="d-flex gap-3 align-items-center">
                <h5 class="card-title h2 fw-bold">${eventSelected.name}</h5>
                <p class="card-text text-warning-emphasis">${eventSelected.category}</p>
            </div>
            <p class="card-text opacity-50">${eventSelected.description}</p>
            <p class="card-text"><i class="bi bi-calendar-event text-primary-emphasis"></i> Date: ${eventSelected.date}</p>
            <p class="card-text"><i class="bi bi-building text-primary-emphasis"></i> City: ${eventSelected.place}</p>
            <p class="card-text"><i class="bi bi-people text-primary-emphasis"></i> Capacity: ${eventSelected.capacity}</p>
            <p class="card-text"><i class="bi bi-currency-dollar text-primary-emphasis"></i> Event Price: ${eventSelected.price} USD</p>
            <p class="card-text"><i class="bi bi-pass text-primary-emphasis"></i>${detail}</p>
            
        </div>
    </div>`
}

function createCard(event, base) {
    let templateCards = '';
    templateCards = generateTemplate(event);
    base.innerHTML = templateCards;
}

createCard(eventSelected, $base);
const $containerBtn = document.getElementById('containerBtn');

let arrayFav = [];

function clickBtn(event) {
    const favoriteIcon = event.target.closest('.favorite');
    favoriteIcon.classList.toggle('likeDetail');
    const index = arrayFav.findIndex((event) => event._id === eventSelected._id);
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    
    if (favoriteIcon.classList.contains('likeDetail')) {
        if (index === -1) {
            arrayFav.push(eventSelected);
            localStorage.setItem('arrayFav', JSON.stringify(arrayFav));
            $messageToast.innerHTML = 'Event added to Favorites';
            toastBootstrap.show();
        }
    } else {
        if (index !== -1) {
            arrayFav.splice(index, 1);
            localStorage.setItem('arrayFav', JSON.stringify(arrayFav));
            $messageToast.innerHTML = 'Event removed from Favorites';
            toastBootstrap.show();
        }
    }
}

$containerBtn.addEventListener('click', clickBtn);

function checkFavorite() {
    const storedArrayFav = localStorage.getItem('arrayFav');
    if (storedArrayFav) {
        arrayFav = JSON.parse(storedArrayFav);
    }
    
    const favoriteIcon = document.querySelector('.favorite');
    const index = arrayFav.findIndex((event) => event._id === eventSelected._id);
    
    if (index !== -1) {
        favoriteIcon.classList.add('likeDetail');
    }
}

checkFavorite();

const $baseFavorites = document.getElementById('baseFavorites');
const $btnBody = document.getElementById('btnBody');

function generateTemplateFav(favoriteEvents) {
    return `
    <a href="./details.html?id=${favoriteEvents._id}" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
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
        $btnBody.innerHTML = '<button type="button" class="btn btn-danger rounded-0" onClick="deleteFavorites()"><i class="bi bi-trash"></i> Remove all Favorite Events</button>';
    }
}

createCardFav(arrayFav, $baseFavorites);

function deleteFavorites() {
    localStorage.clear('arrayFav');
    arrayFav = [];
    createCardFav(arrayFav, $baseFavorites);
}