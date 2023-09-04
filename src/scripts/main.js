let contadorCards = 0;
let statusEvent = "";
const events = data.events;
const curDate = data.currentDate;
const $base = document.getElementById('baseCard');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');
const $inputSearch = document.getElementById('inputSearch');

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
                    <a href="./src/pages/details.html" role="button" class="btn btn-outline-light">Details</a>
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

// Agregamos el escuchador de eventos y buscamos el array de chequeados
$catContainer.addEventListener("change", (e) => {
    let array = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(check => check.value);
    let eventsFiltered = events.filter(event => array.includes(event.category));
    if (eventsFiltered.length === 0) {
        createCards(events, $base);
    } else {
        createCards(eventsFiltered, $base);
    }
});

/* Búsqueda */
$inputSearch.addEventListener('input', function() {
    const searchValue = $inputSearch.value.toLowerCase();
    let eventsFiltered = events.filter(event => {
        // Filtrar eventos por título
        const eventName = event.name.toLowerCase();
        return eventName.includes(searchValue);
    });
    
    // Mostrar las cartas
    if (eventsFiltered.length === 0) {
        createCards(events, $base);
    } else {
        createCards(eventsFiltered, $base);
    }
});