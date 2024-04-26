'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const dialog = document.querySelector("dialog");
    dialog.style.display = "flex";

    if (favorites.length === 0) {
        dialog.innerHTML = "<p>There are no favorite restaurants. Add restaurants to favorites!</p>";
    } else {
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Name</th><th>Address</th><th>Remove from favorites</th>";
        table.appendChild(headerRow);

        favorites.forEach((restaurant, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${restaurant.name}</td><td>${restaurant.address}</td>`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                favorites.splice(index, 1);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                location.reload();
            });

            const actionCell = document.createElement("td");
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            table.appendChild(row);
        });

        dialog.appendChild(table);
    }
});