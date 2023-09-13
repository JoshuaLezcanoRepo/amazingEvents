const $tdEventStatisticsBase = document.getElementById('eventStatistics');
const $pastEventsBody = document.getElementById('pastEventsBody');
const $upcomingEventsBody = document.getElementById('upcomingEventsBody');

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
    const { events, currentDate } = data;

    const filterUpcomingEvents = (events, curDate) =>
        events.filter(event => Date.parse(event.date) > Date.parse(curDate));

    const createUpcomingEvents = filterUpcomingEvents(events, currentDate);

    const filterPastEvents = (events, curDate) =>
        events.filter(event => Date.parse(event.date) < Date.parse(curDate));

    const createPastEvents = filterPastEvents(events, currentDate);

    const allCategoriesUpcoming = [...new Set(createUpcomingEvents.map(event => event.category))];
    const allCategoriesPast = [...new Set(createPastEvents.map(event => event.category))];

    const highestAssistance = events =>
        events.reduce((acc, { assistance, capacity, name }) => {
            const number = (assistance / capacity) * 100;
            if (number > acc.contador) {
                return { contador: number, eventTitle: name };
            }
            return acc;
        }, { contador: 0, eventTitle: "" });

    const lowestAssistance = events =>
        events.reduce((acc, { assistance, capacity, name }) => {
            const number = (assistance / capacity) * 100;
            if (number < acc.contador) {
                return { contador: number, eventTitle: name };
            }
            return acc;
        }, { contador: 100, eventTitle: "" });

    const largerCapacity = events =>
        events.reduce((acc, { capacity, name }) => {
            if (capacity > acc.contador) {
                return { contador: capacity, eventTitle: name };
            }
            return acc;
        }, { contador: 0, eventTitle: "" });


    $tdEventStatisticsBase.innerHTML = `
    <td>${highestAssistance(createPastEvents).eventTitle} ${highestAssistance(createPastEvents).contador.toFixed(2)}%</td>
    <td>${lowestAssistance(createPastEvents).eventTitle} ${lowestAssistance(createPastEvents).contador.toFixed(2)}%</td>
    <td>${largerCapacity(events).eventTitle} ${largerCapacity(events).contador.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>`;

    const dataEvents = (categories, events) =>
        categories.map(category => {
            const eventsCats = events.filter(event => event.category === category);
            const eventsRevenues = eventsCats.reduce((accumulator, event) => accumulator + event.price * (event.estimate || event.assistance), 0);
            const attendance = eventsCats.reduce((accumulator, event) => accumulator + ((event.assistance || event.estimate) / event.capacity) * 100, 0) / eventsCats.length;

            return {
                category,
                eventsRevenues,
                attendance,
            };
        });

    const dataShowPastEvent = dataEvents(allCategoriesPast, createPastEvents);
    const dataShowUpcomingEvent = dataEvents(allCategoriesUpcoming, createUpcomingEvents);

    const generateTemplate = event => `
    <tr>
        <td>${event.category}</td>
        <td>$ ${event.eventsRevenues.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
        <td>${event.attendance.toFixed(2)}%</td>
    </tr>`;

    const createCards = (dataEvent, baseUpcoming) => {
        const templateCardsUpcoming = dataEvent.map(event => generateTemplate(event)).join('');
        baseUpcoming.innerHTML = templateCardsUpcoming;
    };

    createCards(dataShowPastEvent, $pastEventsBody);
    createCards(dataShowUpcomingEvent, $upcomingEventsBody);

    let arrayFav = [];

    const checkFavorite = () => {
        const storedArrayFav = localStorage.getItem('arrayFav');
        if (storedArrayFav) {
            arrayFav = JSON.parse(storedArrayFav);
        }
    };

    checkFavorite();

    const $baseFavorites = document.getElementById('baseFavorites');

    const generateTemplateFav = favoriteEvents => `
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