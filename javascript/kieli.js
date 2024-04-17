'use strict';

document.getElementById("kieli").addEventListener("change", function () {
    var selectedLanguage = this.value;
    if (selectedLanguage === 'FI') {
        window.location.href = '../fi/1Etusivu.html';
    } else if (selectedLanguage === 'EN') {
        window.location.href = '../en/1Etusivu_en.html';
    } else if (selectedLanguage === 'SV') {
        window.location.href = "../sv/1Etusivu_sv.html";
    }
});