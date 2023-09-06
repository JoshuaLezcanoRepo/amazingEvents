const queryString = location.search;
const params = new URLSearchParams(queryString);
const events = data.events;
const curDate = data.currentDate;
const id = params.get('id');
console.log(id);

const eventSelected = events.find(event => event._id == id);
const $base = document.getElementById('baseCard');

let detail = "";
function pastOrUpcoming() {
    if (Date.parse(curDate) < Date.parse(`${eventSelected.date}`)) {
        detail = `- Estimate: ${eventSelected.estimate}`;
    } else {
        detail = `- Assistance: ${eventSelected.assistance}`;
    }
}

pastOrUpcoming();

function generateTemplate(eventSelected) {
    return `
    <div class="col-md-4">
        <img src="${eventSelected.image}" class="img-fluid rounded-start h-100 object-fit-cover" alt="Card Image Element">
    </div>
    <div class="col-md-8">
        <div class="card-body lh-sm">
            <h5 class="card-title h2 fw-bold">${eventSelected.name}</h5>
            <p class="card-text">${eventSelected.description}</p>
            <p class="card-text">- Date: ${eventSelected.date}</p>
            <p class="card-text">- Category: ${eventSelected.category}</p>
            <p class="card-text">- City: ${eventSelected.place}</p>
            <p class="card-text">- Capacity: ${eventSelected.capacity}</p>
            <p class="card-text">- Event Price: ${eventSelected.price}</p>
            <p class="card-text">${detail}</p>
            <p class="card-text">${eventSelected.__v}</p>
        </div>
    </div>`
}

function createCard(event, base) {
    let templateCards = '';
    templateCards = generateTemplate(event);
    base.innerHTML = templateCards;
}

createCard(eventSelected, $base);