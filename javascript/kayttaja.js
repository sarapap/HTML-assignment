'use strict';

/*funktio kielen vaihtoon */
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

/* kirjaudu ulos */

function logOut() {
    localStorage.removeItem('authToken');

    const selectedLanguage = getSelectedLanguage();

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
    const selectedLanguage = getSelectedLanguage();

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
            switch (selectedLanguage) {
                case 'EN':
                    alert("An error occurred: " + error.message);
                    break;
                case 'SV':
                    alert("Ett fel inträffade: " + error.message);
                    break;
                case 'FI':
                default:
                    alert("Tapahtui virhe: " + error.message);
                    break;
            }
        }

        const userData = await response.json();
        const userName = userData.nimi || "";
        const userUsername = userData.tunnus || "";
        const userEmail = userData.email || "";
        const userPhone = userData.puhelin || "";

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

        omatTiedotSection.innerHTML = `
            <h2>${t.title}</h2><br>
            <p>${t.name}: ${userName}</p>
            <p>${t.username}: ${userUsername}</p>
            <p>${t.email}: ${userEmail}</p>
            <p>${t.phone}: ${userPhone}</p>
            <p><button class="logOut" onclick="logOut()">${t.logOut}</button></p>
        `;

    } catch (error) {
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

    const selectedLanguage = getSelectedLanguage();

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
            switch (selectedLanguage) {
                case 'EN':
                    alert("Update was not successful.");
                    break;
                case 'SV':
                    alert("Uppdateringen var inte framgångsrik.");
                    break;
                case 'FI':
                default:
                    alert("Päivitys ei onnistunut.");
                    break;
            }
        }
    } catch (error) {
        switch (selectedLanguage) {
            case 'EN':
                alert("An error occurred: " + error.message);
                break;
            case 'SV':
                alert("Ett fel inträffade: " + error.message);
                break;
            case 'FI':
            default:
                alert("Tapahtui virhe: " + error.message);
                break;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("tallenna");
    saveButton.addEventListener("click", submitForm);
});

/*salasanan muokkaus */

document.addEventListener('DOMContentLoaded', function () {
    const changePasswordForm = document.getElementById("changePasswordForm");
    const selectedLanguage = getSelectedLanguage();

    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const token = localStorage.getItem("authToken");

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
                        switch (selectedLanguage) {
                            case 'EN':
                                alert("Error updating password.");
                                break;
                            case 'SV':
                                alert("Fel vid uppdatering av lösenord.");
                                break;
                            case 'FI':
                            default:
                                alert("Virhe salasanan päivityksessä.");
                                break;
                        }
                    }
                })
                .catch((error) => {
                    switch (selectedLanguage) {
                        case 'EN':
                            alert("Something went wrong.");
                            break;
                        case 'SV':
                            alert("Något gick fel.");
                            break;
                        case 'FI':
                        default:
                            alert(catchError = "Jotain meni pieleen.");
                            break;
                    }
                });
        });
    }
});
