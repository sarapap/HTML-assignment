'use strict';

/*funktio kielen vaihtoon */
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

// Komponentit
import {
    restaurantModal,
    dailyModal as dailyModalFI,
    weeklyModal as weeklyModalFI,
    restaurantRow,
    dailyModal as dailyModalEN,
    weeklyModal as weeklyModalEN
} from "./components.js";


// Apufunktiot
import {
    fetchAPI,
    fetchDailyMenu as fetchDailyMenuFI,
    fetchWeeklyMenu as fetchWeeklyMenuFI,
    fetchCitiesFromAPI,
    fetchDailyMenu as fetchDailyMenuEN,
    fetchWeeklyMenu as fetchWeeklyMenuEN
} from "./utils.js";



// Määritetään kartan attribuutit
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const selectedLanguage = getSelectedLanguage();
// Määritetään muuttujat, jotka vaihtelevat kielen mukaan
const dailyModal = selectedLanguage === 'FI' ? dailyModalFI : dailyModalEN;
const weeklyModal = selectedLanguage === 'FI' ? weeklyModalFI : weeklyModalEN;
const fetchDailyMenu = selectedLanguage === 'FI' ? fetchDailyMenuFI : fetchDailyMenuEN;
const fetchWeeklyMenu = selectedLanguage === 'FI' ? fetchWeeklyMenuFI : fetchWeeklyMenuEN;

// API-tietojen haku
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

// Kartan ja ravintoloiden näyttäminen
function displayRestaurants(restaurants) {
    restaurants.sort((a, b) => a.name.localeCompare(b.name));

    const table = document.querySelector('table');
    table.innerHTML = '';

    // Näytetään ravintolat ja käyttäjän sijainti kartalla
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
                .bindPopup(selectedLanguage === 'FI' ? 'Oma sijainti' : 'My location')
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
                const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], { icon: defaultIcon })
                    .addTo(map);

                marker.bindPopup(
                    `<h3>${restaurant.name}</h3><p>${restaurant.address}</p>`
                );

                if (restaurant === nearestRestaurant) {
                    marker.setOpacity(0.8);
                    setInterval(() => {
                        marker.setOpacity(marker.options.opacity === 1 ? 0.5 : 1);
                    }, 500);
                    marker.openPopup();
                }
            });
        },
        (error) => {
            console.error('Error getting location:', error);
        }
    );

    // Näytetään ravintolalista
    restaurants.forEach((restaurant) => {
        const row = restaurantRow(restaurant);

        row.addEventListener('click', async () => {
            document.querySelectorAll('tr').forEach((item) => item.classList.remove('highlight'));

            row.classList.add('highlight');

            try {
                openModal(restaurant);
            } catch (error) {
                handleError(error);
            }
        });

        table.appendChild(row);
    });
}

// Modalin avaaminen
const openModal = async (restaurant) => {
    const modal = document.createElement('dialog');
    const restaurantContent = restaurantModal(restaurant);

    modal.appendChild(restaurantContent);

    const selectMenu = document.createElement('select');
    selectMenu.id = 'menuType';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = selectedLanguage === 'FI' ? 'Valitse menu' : 'Choose menu';
    selectMenu.appendChild(defaultOption);

    const dailyOption = document.createElement('option');
    dailyOption.value = 'daily';
    dailyOption.textContent = selectedLanguage === 'FI' ? 'Päivittäinen' : 'Daily';
    selectMenu.appendChild(dailyOption);

    const weeklyOption = document.createelement('option');
    weeklyOption.value = 'weekly';
    weeklyOption.textContent = selectedLanguage === 'FI' ? 'Viikkokohtainen' : 'Weekly';
    selectMenu.appendChild(weeklyOption);

    modal.appendChild(selectMenu);
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
            closeButton.textContent = selectedLanguage === 'FI' ? 'Sulje' : 'Close';
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
    closeButton.textContent = selectedLanguage === 'FI' ? 'Sulje' : 'Close';
    closeButton.addEventListener('click', () => {
        modal.close();
    });

    modal.appendChild(closeButton);
};

// Virheiden käsittely
const handleError = (error) => {
    console.log("error " + error);
    const errorMessage = selectedLanguage === 'FI' ? 'Tietojen hakeminen epäonnistui. Yritä uudelleen.' : 'Failed to fetch data. Please try again later.';
    alert(errorMessage);
};

// Suodatuksen käsittely
const handleFilterChange = (restaurants) => {
    const selectedCity = document.getElementById('filterCity').value;
    const selectedCompany = document.getElementById('filterCompany').value;

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const cityMatch = !selectedCity || restaurant.city === selectedCity;
        const companyMatch = !selectedCompany || restaurant.company === selectedCompany;
        return cityMatch && companyMatch;
    });

    displayRestaurants(filteredRestaurants);
};

// Kaupunkien täyttö
const populateCities = async () => {
    const select = document.getElementById('filterCity');
    const cities = await fetchCitiesFromAPI();

    cities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
    });
};

getAPI();
