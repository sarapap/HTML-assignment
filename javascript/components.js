'use strict';

const addToFavorites = (restaurant) => {
    console.log(`Ravintola ${restaurant.name} on lisätty suosikkeihin!`);
    alert(`Ravintola ${restaurant.name} on lisätty suosikkeihin!`);

    try {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorite = favorites.some((fav) => fav.name === restaurant.name);

        if (!isFavorite) {
            favorites.push(restaurant);
            localStorage.setItem("favorites", JSON.stringify(favorites));

            console.log(`Ravintola ${restaurant.name} on lisätty suosikkeihin!`);
            alert(`Ravintola ${restaurant.name} on lisätty suosikkeihin!`);
        } else {
            console.log(`Ravintola ${restaurant.name} on jo suosikeissa!`);
            alert(`Ravintola ${restaurant.name} on jo suosikeissa!`);
        }


    } catch (error) {
        console.error("Virhe suosikkien käsittelyssä:", error);
    }
};



const restaurantRow = (restaurant) => {
    const { name, address } = restaurant;

    const row = document.createElement('tr');

    row.innerHTML = `<td>${name}</td><td>${address}</td>`;

    const favoriteButton = document.createElement('button');
    favoriteButton.id = 'favoriteButton';
    favoriteButton.textContent = '❤️';
    favoriteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        addToFavorites(restaurant);
    });

    const actionCell = document.createElement('td');
    actionCell.appendChild(favoriteButton);
    row.appendChild(actionCell);

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