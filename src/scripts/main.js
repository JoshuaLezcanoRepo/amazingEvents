let contadorCards = 0;
let statusEvent = "";
const events = data.events;
const curDate = data.currentDate;
const $base = document.getElementById('baseCard');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');
const $inputSearch = document.getElementById('inputSearch');
const $inputSearchButton = document.getElementById('inputSearchButton');
const $result = document.getElementById('result');

// Función para crear el template de las cards
function generateTemplate(event) {
    return `
    <div class="col">
        <div class="card h-100">
            <i class="favorite btn position-absolute top-0 end-0 bi bi-heart-fill"></i>
            <small class="position-absolute top-0 start-0 py-2 px-3 status">${statusEvent}</small>
            <img src="${event.image}" class="card-img-top" alt="Image Card 1">
            <div class="card-body text-white">
                <h5 class="card-title">${event.name}</h5>
                <p class="card-text">${event.description}</p>
            </div>
            <div class="card-body d-flex justify-content-between align-items-center text-white">
                <small>Price $${event.price}</small>
                <div class="btn-group">
                    <a href="./src/pages/details.html?id=${event._id}" role="button" class="btn btn-outline-light">Details</a>
                </div>
            </div>
        </div>
    </div>`
}

// Función para crear las cards, con parametro (array con los eventos y la base donde se colocaran las cards)
function createCards(events, base) {
    let templateCards = "";
    events.forEach(event => {
        if (Date.parse(curDate) < Date.parse(`${event.date}`)) {
            statusEvent = "Upcoming Event";
        } else {
            statusEvent = "Past Event";
        }
        templateCards += generateTemplate(event);
        contadorCards++;
    })
    base.innerHTML = templateCards;
}

createCards(events, $base);
$baseTotalEventos.innerHTML = `Total Events: ${contadorCards}`;
const contadorTotalEventos = `Total Events: ${contadorCards}`;

// Función para marcar eventos favoritos
const favButtons = document.querySelectorAll('.favorite');
favButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        this.classList.toggle('like');
    });
});

// Filtrado de Categorias
const allCategories = [...new Set(events.map(event => event.category))];

// Función para crear el template de las categorias
function generateTemplateCat(event) {
    return `
    <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="${event}" value="${event}">
        <label class="form-check-label" for="${event}">${event}</label>
    </div>`
}

function createCats(events, base){
    let templateCats = "";
    events.forEach(cat => {
        templateCats += generateTemplateCat(cat)
    });
    base.innerHTML = templateCats;
}

createCats(allCategories, $catContainer);

function filterResults() {
    let searchValue = $inputSearch.value.toLowerCase();
    let array = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(check => check.value);
    let eventsFiltered;
    if (array.length === 0) {
        eventsFiltered = events.filter(event => {
            const eventName = event.name.toLowerCase();
            return eventName.includes(searchValue);
        });
    } else {
        eventsFiltered = events.filter(event => {
            const eventName = event.name.toLowerCase();
            return eventName.includes(searchValue) && array.includes(event.category);
        });
    }

    if (eventsFiltered.length === 0) {
        $result.innerHTML = '¡Oops! Parece que no encontramos resultados. ¿Puedes intentarlo de nuevo?';
        $base.innerHTML = '';
        $baseTotalEventos.innerHTML = '';
    } else {
        $result.innerHTML = '';
        $baseTotalEventos.innerHTML = `${contadorTotalEventos}`;
        createCards(eventsFiltered, $base);
    }
}

$inputSearch.addEventListener('input', filterResults);
$catContainer.addEventListener('change', filterResults);

// Funcion para prevenir el "refresh"
function preventRefresh(event) {
    event.preventDefault();
}

// Evento que escucha el "click" del botón search
$inputSearchButton.addEventListener('click', preventRefresh);

// Evento para escuchar el "Enter"
$inputSearch.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        preventRefresh(event);
    }
});