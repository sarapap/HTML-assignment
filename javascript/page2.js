'use strict';

import { restaurantModal, dailyModal, weeklyModal, restaurantRow } from "./components.js";
import { fetchAPI, fetchDailyMenu, fetchWeeklyMenu, fetchCitiesFromAPI } from "./utils.js";

const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let ravintolat;
ravintolat = null;

const getAPI = async () => {
    try {
        ravintolat = await fetchAPI('restaurants');
        displayRestaurants(ravintolat);

        document.getElementById('filterCity').addEventListener('change', () => handleFilterChange(ravintolat));
        document.getElementById('filterCompany').addEventListener('change', () => handleFilterChange(ravintolat));
        populateCities();
    } catch (error) {
        handleError(error);
    }

    const highlightedIcon = L.icon({
        iconUrl: '../css/kuvat/usericon.png',
        iconSize: [45, 100],
    });

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            map.setView([userLat, userLon], 13);

            let nearestRestaurant = null;
            let minDistance = Infinity;

            L.marker([userLat, userLon]).addTo(map).bindPopup('Oma sijainti').openPopup();

            ravintolat.forEach((restaurant) => {
                const distance = getDistance(userLat, userLon, restaurant.lat, restaurant.lon);
                if (distance < minDistance) {
                    nearestRestaurant = restaurant;
                    minDistance = distance;
                }
            });

            if (nearestRestaurant) {
                // Erityinen kuvake lähimmälle ravintolalle
                const highlightedIcon = L.icon({
                    iconUrl: 'path/to/special_marker_icon.png', // Korostettu kuvake
                    iconSize: [45, 100], // Esimerkiksi isompi kuvake
                });

                // Lisää korostettu markkeri ja popup-lähimmälle ravintolalle
                const nearestMarker = L.marker([nearestRestaurant.lat, nearestRestaurant.lon], {
                    icon: highlightedIcon,
                }).addTo(map);

                nearestMarker.bindPopup(`<h3>${nearestRestaurant.name}</h3><p>${nearestRestaurant.address}</p><p>${nearestRestaurant.menu}`).openPopup();

                // Zoomaa karttaa korostettuun ravintolaan
                map.setView([nearestRestaurant.lat, nearestRestaurant.lon], 15);
            }
        },
        (error) => {
            console.error('Virhe sijainnin haussa:', error);
        }
    );
};

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


const displayRestaurants = (restaurants) => {
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