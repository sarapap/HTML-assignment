'use strict';

// Funktion kielen vaihtoon
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

const translations = {
    EN: {
        added: (name) => `Restaurant ${name} has been added to favorites!`,
        alreadyFavorite: (name) => `Restaurant ${name} is already in favorites!`,
        error: "Error handling favorites.",
        noFavorites: "No favorites. Add some restaurants to your favorites!",
        alertLogin: "Please log in to see your favorites.",
        deleteButton: "Delete",
        nameColumn: "Name",
        addressColumn: "Address",
        deleteColumn: "Remove from favorites"
    },
    SV: {
        added: (name) => `Restaurangen ${name} har lagts till favoriter!`,
        alreadyFavorite: (name) => `Restaurangen ${name} är redan bland favoriterna!`,
        error: "Fel vid hantering av favoriter.",
        noFavorites: "Inga favoriter. Lägg till några restauranger i dina favoriter!",
        alertLogin: "Logga in för att se dina favoriter.",
        deleteButton: "Radera",
        nameColumn: "Namn",
        addressColumn: "Adress",
        deleteColumn: "Ta bort från favoriter"
    },
    FI: {
        added: (name) => `Ravintola ${name} on lisätty suosikkeihin!`,
        alreadyFavorite: (name) => `Ravintola ${name} on jo suosikeissa!`,
        error: "Virhe suosikkien käsittelyssä.",
        noFavorites: "Ei suosikkeja. Lisää ravintoloita suosikkeihin!",
        alertLogin: "Ole hyvä ja kirjaudu sisään nähdäksesi suosikkisi.",
        deleteButton: "Poista",
        nameColumn: "Nimi",
        addressColumn: "Osoite",
        deleteColumn: "Poista suosikeista"
    }
};

const addToFavorites = (restaurant) => {
    const selectedLanguage = getSelectedLanguage();

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert(translations[selectedLanguage].alertLogin);
        return;
    }

    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    const parsedPayload = JSON.parse(payload);

    const userId = parsedPayload.user_id;

    const favoritesKey = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
    const isFavorite = favorites.some((fav) => fav.name === restaurant.name);

    if (!isFavorite) {
        favorites.push(restaurant);
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        alert(translations[selectedLanguage].added(restaurant.name));
    } else {
        alert(translations[selectedLanguage].alreadyFavorite(restaurant.name));
    }
};

const restaurantRow = (restaurant) => {
    const { name, address } = restaurant;

    const row = document.createElement('tr');

    row.innerHTML = `<td>${name}</td><td>${address}</td>`;

    const favoriteButton = document.createElement('button');
    favoriteButton.id = 'favoriteButton';
    favoriteButton.textContent = '🖤';
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

const dailyModal_en = (menuDaily) => {
    let menuHTML;
    const { courses } = menuDaily;
    const dailyMenuHTML = courses.map(course => {
        return `<li class="menu-item">${course.name}: ${course.price} ${course.diets}</li>`;
    }).join('');
    menuHTML = `<h4>Daily Menu</h4><ul class="menu-list">${dailyMenuHTML}</ul>`;

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

const weeklyModal_en = (menuWeekly) => {
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

export { weeklyModal_en, dailyModal_en, restaurantModal, dailyModal, weeklyModal, restaurantRow };