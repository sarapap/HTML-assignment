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
                    }

                    if (token) {
                        window.location.href = '../fi/käyttäjä.html';
                    } else {
                        window.location.href = '../fi/page5.html';
                    }
                })
                .catch(error => {
                    console.error('Virhe kirjautumisessa:', error);
                    alert('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
                });
        });
    } else {
        console.error('Kirjautumispainiketta ei löydy');
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


/*document.addEventListener('DOMContentLoaded', function () {
    const userLink = document.querySelector('.rightLI a');

    const isLoggedIn = document.cookie.includes('auth_token');

    if (userLink) {
        userLink.addEventListener('click', function (event) {
            if (isLoggedIn) {
                event.preventDefault();
                window.location.href = '../fi/käyttäjä.html';
            } else {
                event.preventDefault();
                window.location.href = '../fi/page5.html';
            }
        });
    }
});*/


