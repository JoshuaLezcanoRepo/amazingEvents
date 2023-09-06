let contadorCards = 0;
const events = data.events;
const curDate = data.currentDate;
const $basePast = document.getElementById('basePast');
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
            <img src="${event.image}" class="card-img-top" alt="Image Card 1">
            <div class="card-body text-white">
                <h5 class="card-title">${event.name}</h5>
                <p class="card-text">${event.description}</p>
            </div>
            <div class="card-body d-flex justify-content-between align-items-center text-white">
                <small>Price $${event.price}</small>
                <div class="btn-group">
                    <a href="../pages/details.html?id=${event._id}" role="button" class="btn btn-outline-light">Details</a>
                </div>
            </div>
        </div>
    </div>`
}

// Función para filtrar cada evento por la fecha y añadirlo a un array vacio
function filterPastEvents(events, curDate) {
    const pastEvents = [];
    for (let event of events) {
        if (Date.parse(curDate) > Date.parse(`${event.date}`)) {
            pastEvents.push(event);
        }
    }
    return pastEvents;
}

// Función para crear las cards, con parametro (array con los eventos filtrados y la base donde se colocaran las cards)
function createCards(pastEvents, basePast) {
    let templateCardsPast = "";
    pastEvents.forEach( event => {
        templateCardsPast += generateTemplate(event);
        contadorCards++;
    });
    basePast.innerHTML = templateCardsPast;
}

const createPastEvents = filterPastEvents(events, curDate);
createCards(createPastEvents, $basePast);
$baseTotalEventos.innerHTML = `Total Past Events: ${contadorCards}`;
const contadorTotalEventos = `Total Upcoming Events: ${contadorCards}`;

// Función para marcar eventos favoritos
const favButtons = document.querySelectorAll('.favorite');
favButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        this.classList.toggle('like');
    });
});

// Filtrado de Categorias
const allCategoriesPast = [...new Set(createPastEvents.map(event => event.category))];

// Función para crear el template de las categorias
function generateTemplateCat(event) {
    return `
    <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="${event}" value="${event}">
        <label class="form-check-label" for="${event}">${event}</label>
    </div>`
}

// Función para crear categorias filtradas
function createCats(events, base) {
    let templateCats = "";
    events.forEach(nameCat => {
        templateCats += generateTemplateCat(nameCat);
    });
    base.innerHTML = templateCats;
}

createCats(allCategoriesPast, $catContainer);

function filterResults() {
    let searchValue = $inputSearch.value.toLowerCase();
    let array = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(check => check.value);
    let eventsFiltered;
    if (array.length === 0) {
        eventsFiltered = createPastEvents.filter(event => {
            const eventName = event.name.toLowerCase();
            return eventName.includes(searchValue);
        });
    } else {
        eventsFiltered = createPastEvents.filter(event => {
            const eventName = event.name.toLowerCase();
            return eventName.includes(searchValue) && array.includes(event.category);
        });
    }

    if (eventsFiltered.length === 0) {
        $result.innerHTML = '¡Oops! Parece que no encontramos resultados. ¿Puedes intentarlo de nuevo?';
        $basePast.innerHTML = '';
        $baseTotalEventos.innerHTML = '';
    } else {
        $result.innerHTML = '';
        $baseTotalEventos.innerHTML = `${contadorTotalEventos}`;
        createCards(eventsFiltered, $basePast);
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