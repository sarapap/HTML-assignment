'use script';

const restaurantRow = (restaurant) => {
    const { name, address } = restaurant;

    const row = document.createElement('tr');

    row.innerHTML = `<td>${name}</td><td>${address}</td>`;

    return row;
};

const restaurantModal = (restaurant) => {
    const { name, address, postalCode, city, phone, company } = restaurant;

    const modalContent = document.createElement('div');
    modalContent.innerHTML = `<p>Nimi: ${name}</p><p>Osoite: ${address}</p><p>Postinumero: ${postalCode}</p>
    <p>Kaupunki: ${city}</p><p>Puhelinnumero: ${phone}</p><p>Yritys: ${company}</p>`;

    return modalContent;
};


const dailyModal = (menuDaily) => {
    let menuHTML;
    const { courses } = menuDaily;
    const dailyMenuHTML = courses.map(course => {
        return `<li class="menu-item">${course.name}: ${course.price} ${course.diets}</li>`;
    }).join('');
    menuHTML = `<h4>Päivän Menu</h4><ul class="menu-list">${dailyMenuHTML}</ul>`;

    return menuHTML;
};

const weeklyModal = (menuWeekly) => {
    let menuHTML;

    const { days } = menuWeekly;
    const weeklyMenuHTML = days.map(day => {
        const coursesHTML = day.courses.map(course => {
            return `<li class="menu-item">${course.name}: ${course.price} ${course.diets}</li>`;
        }).join('');
        return `<li class="menu-day">${day.date}: <ul class="menu-list">${coursesHTML}</ul></li>`;
    }).join('');
    menuHTML = `<h4>Viikon Menu</h4><ul class="menu-list">${weeklyMenuHTML}</ul>`;

    return menuHTML;
};

export { restaurantModal, dailyModal, weeklyModal, restaurantRow };