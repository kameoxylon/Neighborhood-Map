var map;

var markers = [];

var initMap = function() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: {lat: 28.46870, lng: -81.44728},
		mapTypeControl: false
	});

	var places = [{
		name:'The Mall At Millenia', 
		location:{
			lat:28.48559, lng:-81.43168 
		}, 
		address:'4200 Conroy Rd, Orlando, FL 32839',
		phone:'407-363-3555',
		site:'http://www.mallatmillenia.com/',
		fsId:'4b05869cf964a520dc6722e3'
	}, {
		name:'The Florida Mall', 
		location:{
			lat:28.44599, lng:-81.39775
		}, 
		address:'8001 Orange Blossom Trail, Orlando, FL 32809',
		phone:'407-851-6255',
		site:'http://www.simon.com/mall/the-florida-mall',
		fsId:'4b05869bf964a520b66722e3'
	}, {
		name:'Artegon Marketplace', 
		location:{
			lat:28.46870, lng:-81.44728
		},
		address:'5250 International Dr, Orlando, FL 32819',
		phone:'407-351-7718',
		site:'http://www.artegonmarketplace.com/',
		fsId:'5344416d498e7d8a923ab667'
	}, {
		name:'Pointe Orlando', 
		location:{
			lat:28.43253, lng:-81.47079
		},
		address:'9101 International Dr, Orlando, FL 32819',
		phone:'407-248-2838',
		site:'http://www.pointeorlando.com/',
		fsId:'4e752a59a809582dd5d35532'
	}, {
		name:'Orlando International Premium Outlets', 
		location:{
			lat:28.47477, lng:-81.45191
		}, 
		address:'4951 International Dr, Orlando, FL 32819',
		phone:'407-352-9600',
		site:'http://www.premiumoutlets.com/outlet/orlando-international',
		fsId:'4b05869df964a520e06722e3'
	}];

	var largeInfowindow = new google.maps.InfoWindow({ maxWidth: 220 });
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < places.length; i++){
		var marker = new google.maps.Marker({
			map: map,
			title: places[i].name,
			position: places[i].location,
			animation: google.maps.Animation.DROP,
			fsId: places[i].fsId
		});


		markers.push(marker);
		bounds.extend(marker.position);

		marker.addListener('click', function() {
			foursquareApi(this, largeInfowindow);			
		});

		map.fitBounds(bounds);
	}
}

/* With help from forum post 
https://discussions.udacity.com/t/why-am-i-getting-an-array-of-30-venues-returned-from-my-foursquare-api-request/184569/3
The foursquareApi takes the foursquare info and places it into an infowindow*/
var foursquareApi = function(marker, infowindow){
	var clientID = 'B1PVMK2YOJ2P0CCEHF254SNVQF451H3M1BHXOXPC4413UBUM';
	var clientSecret = 'ENO5U0ZPXGMUVKN4ZFK4BPJQSTI1FDUZACKAHOFGOQTXFBTK';
	var startUrl = "https://api.foursquare.com/v2/venues/";
	var fsId = marker.fsId;

	var url = startUrl + fsId + "?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20160624";

	$.ajax({
		type: "GET",
		dataType: "json",
		url: url
	})

	.done(function(data) {
		//Take chunks of info that I need.
		var venue = data.response.venue;

		console.log(venue);
		//Now parse those chunks into useable bits.
		var venueDescription = venue.description;
		var venueImageUrl = venue.bestPhoto.prefix + "width150" + venue.bestPhoto.suffix;

		//Finally lets set it all up into html.
		var fsContent = '<h3>' + venue.name + '</h3>' + 
			'<img src="' + venueImageUrl + '" alt="' 
			+ venue.name + '">' + "<p>" + venue.description +
			"</p>";

		//Then we populate our infowindow.
		if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + fsContent + '<div>');
		infowindow.open(map, marker);
		infowindow.addListener('closeclick', function(){
			infowindow.setMarker(null);
		});
	}
	});
}
/*
var ViewModel = function(){
	var self = this;
	self.filteredItems = ko.computed(function() {
	         var listFilter = self.filter().toLowerCase();
	         return ko.utils.arrayFilter(self.vineList(), function(item) {
	             //console.log(item);
	             if (item.name().toLowerCase().indexOf(listFilter) > -1) {
	                 if (item.marker) item.marker.setVisible(true);
	                 return true;
	             } else {
	                 item.marker.setVisible(false);
	                 return false;
	             }
	         });
	}, self);
}*/