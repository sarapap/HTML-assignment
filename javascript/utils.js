'use script';

import { baseUrl } from "./variables.js";

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

export { fetchAPI };