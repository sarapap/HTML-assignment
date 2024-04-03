'use script';

const restaurantRow = (restaurant) => {
    const { name, address } = restaurant;

    const row = document.createElement('tr');

    row.innerHTML = `<td>${name}</td><td>${address}</td>`;

    return row;
};

const restaurantModal = (restaurant, menu) => {
    const { name, address, postalCode, city, phone, company } = restaurant;
    const { courses } = menu;
    const menuHTML = courses.map(course => {
        return `<li>${course.name}: ${course.price} ${course.diets}</li>`;
    }).join('');

    const html = `<div><p>Name: ${name}</p><p>Address: ${address}</p><p>Postal code: ${postalCode}</p>
    <p>City: ${city}</p><p>Phone: ${phone}</p><p>Company: ${company}</p></div><h3>Menu</h3><ul>${menuHTML}</ul>`;

    return html;
};

export { restaurantModal, restaurantRow };