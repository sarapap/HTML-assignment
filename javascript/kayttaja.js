'use strict';

document.querySelector('.profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('picture', document.getElementById('picture-input').files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Kuvan lataaminen epäonnistui');
        }

        alert('Kuva ladattu onnistuneesti');
        // Voit päivittää profiilikuvan esikatselun tässä
    } catch (error) {
        console.error('Virhe kuvan lataamisessa:', error);
        alert('Kuvan lataaminen epäonnistui');
    }
});
