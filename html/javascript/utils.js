'use strict';

import { baseUrl, menuURL, menuURL2 } from "./variables.js";

function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

const errorMessages = {
    EN: {
        fetchError: 'Failed to fetch restaurant data. Please try again later.',
        dailyMenuError: 'Failed to fetch daily menu data.',
        weeklyMenuError: 'Failed to fetch weekly menu data.',
    },
    SV: {
        fetchError: 'Misslyckades med att hämta restaurangdata. Försök igen senare.',
        dailyMenuError: 'Misslyckades med att hämta dagens menydata.',
        weeklyMenuError: 'Misslyckades med att hämta veckomenydata.',
    },
    FI: {
        fetchError: 'Ravintolatietojen hakeminen epäonnistui. Yritä myöhemmin uudelleen.',
        dailyMenuError: 'Päivämenun tietojen hakeminen epäonnistui.',
        weeklyMenuError: 'Viikkomenu tietojen hakeminen epäonnistui.',
    }
};

function showAlert(errorKey) {
    const selectedLanguage = getSelectedLanguage();
    const message = errorMessages[selectedLanguage][errorKey];
    alert(message);
}

const fetchAPI = async () => {
    try {
        const response = await fetch(`${baseUrl}`);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['fetchError']);
        }
        return await response.json();
    } catch (error) {
        showAlert('fetchError');
    }
};

const fetchDailyMenu = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL}/${restaurantID}/fi`);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['dailyMenuError']);
        }
        return await response.json();
    } catch (error) {
        showAlert('dailyMenuError');
        throw error;
    }
};

const fetchDailyMenuEN = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL}/${restaurantID}/en`);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['dailyMenuError']);
        }
        return await response.json();
    } catch (error) {
        showAlert('dailyMenuError');
        throw error;
    }
};

const fetchWeeklyMenu = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL2}/${restaurantID}/fi`);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['weeklyMenuError']);
        }
        return await response.json();
    } catch (error) {
        showAlert('weeklyMenuError');
        throw error;
    }
};

const fetchWeeklyMenuEN = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL2}/${restaurantID}/en`);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['weeklyMenuError']);
        }
        return await response.json();
    } catch (error) {
        showAlert('weeklyMenuError');
        throw error;
    }
};

const fetchCitiesFromAPI = async () => {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error(errorMessages[getSelectedLanguage()]['fetchError']);
        }
        const restaurants = await response.json();

        const cities = restaurants.map(restaurant => restaurant.city);
        const uniqueCities = [...new Set(cities)];
        return uniqueCities;
    } catch (error) {
        showAlert('fetchError');
        throw error;
    }
};

export {
    fetchAPI, fetchDailyMenu, fetchWeeklyMenu,
    fetchCitiesFromAPI, fetchDailyMenuEN, fetchWeeklyMenuEN
};