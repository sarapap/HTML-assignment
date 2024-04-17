'use strict';

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