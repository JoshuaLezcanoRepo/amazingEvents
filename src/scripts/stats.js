const $tdEventStatisticsBase = document.getElementById('eventStatistics');
const $tdPastStatisticsBase = document.getElementById('pastStatistics');

async function getData() {
    try {
        const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing');
        const data = await response.json();
        finalData(data);
    }
    catch {
        console.log('Error');
    }
}

getData();

function finalData(data) {
    const events = data.events;
    const curDate = data.currentDate;

    // Obtengo Eventos Futuros y Pasados
    function filterUpcomingEvents(events, curDate) {
        const upcomingEvents = [];
        for (let event of events) {
            if (Date.parse(curDate) < Date.parse(`${event.date}`)) {
                upcomingEvents.push(event);
            }
        }
        return upcomingEvents;
    }

    const createUpcomingEvents = filterUpcomingEvents(events, curDate);
    // console.log(createUpcomingEvents);

    function filterPastEvents(events, curDate) {
        const pastEvents = [];
        for (let event of events) {
            if (Date.parse(curDate) > Date.parse(`${event.date}`)) {
                pastEvents.push(event);
            }
        }
        return pastEvents;
    }

    const createPastEvents = filterPastEvents(events, curDate);
    // console.log(createPastEvents);

    // Filtro por Categorías (Upcoming & Past)
    const allCategoriesUpcoming = [...new Set(createUpcomingEvents.map(event => event.category))];
    console.log(allCategoriesUpcoming);

    const allCategoriesPast = [...new Set(createPastEvents.map(event => event.category))];
    console.log(allCategoriesPast);

    function highestAssistance(events) {
        let contador = 0;
        let eventTitle = "";
        events.forEach((event) => {
            let number = ((event.assistance / event.capacity) * 100);

            if (number > contador) {
                contador = number;
                eventTitle = event.name;
            }
        })
        return `${eventTitle} ${contador.toFixed(2)}%`;
    }

    // console.log(highestAssistance(events));

    function lowestAssistance(events) {
        let contador = 100;
        let eventTitle = "";
        events.forEach((event) => {
            let number = ((event.assistance / event.capacity) * 100);

            if (number < contador) {
                contador = number;
                eventTitle = event.name;
            }
        })
        return `${eventTitle} ${contador.toFixed(2)}%`;
    }

    // console.log(lowestAssistance(events));
    
    function largerCapacity(events) {
        let contador = 0;
        let eventTitle = "";
        events.forEach((event) => {
            if (event.capacity > contador) {
                contador = event.capacity;
                eventTitle = event.name;
            }
        })
        return `${eventTitle} ${contador.toLocaleString(undefined, {
            maximumFractionDigits: 0})}`;
    }

    // console.log(largerCapacity(events));

    $tdEventStatisticsBase.innerHTML = `<td>${highestAssistance(createPastEvents)}</td><td>${lowestAssistance(createPastEvents)}</td><td>${largerCapacity(events)}</td>`


    // Filter Past Events - Category - Revenue
    function dataPastEvents(categories, events) {
        let dataFinal = [];
        categories.forEach((category) => {
            let eventsCats = events.filter((event) => category == event.category);
            let eventsRevenues = eventsCats.reduce((contador, event) => contador + event.price * (event.estimate || event.assistance), 0);
            let attendance = eventsCats.reduce((contador, event) => contador + ((event.assistance || event.estimate) / event.capacity) * 100, 0);
            dataFinal.push({
                category,
                eventsRevenues,
                attendance: attendance / eventsCats.length,
            });
        });
        return dataFinal;
    }

    const dataShowPastEvent = dataPastEvents(allCategoriesPast, createPastEvents);
    const dataShowUpcomingEvent = dataPastEvents(allCategoriesUpcoming, createUpcomingEvents);

    // Función para crear el template de las cards
    function generateTemplate(event) {
        return `
            <tr>${event.category}</tr>`
    }

    // Función para crear las cards, con parametro (array con los eventos filtrados y la base donde se colocaran las cards)
    function createCards(dataShowPastEvent, baseUpcoming) {
        let templateCardsUpcoming = "";
        dataShowPastEvent.forEach(event => {
            templateCardsUpcoming += generateTemplate(event);
        })
        baseUpcoming.innerHTML = templateCardsUpcoming;
    }

    createCards(dataShowPastEvent, $tdPastStatisticsBase);

    let arrayFav = [];
    function checkFavorite() {
        const storedArrayFav = localStorage.getItem('arrayFav');
        if (storedArrayFav) {
            arrayFav = JSON.parse(storedArrayFav);
        }
    }

    checkFavorite();

    const $baseFavorites = document.getElementById('baseFavorites');
    const $btnBody = document.getElementById('btnBody');

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
}