let contadorCards = 0;
const $baseUpcoming = document.getElementById('baseUpcoming');
const $baseTotalEventos = document.getElementById('totalEventos');
const $catContainer = document.getElementById('catContainer');
const $inputSearch = document.getElementById('inputSearch');
const $inputSearchButton = document.getElementById('inputSearchButton');
const $result = document.getElementById('result');
const toastLiveExample = document.getElementById('liveToast');
const $messageToast = document.getElementById('messageToast');

async function getData() {
    try {
        const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing');
        const data = await response.json();
        finalData(data);
    } catch (error) {
        console.log('Error:', error);
    }
}

getData();

function finalData(data) {
    const events = data.events;
    const curDate = data.currentDate;

    // Función para crear el template de las cards
    function generateTemplate(event) {
        return `
    <div class="col">
        <div class="card h-100">
            <i class="favorite btn position-absolute top-0 end-0 bi bi-heart-fill"></i>
            <img src="${event.image}" class="card-img-top" alt="Image Card 1">
            <div class="card-body text-white">
                <h5 class="card-title fw-semibold">${event.name}</h5>
                <p class="card-text">${event.description}</p>
            </div>
            <div class="card-body d-flex justify-content-between align-items-center text-white">
                <small>Price $${event.price} USD</small>
                <div class="btn-group">
                    <a href="../pages/details.html?id=${event._id}" role="button" class="btn btn-outline-light">Details</a>
                </div>
            </div>
        </div>
    </div>`;
    }

    // Función para filtrar cada evento por la fecha y añadirlo a un array vacio
    function filterUpcomingEvents(events, curDate) {
        return events.filter(event => Date.parse(curDate) < Date.parse(event.date));
    }

    // Función para crear las cards, con parametro (array con los eventos filtrados y la base donde se colocaran las cards)
    function createCards(upcomingEvents, baseUpcoming) {
        let templateCardsUpcoming = upcomingEvents.map(event => {
            contadorCards++;
            return generateTemplate(event);
        }).join('');
        baseUpcoming.innerHTML = templateCardsUpcoming;
    }

    const createUpcomingEvents = filterUpcomingEvents(events, curDate);
    createCards(createUpcomingEvents, $baseUpcoming);
    $baseTotalEventos.innerHTML = `Total Upcoming Events: ${contadorCards}`;
    const contadorTotalEventos = `Total Upcoming Events: ${contadorCards}`;

    function addFavoriteButtonListeners() {
        const favButtons = document.querySelectorAll('.favorite');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        favButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                this.classList.toggle('like');
                const eventId = this.closest('.card').querySelector('.card-title').textContent;
                const event = events.find(event => event.name === eventId);
                if (this.classList.contains('like')) {
                    arrayFav.push(event);
                    $messageToast.innerHTML = 'Event added to Favorites';
                    toastBootstrap.show();
                } else {
                    const index = arrayFav.findIndex(favEvent => favEvent.name === event.name);
                    if (index !== -1) {
                        arrayFav.splice(index, 1);
                        $messageToast.innerHTML = 'Event removed from Favorites';
                        toastBootstrap.show();
                    }
                }
                localStorage.setItem('arrayFav', JSON.stringify(arrayFav));
            });
        });
    }

    addFavoriteButtonListeners();

    // Filtrado de Categorias
    const allCategoriesUpcoming = [...new Set(createUpcomingEvents.map(event => event.category))];

    // Función para crear el template de las categorias
    function generateTemplateCat(event) {
        return `
    <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="${event}" value="${event}">
        <label class="form-check-label" for="${event}">${event}</label>
    </div>`;
    }

    // Función para crear categorias filtradas
    function createCats(events, base) {
        let templateCats = events.map(nameCat => generateTemplateCat(nameCat)).join('');
        base.innerHTML = templateCats;
    }

    createCats(allCategoriesUpcoming, $catContainer);

    function filterResults() {
        let searchValue = $inputSearch.value.toLowerCase();
        let array = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).map(check => check.value);
        let eventsFiltered;
        if (array.length === 0) {
            eventsFiltered = createUpcomingEvents.filter(event => event.name.toLowerCase().includes(searchValue));
        } else {
            eventsFiltered = createUpcomingEvents.filter(event => event.name.toLowerCase().includes(searchValue) && array.includes(event.category));
        }

        if (eventsFiltered.length === 0) {
            $result.innerHTML = "🤔 ¡Oops! It seems we didn't find any results. Can you try again?";
            $baseUpcoming.innerHTML = '';
            $baseTotalEventos.innerHTML = '';
        } else {
            $result.innerHTML = '';
            $baseTotalEventos.innerHTML = `${contadorTotalEventos}`;
            createCards(eventsFiltered, $baseUpcoming);
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
    $inputSearch.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            preventRefresh(event);
        }
    });

    /* Images */
    const allImages = [...new Set(createUpcomingEvents.map(event => event.image))];
    function getRandomImages() {
        let randomImages = [];
        let backupImages = allImages.slice(); // Copia el array de imágenes para no modificarlo
        for (let i = 0; i < 3; i++) {
            let randomIndex = Math.floor(Math.random() * backupImages.length);
            let randomImage = backupImages.splice(randomIndex, 1)[0];
            randomImages.push(randomImage);
        }
        return randomImages;
    }

    function refreshCarousel() {
        let randomImages = getRandomImages();
        document.getElementById("image1").src = randomImages[0];
        document.getElementById("image2").src = randomImages[1];
        document.getElementById("image3").src = randomImages[2];
    }

    refreshCarousel();

    let arrayFav = [];
    function checkFavorite() {
        const storedArrayFav = localStorage.getItem('arrayFav');
        if (storedArrayFav) {
            arrayFav = JSON.parse(storedArrayFav);
        }
    }

    checkFavorite();

    const $baseFavorites = document.getElementById('baseFavorites');

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
    </a>`;
    }

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
}