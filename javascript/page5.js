document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('button1');

    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;  // Hae käyttäjätunnus
            const password = document.getElementById('login-password').value;  // Hae salasana

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
                    console.log('Kirjautuminen onnistui:', data);
                    window.location.href = '../fi/käyttäjä.html';
                })
                .catch(error => {
                    console.error('Virhe kirjautumisessa:', error);
                    alert('Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana.');
                });
        });
    } else {
        console.error('Kirjautumispainiketta ei löydy');
    }
});

document.addEventListener('DOMContentLoaded', function () {
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
});


