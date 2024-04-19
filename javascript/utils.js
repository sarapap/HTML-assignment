'use strict';

import { baseUrl, menuURL, menuURL2 } from "./variables.js";

const fetchAPI = async () => {
    try {
        const response = await fetch(`${baseUrl}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        alert('Failed to fetch restaurant data. Please try again later.');
    }
};

const fetchDailyMenu = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL}/${restaurantID}/fi`);
        if (!response.ok) {
            throw new Error('Failed to fetch daily menu data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching daily menu data:', error);
        throw error;
    }
};

const fetchWeeklyMenu = async (restaurantID) => {
    try {
        const response = await fetch(`${menuURL2}/${restaurantID}/fi`);
        if (!response.ok) {
            throw new Error('Failed to fetch weekly menu data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weekly menu data:', error);
        throw error;
    }
};

const fetchCitiesFromAPI = async () => {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch restaurant data');
        }
        const restaurants = await response.json();

        const cities = restaurants.map(restaurant => restaurant.city);
        const city = [...new Set(cities)];

        return city;
    } catch (error) {
        console.error('Error fetching cities from API:', error);
        throw error;
    }
};


export { fetchAPI, fetchDailyMenu, fetchWeeklyMenu, fetchCitiesFromAPI };