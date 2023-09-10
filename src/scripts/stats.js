const $tdEventStatisticsBase = document.getElementById('eventStatistics');

$tdEventStatisticsBase.innerHTML = `<td>Metallica</td><td>Metallica</td><td>Metallica</td>`

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