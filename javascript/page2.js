'use strict';


const map = L.map('map').setView([60.2826627, 25.0101836], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Aseta ravintolatiedot yhteiseen muuttujaan
let ravintolat;

// ravintolat

import { restaurantModal, dailyModal, weeklyModal, restaurantRow } from "./components.js";
import { fetchAPI, fetchDailyMenu, fetchWeeklyMenu, fetchCitiesFromAPI } from "./utils.js";

// Aseta yleinen muuttuja ravintolatiedoille
ravintolat = null;

const getAPI = async () => {
    try {
        // Hae ravintolatiedot API:sta ja tallenna yhteiseen muuttujaan
        ravintolat = await fetchAPI('restaurants');
        displayRestaurants(ravintolat);

        // Lisää event-listenerit filtteritoiminnoille
        document.getElementById('filterCity').addEventListener('change', () => handleFilterChange(ravintolat));
        document.getElementById('filterCompany').addEventListener('change', () => handleFilterChange(ravintolat));
        populateCities();
    } catch (error) {
        handleError(error);
    }

    // Käyttäjän sijainnin haku ja lähimmän ravintolan löytäminen
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => showPosition(pos, ravintolat));
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
};


// kartta

// Funktio etäisyyden laskemiseen
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Maan säde kilometreinä
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Funktio, joka käsittelee käyttäjän sijainnin ja etsii lähimmän ravintolan
function showPosition(position, ravintolat) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    let nearestRestaurant = null;
    let minDistance = Infinity;

    // Etsi lähin ravintola
    ravintolat.forEach(restaurant => {
        const distance = getDistance(userLat, userLon, restaurant.lat, restaurant.lon);
        if (distance < minDistance) {
            nearestRestaurant = restaurant;
            minDistance = distance;
        }
    });

    // Korosta lähin ravintola kartalla
    if (nearestRestaurant) {
        const marker = L.marker([nearestRestaurant.lat, nearestRestaurant.lon]).addTo(map);
        marker.bindPopup(`Lähin ravintola: ${nearestRestaurant.name}`).openPopup();

        // Keskity kartta lähimpään ravintolaan ja zoomaa
        map.setView([nearestRestaurant.lat, nearestRestaurant.lon], 15);
    }
}


const displayRestaurants = (restaurants) => {
    navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        console.log("Oma sijainti: " + userLocation.latitude + ", " + userLocation.longitude);

    }, function (error) {
        console.error("Virhe käyttäjän sijainnin hakemisessa:", error);
    });

    restaurants.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const table = document.querySelector('table');
    table.innerHTML = '';

    restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]]).addTo(map);
        marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}</p><p>${restaurant.menu}`);
        marker.openPopup();
        const row = restaurantRow(restaurant);

        row.addEventListener('click', async () => {
            document.querySelectorAll('tr').forEach(item => {
                item.classList.remove('highlight');
            });

            row.classList.add('highlight');

            try {
                openModal(restaurant, 'weekly');
            } catch (error) {
                handleError(error);
            }
        });

        table.appendChild(row);
    });
};

const openModal = async (restaurant) => {
    const modal = document.createElement('dialog');
    const restaurantContent = restaurantModal(restaurant);

    const selectMenu = document.createElement('select');
    selectMenu.id = 'menuType';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Menu';
    selectMenu.appendChild(defaultOption);

    const dailyOption = document.createElement('option');
    dailyOption.value = 'daily';
    dailyOption.textContent = 'Päivän Menu';
    selectMenu.appendChild(dailyOption);

    const weeklyOption = document.createElement('option');
    weeklyOption.value = 'weekly';
    weeklyOption.textContent = 'Viikon Menu';
    selectMenu.appendChild(weeklyOption);

    modal.appendChild(restaurantContent);
    modal.appendChild(selectMenu);
    document.body.appendChild(modal);

    modal.showModal();

    selectMenu.addEventListener('change', async () => {
        const menuType = selectMenu.value;
        try {
            let menuContent;
            if (menuType === 'daily') {
                const menu = await fetchDailyMenu(restaurant._id);
                menuContent = dailyModal(menu);
            } else if (menuType === 'weekly') {
                const menu = await fetchWeeklyMenu(restaurant._id);
                menuContent = weeklyModal(menu);
            } else {
                throw new Error('Invalid menu type');
            }

            modal.innerHTML = menuContent;

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => {
                modal.close();
            });

            modal.appendChild(closeButton);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        modal.close();
    });

    modal.appendChild(closeButton);
};


const handleError = (error) => {
    console.log("error " + error);
    alert('Failed to fetch data. Please try again later.');
};


const handleFilterChange = (restaurants) => {
    const selectedCity = document.getElementById('filterCity').value;
    const selectedCompany = document.getElementById('filterCompany').value;

    const filteredRestaurants = restaurants.filter(restaurant => {
        const cityMatch = !selectedCity || restaurant.city === selectedCity;
        const companyMatch = !selectedCompany || restaurant.company === selectedCompany;
        return cityMatch && companyMatch;
    });

    displayRestaurants(filteredRestaurants);
};

const populateCities = async () => {
    const select = document.getElementById('filterCity');
    const cities = await fetchCitiesFromAPI();

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });

};

getAPI();

