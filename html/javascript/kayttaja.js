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

        const response = await fetch(`http://localhost:3000/api/v1/users/info/${userId}`, {
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
            <p><button class="logOut" onclick="logOut()"><b>${t.logOut}</b></button></p>
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
        const response = await fetch(`http://localhost:3000/api/v1/users/info/${userId}`, {
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

            fetch(`http://localhost:3000/api/v1/users/password/${userID}`, {
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

/* profiilikuva */

localStorage.removeItem('profilePictureFilename');

document.addEventListener('DOMContentLoaded', async function () {
    const profilePictureInput = document.getElementById('picture');
    const profilePicture = document.getElementById('profile-picture');
    const uploadButton = document.getElementById('uploadButton');

    const token = localStorage.getItem("authToken");

    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    const parsedPayload = JSON.parse(payload);

    const userID = parsedPayload.user_id;

    const storedProfilePic = localStorage.getItem('profilePictureFilename');
    if (storedProfilePic) {
        profilePicture.src = `/uploads/${storedProfilePic}`;
    } else {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/users/avatar/${userID}`);
            if (response.ok) {
                const userData = await response.json();

                const profilePictureFilename = userData.userPic;
                profilePicture.src = `/uploads/${profilePictureFilename}`;
                localStorage.setItem('profilePictureFilename', profilePictureFilename);
            }
        } catch (error) {
            const selectedLanguage = getSelectedLanguage();
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

    function previewProfilePicture(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicture.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    uploadButton.addEventListener('click', async function () {
        const file = profilePictureInput.files[0];
        const selectedLanguage = getSelectedLanguage();
        if (!file) {
            switch (selectedLanguage) {
                case 'EN':
                    alert("Select a profile picture.");
                    break;
                case 'SV':
                    alert("Välj en profilbild.");
                    break;
                case 'FI':
                default:
                    alert("Valitse profiilikuva.");
                    break;
            }
            return;
        }

        const formData = new FormData();
        formData.append("kuva", file);

        try {
            const response = await fetch(`http://localhost:3000/api/v1/users/avatar/${userID}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                const profilePictureFilename = result.userPic;
                profilePicture.src = `/uploads/${profilePictureFilename}`;
                localStorage.setItem('profilePictureFilename', profilePictureFilename);
                switch (selectedLanguage) {
                    case 'EN':
                        alert("Profile picture added successfully.");
                        break;
                    case 'SV':
                        alert("Profilbilden har lagts till.");
                        break;
                    case 'FI':
                    default:
                        alert("Profiilikuva lisätty onnistuneesti.");
                        break;
                }
            } else {
                switch (selectedLanguage) {
                    case 'EN':
                        alert("Failed to add picture.");
                        break;
                    case 'SV':
                        alert("Det gick inte att lägga till bilden.");
                        break;
                    case 'FI':
                    default:
                        alert("Kuvan lisääminen epäonnistui.");
                        break;
                }
            }
        } catch (error) {
            switch (selectedLanguage) {
                case 'EN':
                    alert("Something went wrong. Try again.");
                    break;
                case 'SV':
                    alert("Något gick fel. Försök igen.");
                    break;
                case 'FI':
                default:
                    alert("Jotain meni pieleen. Yritä uudelleen.");
                    break;
            }
        }
    });

    profilePictureInput.addEventListener("change", previewProfilePicture);
});











