'use strict';

/*funktio kielen vaihtoon */
function getSelectedLanguage() {
    const kieli = document.getElementById('kieli');
    return kieli && kieli.value ? kieli.value : 'FI';
}

document.getElementById("kieli").addEventListener("change", function () {
    var selectedLanguage = this.value;
    if (selectedLanguage === 'FI') {
        window.location.href = '../fi/page1.html';
    } else if (selectedLanguage === 'EN') {
        window.location.href = '../en/page1_en.html';
    } else if (selectedLanguage === 'SV') {
        window.location.href = "../sv/page1_sv.html";
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a');

    const loginEndings = ['page5_en.html', 'page5_sv.html', 'page5.html'];

    links.forEach(link => {
        const isLoginLink = loginEndings.some(ending => link.href.endsWith(ending));

        if (isLoginLink) {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const authToken = localStorage.getItem('authToken');

                let redirectPage;

                const selectedLanguage = getSelectedLanguage();

                if (authToken) {
                    switch (selectedLanguage) {
                        case 'EN':
                            redirectPage = '../../html/en/käyttäjä_en.html';
                            break;
                        case 'SV':
                            redirectPage = '../../html/sv/käyttäjä_sv.html';
                            break;
                        case 'FI':
                        default:
                            redirectPage = '../../html/fi/käyttäjä.html';
                            break;
                    }
                } else {
                    switch (selectedLanguage) {
                        case 'EN':
                            redirectPage = '../../html/en/page5_en.html';
                            break;
                        case 'SV':
                            redirectPage = '../../html/sv/page5_sv.html';
                            break;
                        case 'FI':
                        default:
                            redirectPage = '../../html/fi/page5.html';
                            break;
                    }
                }
                window.location.href = redirectPage;
            });
        }
    });
});