function initMap() {
    const dublin = { lat: 53.3497645, lng: -6.2602732 };
    const map = new google.maps.Map(document.querySelector('.search__map'), {
      zoom: 15,
      center: dublin,
    });
  
    new google.maps.Marker({
      position: dublin,
      map: map,
    });
  }