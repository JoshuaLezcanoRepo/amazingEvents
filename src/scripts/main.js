let contadorCards = 0;
const events = data.events;
const curDate = data.currentDate;
const $base = document.getElementById('baseCard');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');

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
let statusEvent = "";
function createCards(events, $base) {
    let templateCards = "";
    for (let event of events) {
        if (Date.parse(curDate) < Date.parse(`${event.date}`)) {
            statusEvent = "Upcoming Event";
        } else {
            statusEvent = "Past Event";
        }
        templateCards += generateTemplate(event);
        contadorCards++;
    }
    $base.innerHTML = templateCards;
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
const categories = events.filter(element => {
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