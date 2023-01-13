(function() {
    const lat = -34.6031759;
    const lng = -58.3766767;
    const mapa = L.map('mapa').setView([lat, lng ], 18);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()
