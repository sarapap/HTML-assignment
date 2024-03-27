'use script';

/*function openModal(restaurant) {
    const modal = document.querySelector('dialog');
    const modalContent = document.createElement('div');

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        modal.close();
    });

    modalContent.appendChild(closeButton);

    const name = document.createElement('p');
    name.textContent = restaurant.name;
    modalContent.appendChild(name);

    const address = document.createElement('p');
    address.textContent = restaurant.address;
    modalContent.appendChild(address);

    const postal = document.createElement('p');
    postal.textContent = restaurant.postalCode;
    modalContent.appendChild(postal);

    const city = document.createElement('p');
    city.textContent = restaurant.city;
    modalContent.appendChild(city);

    const phone = document.createElement('p');
    phone.textContent = restaurant.phone;
    modalContent.appendChild(phone);

    const company = document.createElement('p');
    company.textContent = restaurant.company;
    modalContent.appendChild(company);



    modal.innerHTML = '';
    modal.appendChild(modalContent);

    modal.showModal();
}
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// A function that is called when location information is retrieved
function success(pos) {
    const crd = pos.coords;

    // Printing location information to the console
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    // Use the leaflet.js library to show the location on the map (https://leafletjs.com/)
    const map = L.map('map').setView([crd.latitude, crd.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([crd.latitude, crd.longitude]).addTo(map)
        .bindPopup('I am here.')
        .openPopup();
}

// Function to be called if an error occurs while retrieving location information
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Starts the location search
navigator.geolocation.getCurrentPosition(success, error, options);*/