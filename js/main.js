'use strict';

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

//Set up our map.
var initMap = function() {
	viewmodel.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center: {lat: 28.46870, lng: -81.44728},
		mapTypeControl: false
	});

	//infowindow is given a 220px width.
	viewmodel.infowindow = new google.maps.InfoWindow({ maxWidth: 220 });
	viewmodel.bounds = new google.maps.LatLngBounds();

	//Here we cycle through our places array and put them into our viewmodel object.
	viewmodel.itemList().forEach(function(item) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(item.lat(), item.lng()),
			animation: google.maps.Animation.DROP,
			map: viewmodel.map,
			fsId: item.fsId()
		});

		item.marker = marker;

		//Give the map a responsive sive with the extends and fitBounds functions.
		viewmodel.bounds.extend(marker.position);

		google.maps.event.addListener(marker, 'click', function() {
			viewmodel.select(item);
		});	
		viewmodel.map.fitBounds(viewmodel.bounds);
	}); 

};

function toggleBounce(viewmodel) {
	if (viewmodel.marker.getAnimation() !== null) {
		viewmodel.marker.setAnimation(null);
	} else {
		viewmodel.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			viewmodel.marker.setAnimation(null);
		}, 730);
	}
}


var Item = function(place){
	this.name = ko.observable(place.name);
	this.lat = ko.observable(place.location.lat);
	this.lng = ko.observable(place.location.lng);
	this.fsId = ko.observable(place.fsId);
};

var ViewModel = function(){
	var self = this;

	var mappedData = ko.utils.arrayMap(places, function(place){
		return new Item(place);
	});

	this.itemList = ko.observableArray(mappedData);
	this.filter = ko.observable('');

	//Our foursquareApi builds up our url and uses ajax to get a response from  the server, once we get our response
	//we take all the bits we need and make our content for the infowindow.
	function foursquareApi(item){
		var clientID = 'B1PVMK2YOJ2P0CCEHF254SNVQF451H3M1BHXOXPC4413UBUM';
		var clientSecret = 'ENO5U0ZPXGMUVKN4ZFK4BPJQSTI1FDUZACKAHOFGOQTXFBTK';
		var startUrl = "https://api.foursquare.com/v2/venues/";
		var fsId = item.fsId;

		var url = startUrl + fsId + "?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20160624";

		$.ajax({
			url: url,
			dataType: "json",
			//If its successful do stuff with data, otherwise give an error.
			success: function(data){
				var venue = data.response.venue;

				//Now parse those chunks into useable bits.
				var venueDescription = venue.description;
				var venueImageUrl = venue.bestPhoto.prefix + "width150" + venue.bestPhoto.suffix;

				if (venue == "undefined" || venueDescription == "undefined" || venueImageUrl == "undefined"){
					viewmodel.infowindow.setContent("There was an error finding correct content information.");
					viewmode.infowindow.open(viewmodel.map, item.marker);
					console.log("venue: " + venue + ", " + "venueDescription: " + venueDescription + "," 
						+ "venueImageUrl: " + venueImageUrl);
				}

				//Finally lets set it all up into html.
				var fsContent = '<h3>' + venue.name + '</h3>' + 
					'<img src="' + venueImageUrl + '" alt="' +
					venue.name + '">' + '<p>' + venue.description +
					'"</p>"';
				viewmodel.infowindow.setContent(fsContent);
			},
			//Error function in case nothing loads.
			error: function(url, errorMsg) {
				if(errorMsg) {
					viewmodel.infowindow.setContent("There was an error loading the content.");
					viewmodel.infowindow.open(viewmodel.map, item.marker);
				}
			}
		});
	}

	//If we select something from the list or map, run the foursquareApi and put it on the infowindow.
	this.select = function(place){
		foursquareApi(place.marker);
		viewmodel.infowindow.open(viewmodel.map, place.marker);
		toggleBounce(place);
	};

	//Filter our search done on the searchbox and filter our map.
     self.filteredItems = ko.computed(function() {
         var filter = self.filter().toLowerCase();
         return ko.utils.arrayFilter(self.itemList(), function(item) {
             //console.log(item);
             if (item.name().toLowerCase().indexOf(filter) > -1) {
                 if (item.marker) item.marker.setVisible(true);
                 return true;
             } else {
                 item.marker.setVisible(false);
                 return false;
             }
         });
     }, self);


};

var viewmodel = new ViewModel();
ko.applyBindings(viewmodel);


//This handles our google maps api error and puts a window on the user's browser displaying so and more info
//in the console window.
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};

var count = 0;
//Hides our nav bar.
$(".hamburger").on('click', function() {
	$(".nav").toggleClass('slide-out');
	if ((count % 2) == 0){
		//close
		$("#map").css("left", "0px");
		$("#map").css("right", "-362px");
	} else {
		//open
		$("#map").css("left", "362px");
		$("#map").css("right", "0px");

	}
	count++;
});