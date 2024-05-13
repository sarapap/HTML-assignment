'use strict';

// lisää suosikit taulu
document.addEventListener("DOMContentLoaded", () => {
    const selectedLanguage = getSelectedLanguage();

    const translations = {
        EN: {
            noFavorites: "No favorites. Add some restaurants to your favorites!",
            alertLogin: "Please log in to see your favorites.",
            deleteButton: "Delete",
            nameColumn: "Name",
            addressColumn: "Address",
            deleteColumn: "Remove from favorites"
        },
        SV: {
            noFavorites: "Inga favoriter. Lägg till några restauranger i dina favoriter!",
            alertLogin: "Logga in för att se dina favoriter.",
            deleteButton: "Ta bort",
            nameColumn: "Namn",
            addressColumn: "Adress",
            deleteColumn: "Ta bort från favoriter"
        },
        FI: {
            noFavorites: "Ei suosikkeja. Lisää ravintoloita suosikkeihin!",
            alertLogin: "Kirjaudu sisään nähdäksesi suosikkisi.",
            deleteButton: "Poista",
            nameColumn: "Nimi",
            addressColumn: "Osoite",
            deleteColumn: "Poista suosikeista"
        }
    };

    const token = localStorage.getItem("authToken");

    const eisuosikkeja = document.getElementById("eisuosikkeja");
    if (!token) {
        eisuosikkeja.innerHTML = translations[selectedLanguage].alertLogin;
        return;
    }

    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    const parsedPayload = JSON.parse(payload);

    const userId = parsedPayload.user_id;

    const favoritesKey = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    const dialog = document.querySelector("dialog");

    if (favorites.length === 0) {
        dialog.innerHTML = `<p>${translations[selectedLanguage].noFavorites}</p>`;
    } else {
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `<th>${translations[selectedLanguage].nameColumn}</th><th>${translations[selectedLanguage].addressColumn}</th><th>${translations[selectedLanguage].deleteColumn}</th>`;
        table.appendChild(headerRow);

        favorites.forEach((restaurant, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${restaurant.name}</td><td>${restaurant.address}</td>`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = translations[selectedLanguage].deleteButton;
            deleteButton.addEventListener("click", () => {
                favorites.splice(index, 1);
                localStorage.setItem(favoritesKey, JSON.stringify(favorites));
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
