const registerForm = document.querySelector('.register-form');

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        name: document.getElementById('register-name').value,
        lastname: document.getElementById('register-lastname').value,
        username: document.getElementById('register-username').value,
        password: document.getElementById('register-password').value,
        email: document.getElementById('register-email').value,
        phone: document.getElementById('register-number').value
    };

    fetch('http://localhost:3000/api/v1/kayttaja', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Rekisteröinti epäonnistui');
            }
        })
        .then(data => {
            console.log('Rekisteröinti onnistui:', data);
            window.location.href = '../fi/käyttäjä.html';
        })
        .catch(error => {
            console.error('Virhe rekisteröinnissä:', error);
            alert('Rekisteröinti epäonnistui. Yritä uudelleen.');
        });
});

