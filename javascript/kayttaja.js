'use strict';

/* kirjaudu ulos */

function logOut() {
    localStorage.removeItem('authToken');

    const kieli = document.getElementById('kieli');
    const selectedLanguage = kieli && kieli.value ? kieli.value : 'FI';

    let logoutPage = '';
    switch (selectedLanguage) {
        case 'EN':
            logoutPage = 'page5_en.html';
            break;
        case 'SV':
            logoutPage = 'page5_sv.html';
            break;
        case 'FI':
        default:
            logoutPage = 'page5.html';
            break;
    }
    window.location.href = logoutPage;
}

/* tiedot esille */

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("Authentication token not found.");
        return;
    }

    let userId;

    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        const parsedPayload = JSON.parse(payload);

        userId = parsedPayload.user_id;

        const response = await fetch(`http://localhost:3000/api/v1/kayttaja/info/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching user information.");
        }

        const userData = await response.json();
        const userName = userData.nimi || "";
        const userUsername = userData.tunnus || "";
        const userEmail = userData.email || "";
        const userPhone = userData.puhelin || "";

        const kieli = document.getElementById("kieli");
        const selectedLanguage = kieli && kieli.value ? kieli.value : 'FI';

        const translations = {
            FI: {
                title: "Omat tiedot",
                name: "Nimi",
                username: "Tunnus",
                email: "Sähköposti",
                phone: "Puhelin",
                logOut: "Kirjaudu ulos",
            },
            EN: {
                title: "Personal Information",
                name: "Name",
                username: "Username",
                email: "Email",
                phone: "Phone",
                logOut: "Log out",
            },
            SV: {
                title: "Personlig information",
                name: "Namn",
                username: "Användarnamn",
                email: "E-post",
                phone: "Telefon",
                logOut: "Logga ut",
            },
        };

        const t = translations[selectedLanguage];

        const omatTiedotSection = document.getElementById("tiedot");

        if (!omatTiedotSection) {
            console.error("Element with ID 'tiedot' not found.");
            return;
        }

        omatTiedotSection.innerHTML = `
            <h2>${t.title}</h2><br>
            <p>${t.name}: ${userName}</p>
            <p>${t.username}: ${userUsername}</p>
            <p>${t.email}: ${userEmail}</p>
            <p>${t.phone}: ${userPhone}</p>
            <p><button class="logOut" onclick="logOut()">${t.logOut}</button></p>
        `;

    } catch (error) {
        console.error("Error fetching user information:", error.message);
    }
});

/* tietojen muokkaus */

async function submitForm(event) {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    const form = document.getElementById("profile-form");
    const formData = new FormData(form);

    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    const parsedPayload = JSON.parse(payload);
    const userId = parsedPayload.user_id;

    try {
        const response = await fetch(`http://localhost:3000/api/v1/kayttaja/info/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const kieli = document.getElementById('kieli');
            const selectedLanguage = kieli && kieli.value ? kieli.value : 'FI';

            let targetPage = '';
            switch (selectedLanguage) {
                case 'EN':
                    alert("Information updated successfully.");
                    targetPage = '../../html/en/käyttäjä_en.html';
                    break;
                case 'SV':
                    alert("Informationen har uppdaterats framgångsrikt.");
                    targetPage = '../../html/sv/käyttäjä_sv.html';
                    break;
                case 'FI':
                default:
                    alert("Tiedot päivitetty onnistuneesti.");
                    targetPage = '../../html/fi/käyttäjä.html';
                    break;
            }

            window.location.href = targetPage;
        } else {
            throw new Error('Päivitys epäonnistui');
        }
    } catch (error) {
        alert("Tapahtui virhe: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("tallenna");
    saveButton.addEventListener("click", submitForm);
});

/*salasanan muokkaus */

document.addEventListener('DOMContentLoaded', function () {
    const changePasswordForm = document.getElementById("changePasswordForm");

    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const token = localStorage.getItem("authToken");

            if (!token) {
                console.error("Autentikointitokenia ei löydy.");
                alert("Ole hyvä ja kirjaudu sisään.");
                return;
            }

            const base64Payload = token.split('.')[1];
            const payload = atob(base64Payload);
            const parsedPayload = JSON.parse(payload);

            const userID = parsedPayload.user_id;

            const newPassword = document.getElementById("password").value;
            const confirmPassword = document.getElementById("newPassword").value;

            if (newPassword !== confirmPassword) {
                alert("Uusi salasana ja vahvistus eivät täsmää.");
                return;
            }

            if (!newPassword) {
                alert("Uusi salasana on pakollinen.");
                return;
            }

            fetch(`http://localhost:3000/api/v1/kayttaja/password/${userID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    salasana: newPassword,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        const kieli = document.getElementById('kieli');
                        const selectedLanguage = kieli && kieli.value ? kieli.value : 'FI';

                        let targetPage = '';
                        switch (selectedLanguage) {
                            case 'EN':
                                alert("Password has been updated.");
                                targetPage = '../../html/en/käyttäjä_en.html';
                                break;
                            case 'SV':
                                alert("Lösenordet har ändrats.");
                                targetPage = '../../html/sv/käyttäjä_sv.html';
                                break;
                            case 'FI':
                            default:
                                alert("Salasana on vaihdettu.");
                                targetPage = '../../html/fi/käyttäjä.html';
                                break;
                        }

                        window.location.href = targetPage;
                    } else {
                        alert("Virhe salasanan päivityksessä.");
                    }
                })
                .catch((error) => {
                    console.error("Virhe salasanan päivityksessä:", error);
                    alert("Jotain meni pieleen.");
                });
        });
    } else {
        console.error("Elementtiä 'changePasswordForm' ei löydy.");
    }
});
