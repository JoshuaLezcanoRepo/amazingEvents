let contadorCards = 0;
const events = data.events;
const curDate = data.currentDate;
const $baseUpcoming = document.getElementById('baseUpcoming');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');

// Función para crear el template de las cards
function generateTemplate(event) {
    return `
    <div class="col">
        <div class="card h-100">
            <i class="favorite btn position-absolute top-0 end-0 bi bi-heart-fill" id="fav"></i></a>
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
function filterUpcomingEvents(events, curDate) {
    const upcomingEvents = [];
    for (let event of events) {
        if (Date.parse(curDate) < Date.parse(`${event.date}`)) {
            upcomingEvents.push(event);
        }
    }
    return upcomingEvents;
}

// Función para crear las cards, con parametro (array con los eventos filtrados y la base donde se colocaran las cards)
function createCards(upcomingEvents, $baseUpcoming) {
    let templateCardsUpcoming = "";
    for (let event of upcomingEvents) {
        templateCardsUpcoming += generateTemplate(event);
        contadorCards++;
    }
    $baseUpcoming.innerHTML = templateCardsUpcoming;
}

const createupcomingEvents = filterUpcomingEvents(events, curDate);
createCards(createupcomingEvents, $baseUpcoming);
$baseTotalEventos.innerHTML = `Total Upcoming Events: ${contadorCards}`;

// Función para marcar eventos favoritos
const favButtons = document.querySelectorAll('.favorite');
favButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        this.classList.toggle('like');
    });
});

// Función para crear categorias filtradas
let option = 0;
function createCats(array) {
    let templateCats = "";
    for (let i = 0; i < array.length; i++) {
        const nameCat = array[i];
        option++;
        templateCats += generateTemplateCat(nameCat);
    }
    $catContainer.innerHTML = templateCats;
}

// Filtro para eliminar categorias repetidas
let cat = [];
const categories = createupcomingEvents.filter(element => {
    const isDuplicate = cat.includes(element.category);
    if (!isDuplicate) {
        cat.push(element.category);
        return true;
    }
    return false;
});

// Función para crear el template de las categorias
function generateTemplateCat(event) {
    return `
    <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="${option}" value="${option}">
        <label class="form-check-label" for="${option}">${event}</label>
    </div>`
}

createCats(cat);