'use strict';

/*funktio kielen vaihtoon */
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('button1');

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const data = {
                username: username,
                password: password,
            };

            fetch('http://localhost:3000/api/v1/kayttaja/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Kirjautuminen epäonnistui');
                    }
                })
                .then(data => {
                    const token = data.token;

                    if (token) {
                        localStorage.setItem('authToken', token);
                        switch (selectedLanguage) {
                            case 'EN':
                                targetPage = '../../html/en/käyttäjä_en.html';
                                break;
                            case 'SV':
                                targetPage = '../../html/sv/käyttäjä_sv.html';
                                break;
                            case 'FI':
                            default:
                                targetPage = '../../html/fi/käyttäjä.html';
                                break;
                        }
                        window.location.href = targetPage;
                    } else {
                        switch (selectedLanguage) {
                            case 'EN':
                                targetPage = '../../html/en/page5_en.html';
                                break;
                            case 'SV':
                                targetPage = '../../html/sv/page5_sv.html';
                                break;
                            case 'FI':
                            default:
                                targetPage = '../../html/fi/page5.html';
                                break;
                        }
                        window.location.href = targetPage;

                    }
                })
                .catch(error => {
                    alert('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
                });
        });
    }

    const links = document.querySelectorAll('a');

    links.forEach(link => {
        if (link.href.endsWith('page5.html')) {
            link.addEventListener('click', function (event) {
                event.preventPreventDefault();

                const authToken = localStorage.getItem('authToken');

                if (authToken) {
                    window.location.href = '../fi/käyttäjä.html';
                } else {
                    window.location.href = '../fi/page5.html';
                }
            });
        }
    });
});

