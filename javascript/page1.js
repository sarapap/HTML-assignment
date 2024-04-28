'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        if (link.href.endsWith('page5.html')) {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const authToken = localStorage.getItem('authToken');

                if (authToken) {
                    window.location.href = 'käyttäjä.html';
                } else {
                    window.location.href = 'page5.html';
                }
            });
        }
    });
});