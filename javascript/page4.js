'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.querySelector('.register-form'); // Varmista oikea luokka tai ID

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const data = {
                name: document.getElementById('firstname') ? document.getElementById('firstname').value : '',
                lastname: document.getElementById('lastname') ? document.getElementById('lastname').value : '',
                username: document.getElementById('tunnus') ? document.getElementById('tunnus').value : '',
                password: document.getElementById('password') ? document.getElementById('password').value : '',
                email: document.getElementById('email') ? document.getElementById('email').value : '',
                phone: document.getElementById('phone') ?
                    (isNaN(parseInt(document.getElementById('phone').value)) ? null : parseInt(document.getElementById('phone').value))
                    : null,

            };

            if (!data.name || !data.lastname || !data.email || !data.username || !data.password) {
                alert('Kaikki pakolliset kentät on täytettävä.');
                return;
            }


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
                    const token = data.token;

                    if (token) {
                        localStorage.setItem('authToken', token);

                        const kieli = document.getElementById('kieli');
                        const selectedLanguage = kieli && kieli.value ? kieli.value : 'FI';

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
                        alert('Rekisteröinti epäonnistui. Yritä uudelleen.');
                    }
                })
                .catch(error => {
                    console.error('Virhe rekisteröinnissä:', error);
                    alert('Rekisteröinti epäonnistui. Yritä uudelleen.');
                });
        });
    }
});