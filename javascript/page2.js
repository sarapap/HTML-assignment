'use script';

const map = L.map('map').setView([60.2826627, 25.0101836], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// ravintolat

import { restaurantModal, restaurantRow } from "./components.js";
import { fetchAPI } from "./utils.js";

const getAPI = async () => {
    try {
        const response = await fetchAPI('restaurants');
        displayRestaurants(response);
        document.getElementById('companyFilter').addEventListener('change', () => handleFilterChange(response));
    } catch (error) {
        handleError(error);
    }
};


const getMenu = async (restaurantID) => {
    try {
        const response = await fetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurantID}/fi`);
        if (!response.ok) {
            throw new Error('Failed to fetch menu data');
        }
        const menu = await response.json();
        return menu;
    } catch (error) {
        handleError(error);
    }
};

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
                const menu = await getMenu(restaurant._id);
                openModal(restaurant, menu);
            } catch (error) {
                handleError(error);
            }
        });

        table.appendChild(row);
    });
};

const openModal = (restaurant, menu) => {
    const modal = document.querySelector('dialog');
    const modalContent = restaurantModal(restaurant, menu);
    modal.innerHTML = modalContent;
    modal.showModal();

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
    const selectedCompany = document.getElementById('companyFilter').value;
    const filteredRestaurants = [];

    restaurants.forEach(restaurant => {
        if (selectedCompany && restaurant.company === selectedCompany) {
            filteredRestaurants.push(restaurant);
        } else if (!selectedCompany) {
            filteredRestaurants.push(restaurant);
        }
    });

    displayRestaurants(filteredRestaurants);
};

getAPI();

