'use strict';

window.onload = function () {
    if (localStorage.getItem('loggedIn') === 'true') {
        window.location.href = '../fi/käyttäjä.html';
    }
};

document.getElementById('button1').addEventListener('click', function () {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    if (checkCredentials(username, password)) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = '../fi/käyttäjä.html';
    } else {
        alert('Väärä käyttäjätunnus tai salasana');
    }
});

import promisePool from 'utils/database.js';

async function checkCredentials(username, password) {
    try {
        const [rows, fields] = await promisePool.execute(
            'SELECT * FROM wsk_users WHERE kayttajatunnus = ? AND salasana = ?',
            [username, password]
        );

        if (rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Virhe tietojen tarkistamisessa tietokannasta:', error);
        return false;
    }
}

export default checkCredentials;

