'use strict';

// Tarkistaa, onko käyttäjä jo kirjautunut
window.onload = function () {
    if (localStorage.getItem('loggedIn') === 'true') {
        // Jos käyttäjä on kirjautunut, ohjaa hänet etusivulle
        window.location.href = 'etusivu.html'; // Vaihda etusivu.html oikeaksi etusivun tiedostopolkusi mukaan
    }
};

// Kuuntelee kirjautumisnapin painallusta
document.getElementById('button1').addEventListener('click', function () {
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    // Tässä voit tarkistaa käyttäjänimen ja salasanan oikeellisuuden
    // Tässä vain yksinkertainen esimerkki, jossa oletetaan, että oikea käyttäjänimi on "admin" ja salasana on "password"
    if (username === 'admin' && password === 'password') {
        // Tallentaa kirjautumisen tilan paikalliseen varastoon
        localStorage.setItem('loggedIn', 'true');
        // Ohjaa käyttäjän etusivulle
        window.location.href = 'etusivu.html'; // Vaihda etusivu.html oikeaksi etusivun tiedostopolkusi mukaan
    } else {
        alert('Väärä käyttäjätunnus tai salasana');
    }
});
