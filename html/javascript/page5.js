'use strict';

/*funktio kielen vaihtoon */
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('button1');
    const selectedLanguage = getSelectedLanguage();

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const data = {
                username: username,
                password: password,
            };

            fetch('http://localhost:3000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                })

                .then(data => {
                    const token = data.token;

                    if (token) {
                        localStorage.setItem('authToken', token);
                        let targetPage = '';
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
                                alert('Login failed. Please check your username and password.');
                                targetPage = '../../html/en/page5_en.html';
                                break;
                            case 'SV':
                                alert('Inloggningen misslyckades. Kontrollera användarnamn och lösenord.');
                                targetPage = '../../html/sv/page5_sv.html';
                                break;
                            case 'FI':
                            default:
                                alert('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
                                targetPage = '../../html/fi/page5.html';
                                break;
                        }
                        window.location.href = targetPage;

                    }
                })
                .catch(error => {
                    switch (selectedLanguage) {
                        case 'EN':
                            alert('Login failed.');
                            break;
                        case 'SV':
                            alert('Inloggningen misslyckades.');
                            break;
                        case 'FI':
                        default:
                            alert('Kirjautuminen epäonnistui.');
                            break;
                    }
                });
        });
    }

    const links = document.querySelectorAll('a');

    links.forEach(link => {
        if (link.href.endsWith('page5.html')) {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const authToken = localStorage.getItem('authToken');
                const selectedLanguage = getSelectedLanguage();

                let targetPage = '';
                if (authToken) {
                    switch (selectedLanguage) {
                        case 'EN':
                            targetPage = '../en/käyttäjä_en.html';
                            break;
                        case 'SV':
                            targetPage = '../sv/käyttäjä_sv.html';
                            break;
                        case 'FI':
                        default:
                            targetPage = '../fi/käyttäjä.html';
                            break;
                    }
                } else {
                    switch (selectedLanguage) {
                        case 'EN':
                            targetPage = '../en/page5_en.html';
                            break;
                        case 'SV':
                            targetPage = '../sv/page5_sv.html';
                            break;
                        case 'FI':
                        default:
                            targetPage = '../fi/page5.html';
                            break;
                    }
                }
                window.location.href = targetPage;
            });
        }
    });

});

