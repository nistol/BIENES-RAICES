(function () {
    const lat = -34.6031759;
    const lng = -58.3766767;
    const mapa = L.map('mapa').setView([lat, lng], 20);

    let marker

    // utilizar provider y geocoder

    const geocoderService= L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // el ping

    marker = new L.marker([lat, lng], {
        draggable: true, // ping mobible    
        autoPan: true,  // cuando moves el ping se autocentra
    }).addTo(mapa)
    // Detectar el movimiento del ping

    marker.on('moveend', function (e) {
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.latLng(posicion.lat, posicion.lng))

        // Obtener informacion de las calles al soltar el pin
        geocoderService.reverse().latlng(posicion, 18).run(function(error,resultado){
            marker.bindPopup(resultado.address.LongLabel)

        // llenar los campos 
        document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
        document.querySelector('#calle').value = resultado?.address?.Address ?? '';
        document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
        document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        });

    });
})()
