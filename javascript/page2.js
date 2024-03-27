'use script';

const map = L.map('map').setView([60.2826627, 25.0101836], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

async function getAPI() {
    try {
        const response = await fetch('https://10.120.32.94/restaurant/api/v1/restaurants');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const restaurants = await response.json();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        alert('Failed to fetch restaurant data. Please try again later.');
    }
}

function displayRestaurants(restaurants) {
    const table = document.querySelector('table');
    restaurants.forEach(restaurant => {
        const row = document.createElement('tr');

        const nameTD = document.createElement('td');
        nameTD.textContent = restaurant.name;

        nameTD.addEventListener('click', async () => {
            document.querySelectorAll('td').forEach(item => {
                item.classList.remove('highlight');
            });

            nameTD.classList.add('highlight');
            openModal(restaurant)
        });

        row.appendChild(nameTD);

        const addressTD = document.createElement('td');
        addressTD.textContent = restaurant.address;
        row.appendChild(addressTD);

        table.appendChild(row);
    });
}

getAPI();