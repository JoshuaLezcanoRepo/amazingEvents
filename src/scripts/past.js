let contadorCards = 0;
const events = data.events;
const curDate = data.currentDate;
const $basePast = document.getElementById('basePast');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');
const $inputSearch = document.getElementById('inputSearch');

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
                    <a href="../pages/details.html" role="button" class="btn btn-outline-light">Details</a>
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

// Agregamos el escuchador de eventos y buscamos el array de chequeados
$catContainer.addEventListener("change", (e) => {
    let array = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(check => check.value);
    let eventsFiltered = createPastEvents.filter(event => array.includes(event.category));
    if (eventsFiltered.length === 0) {
        createCards(createPastEvents, $basePast);
    } else {
        createCards(eventsFiltered, $basePast);
    }
});

/* Get Search and Function */
$inputSearch.addEventListener('input', function() {
    const searchValue = $inputSearch.value;
    console.log('Texto:', searchValue);
});