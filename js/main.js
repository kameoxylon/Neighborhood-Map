function initMap(){
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: {lat: 28.3852, lng: -81.5639}
	});

	var geocoder = new google.maps.Geocoder();
	document.getElementById('submit').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
	});

	

}


function geocodeAddress(geocoder, resultsMap){
	var address = document.getElementById('address').value;
	geocoder.geocode({address: address}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
		}else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
	});

/*	var marker = new google.maps.Marker({
		position: address, 
		map: map.
		title: 'Pizza!'
	});
*/}