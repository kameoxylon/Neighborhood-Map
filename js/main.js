var map;

var markers = [];

var initMap = function() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: {lat: 28.46870, lng: -81.44728},
		mapTypeControl: false
	});

	var places = [
		{name:'The Mall At Millenia', geometry: {location:{lat:28.48559, lng:-81.43168}}, types:["shopping_mall"]},
		{name:'The Florida Mall', geometry: {location:{lat:28.44599, lng:-81.39775}}, types:["shopping_mall"]},
		{name:'Artegon Marketplace', geometry: {location:{lat:28.46870, lng:-81.44728}}, types:["shopping_mall"]},
		{name:'Pointe Orlando', geometry: {location:{lat:28.43253, lng:-81.47079}}, types:["shopping_mall"]},
		{name:'Orlando International Premium Outlets', geometry: {location:{lat:28.47477, lng:-81.45191}}, types:["shopping_mall"]}
	];

	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < places.length; i++){
		var marker = new google.maps.Marker({
			map: map,
			title: places[i].name,
			position: places[i].geometry.location,
			types: places[i].types,
			animation: google.maps.Animation.DROP
		});

		markers.push(marker);
		bounds.extend(marker.position);

		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});

		map.fitBounds(bounds);

	}
	
		


	
	var geocoder = new google.maps.Geocoder();

	document.getElementById('submit').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
	});
}

function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '<div>');
		infowindow.open(map, marker);
		infowindow.addListener('closeclick', function(){
			infowindow.setMarker(null);
		});
	}
}




function geocodeAddress(geocoder, resultsMap) {
	var address = document.getElementById('address').value;

	if (address == ''){
		window.alert('You must first enter an address');
	} else {
		geocoder.geocode({'address': address}, function(results, status) {
			if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			resultsMap.setZoom(12);

			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location
			});
			
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
		});
	}
}
