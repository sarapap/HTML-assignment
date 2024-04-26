'use strict';

import { restaurantModal, dailyModal, weeklyModal, restaurantRow } from "./components.js";
import { fetchAPI, fetchDailyMenu, fetchWeeklyMenu, fetchCitiesFromAPI } from "./utils.js";

// kartta

const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


// api

let ravintolat;

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
};

// kartalle

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
    restaurants.sort((a, b) => a.name.localeCompare(b.name));

    const table = document.querySelector('table');
    table.innerHTML = '';

    // kartta

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            map.setView([userLat, userLon], 13);

            const redIcon = L.icon({
                iconUrl: '../../css/kuvat/redMarker.png',
                iconSize: [70, 60],

            });

            const defaultIcon = L.icon({
                iconUrl: '../../css/kuvat/marker.png',
                iconSize: [45, 45],

            });

            L.marker([userLat, userLon], { icon: redIcon })
                .addTo(map)
                .bindPopup('Oma sijainti')
                .openPopup();

            let nearestRestaurant = null;
            let minDistance = Infinity;

            ravintolat.forEach((restaurant) => {
                const distance = getDistance(
                    userLat,
                    userLon,
                    restaurant.location.coordinates[1],
                    restaurant.location.coordinates[0]
                );
                if (distance < minDistance) {
                    nearestRestaurant = restaurant;
                    minDistance = distance;
                }
            });

            ravintolat.forEach((restaurant) => {
                const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], { icon: defaultIcon }).addTo(map);

                marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`);

                if (restaurant === nearestRestaurant) {
                    // Korosta lähintä ravintolaa
                    marker.setOpacity(0.8);
                    setInterval(() => {
                        marker.setOpacity(marker.options.opacity === 1 ? 0.5 : 1);
                    }, 500);
                    marker.openPopup();
                }
            });
        },
        (error) => {
            console.error('Virhe sijainnin haussa:', error);
        }
    );

    // ravintola lista

    restaurants.forEach(restaurant => {
        const row = restaurantRow(restaurant);

        row.addEventListener('click', async () => {
            document.querySelectorAll('tr').forEach(item => {
                item.classList.remove('highlight');
            });

            row.classList.add('highlight');

            try {
                openModal(restaurant);
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
    dailyOption.textContent = 'Daily';
    selectMenu.appendChild(dailyOption);

    const weeklyOption = document.createElement('option');
    weeklyOption.value = 'weekly';
    weeklyOption.textContent = 'Weekly';
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
                const otsikko = document.createElement('h4');
                otsikko.id = 'otsikko';
                otsikko.textContent = 'Tässä Päivän Menu';
                modal.appendChild(otsikko);
            } else if (menuType === 'weekly') {
                const menu = await fetchWeeklyMenu(restaurant._id);
                menuContent = weeklyModal(menu);
            } else {
                throw new Error('Invalid menu type');
            }

            modal.innerHTML = menuContent;

            const closeButton = document.createElement('button');
            closeButton.id = 'closeButton';
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
    closeButton.id = 'closeButton';
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