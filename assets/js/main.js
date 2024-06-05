function pointsWithinRadius(points, center, radius) {
	//const earthRadius = 6371; // in kilometers
	const earthRadius = 3959; // in miles
	const radiansToDegrees = Math.PI / 180;

	return points.filter(point => {
		const lat1 = center.lat * radiansToDegrees;
		const lon1 = center.lon * radiansToDegrees;
		const lat2 = point.lat * radiansToDegrees;
		const lon2 = point.lon * radiansToDegrees;

		const dLat = lat2 - lat1;
		const dLon = lon2 - lon1;

		const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distance = earthRadius * c;

		return distance <= radius;
	}).length;
}  
  
async function geocode_address(address, parent_el) {
  	const $parent = $(parent_el);
	const despaced = address.replace(/\s+/g, "+");
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+despaced+'&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA';
	const response = await fetch(url)
    .then((response) => { return response.json() })
    .then((json) => {
        const data = json;
        localStorage.setItem('search_location', JSON.stringify(json));
        //console.log('response: ' + JSON.stringify(data));
        //console.log('Lat/Lon: ' + JSON.stringify(data.results[0].geometry.location));
        const formatted_address = data.results[0].formatted_address;

		const ll_result = data.results[0].geometry.location
		const ll_obj = { "lat": ll_result.lat, "lon":  ll_result.lng };

		let result_count = pointsWithinRadius(points, ll_obj, 50);
		//if (result_count === 0) { result_count = '[3]' }
		let be = result_count === 1 ? 'is' : 'are';
		let plural = result_count === 1 ? '' : 's';
        //const result_message = 'There '+be+' currently <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address;
		// TODO: if 0 add "Want a videographer? Find a nearby videographer ..."
		const result_message = 'We have <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address;
		console.log('result count: ' + result_count);
		$parent.find('.result-block p').html(result_message);
        $parent.removeClass('searching').addClass('result');

        return result_message;
    })
    .catch((err) => { 
		const error = `Error getting location data: ${err}`;
		const result_message = '<strong>"'+address+'"</strong> was not recognized as valid.';
		console.log(error);
		$parent.find('input.search-input').focus();
		$parent.find('.result-block p').html(result_message);
		$parent.removeClass('searching').addClass('result error');
		return error
	});
}

attach_search_event = function () {
	$('form.videographer-search').on( "submit", function(e) {
		e.preventDefault();
		const input = $(e.currentTarget).find($('.search-input'));
		const address = input.val();
		if (address.length >= 2) {
			$(e.currentTarget).removeClass('result error').addClass('searching');
			console.log('searched address: ' + address);
			const address_ll = geocode_address(address, $(e.currentTarget));
            
			//console.log('address lat/lon: ' + JSON.stringify(address_ll));
		} else {
			console.log('invalid address: ' + address);
			$(e.currentTarget).find('input.search-input').focus();
			$(e.currentTarget).find('.result-block p').html('Search must contain <strong>more than 2 characters</strong>.');
			$(e.currentTarget).addClass('result error');
		}

	});
}


  
$(function() {

	const audiences = ['businesses', 'videographers'];
	const audience_elements = audiences.map(item => `.${item}-content`).join(', ');
	const defaultAudience = 'businesses';
	// Check local storage first
	let audience = localStorage.getItem('audience');
	// If not set in local storage, check query string
	if (!audience) {
		const queryString = new URLSearchParams(window.location.search);
		audience = queryString.get('audience');
	}

	attach_audience_buttons = function (to_parent) { // pass in jQuery selector
		const container = to_parent || $('body');
		const buttons = `
			<div data-scroll-section id="audience_buttons" class="" data-scroll="" data-scroll-direction="vertical" data-scroll-speed="-5" data-scroll-position="top" data-scroll-target=".page-wrapper">
				${audiences.map(item => `<button data-audience="${item}" id="${item}-btn">${item}</button>`).join('')}
			</div>`;
		//const buttons = '<div id="audience_buttons" class=""><button id="businesses-btn" class="">Businesses</button><button id="videographers-btn" class="">Videographers</button></div>';
		container.append(buttons);
	}

	attach_audience_button_events = function () {
		// Button event listeners
		$( '#audience_buttons button' ).on( "click", function(event) {
			const eventData = $(this).data('audience');
			localStorage.setItem('audience', eventData);
			window.location.search = 'audience=' + eventData;
			//$('#user_type_buttons').style.display = 'none';
		});
	}

	toggle_content = function (audience) {
		// Show/hide content based on user type
		// console.log('All audience elements: ' + JSON.stringify(audience_elements));
		$( audience_elements ).not( '.' + audience + '-content' ).remove();
		console.log('Audience update: ' + audience);
		$('.' + audience + '-content').addClass('enabled');
	}

	// Initialize audience content selection?
	if ($( audience_elements ).length) {
		// If still not set, use default
		if (!audience) {
			audience = defaultAudience;
		}
		// apply buttons...
		attach_audience_buttons($('.page-wrapper'));
		// attach events...
		attach_audience_button_events();
		// enable content display
		toggle_content(audience);
		// highlight current user type
		$('#'+ audience + '-btn').addClass('audience-selected');
	}

	// Initialize scroll animated elements
	// console.log(document.querySelector('[data-scroll-container]'))
	if (document.querySelector('[data-scroll-container]')) {
		const scroll = new LocomotiveScroll({
		    el: document.querySelector('[data-scroll-container]'),
		    smooth: true
		});
	}

  
    // http://ip-api.com/json/24.127.12.129
    // ipinfo.io/24.127.12.129?token=d094b46883a2e4
	async function getUserLocation(ip) {
    	const response = await fetch('https://ipinfo.io/' + ip + '?token=d9e7dd4ebf804b')
        .then((response) => { return response.json() })
        .then((json) => {
            const data = json;
            localStorage.setItem('location', JSON.stringify(json));
            console.log('Location data: ' + JSON.stringify(data));
            console.log('Lat/Lon: ' + data.loc);
          	const ll_obj = { "lat": data.loc.split(',')[0], "lon":  data.loc.split(',')[1] };
          	const results1 = pointsWithinRadius(points, ll_obj, 50);
          	const results2 = pointsWithinRadius(points, ll_obj, 100);
			const results3 = pointsWithinRadius(points, ll_obj, 200);
          	console.log('Videographers within 50 miles of ' + data.city + ': ' + results1);
          	console.log('... 100 miles: ' + results2);
          	console.log('... 200 miles: ' + results3);
            return data.city;
        })
        .catch((err) => { return `Error getting location data: ${err}` });
    }
  
	async function getUserIP() {
		try {
			const response = await fetch('https://api.ipify.org?format=json')
            .then((response) => { return response.json() })
            .then((json) => {
                const ip = json.ip;
                console.log('IP Address: ' + ip);
                const city = getUserLocation(ip);
                return city;
            })
            .catch((err) => { return `Error getting IP Address: ${err}` });

		} catch (error) {
			console.error('Error getting user location:', error);
		}
	}

	attach_iplookup_events = function () {
		// Button event listeners
		$( 'a.user-location' ).on( "click", function( event ) {
			getUserIP();
		});
	}

	//getUserIP(); //.then(location => console.log(location));
	attach_iplookup_events();
	
  
  
  
	attach_marquee_events = function () {
		// Button event listeners
		$( '.video-ticker-section-image-frame' ).on( "click", function(e) {
			console.log('Clicked: '+$(e.currentTarget).attr('title')+', video?: '+$(e.currentTarget).attr('data-vimeo-id'));
            $(e.currentTarget).attr('data-vimeo-id') && window.open('https://vimeo.com/'+$(e.currentTarget).attr('data-vimeo-id'), '_blank');
		});
	}
  
    populate_logo_marquee = function (parent, start, count) { // 14
		const marquee_data = clients.filter(client => client.web_features.logo_marquee === true);
        //const marquee_data = clients.slice(start, count);
        //let marquee_markup = '';
		let marquee_markup = '<div class="logo-ticker-section-logos-slide-container"><div class="logo-ticker-section-logos-slide">';
        marquee_data.forEach(function(data) { // TODO: randomize order
        	//marquee_markup += '<span title="'+data.name+'"><img src="'+data.logo_url+'" /></span>';
			marquee_markup += '<div class="logo-ticker-section-image-container"><div class="logo-ticker-section-image-frame"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'" /></div></div>';
        });
		marquee_markup += '</div></div>';

        parent.html(marquee_markup).append(marquee_markup); // twice is nice!

		//const chunk_wrap = '<div class="logo-ticker-section-logos-slide-container"><div class="logo-ticker-section-logos-slide">'+chunk+'</div></div>';
		//const chunklet = '<div class="logo-ticker-section-image-container"><div class="logo-ticker-section-image-frame"><img alt="" aria-hidden="" src="" /></div></div>';'
    }
    //populate_logo_marquee($('.marquee.logo-scroll .marquee-row'), 0, 8);
	populate_logo_marquee($('.logo-ticker-section-logos-container'));

    populate_video_marquee = function (parent, start, count) {
        const marquee_data = clients.slice(start, count);
        //let marquee_markup = '';
		let marquee_markup = '<div class="video-ticker-section-videos-slide-container"><div class="video-ticker-section-videos-slide">';
        marquee_data.forEach(function(data) {
        	//marquee_markup += '<span title="'+data.name+'" data-vimeo-id="'+data.vimeo_ids[0]+'"><img src="https://vumbnail.com/'+data.vimeo_ids[0]+'.jpg" /></span>';
			if ( data.web_features.video_marquee ) {
				marquee_markup += '<div class="video-ticker-section-image-container"><div class="video-ticker-section-image-frame" title="'+data.name+'" data-vimeo-id="'+data.vimeo_ids[0]+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.web_features.featured_video[0]+'.jpg" /></div></div>';
			}
        });
		marquee_markup += '</div></div>';
        parent.html(marquee_markup).append(marquee_markup);
    }
    populate_video_marquee($('#video_scroll_1 .video-ticker-section-videos-container'), 0, 15);
    populate_video_marquee($('#video_scroll_2 .video-ticker-section-videos-container'), 15, 30);
  
    attach_marquee_events();

    populate_industry_card_panel = function (parent) { 
		const industry_data = clients.filter(client => client.web_features.home_industry === true);
		let industry_card_markup = '<div class="card-panel">';
		let industry_tag_markup = '<ul class="industry-list">';
        industry_data.forEach(function(data) { // TODO: randomize order
        	industry_card_markup += '<div class="card" data-industry="'+data.industry+'"><h4>'+data.name+'</h4><p>'+data.industry+'</p></div>';
			industry_tag_markup += '<li data-industry="'+data.industry+'"><i class="fa-solid fa-person-digging"></i> '+data.industry+'</li>';
        });
		industry_card_markup += '</div>';
		industry_tag_markup += '</ul>';
		//parent.html(industry_card_markup).append(industry_tag_markup);
    }
	populate_industry_card_panel($('.featured-industries'));

    populate_testimonials = function (parent) { 
		const testimony_data = clients.filter(client => client.web_features.home_testimonials === true);
		let testimony_markup = '';
        testimony_data.forEach(function(data) { // TODO: randomize order
        	testimony_markup += '<li class=""><a href="#">'+data.name+'</a><div class="card"><h4>'+data.name+'</h4><p>'+data.web_features.testimonial.snippet+'</p><p>'+data.web_features.testimonial.contact+'</p></div></li>';
        });
		parent.html(testimony_markup);
    }
	populate_testimonials($('.featured-testimonials .testimonial-list'));

  	attach_search_event();
    $('.total-videographer-count').text(points.length);
	//$('section.hero div.chunklet').addClass('anim-test-2');
	$('section.hero div.chunklet h2').addClass('animate');
  

});

// TODO: integrate better!
// Stolen from: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform#maps_places_autocomplete_addressform-javascript
let autocomplete;
let address1Field;
let address2Field;
let postalField;

function initAutocomplete() {
  address1Field = document.querySelector("#ship-address");
  address2Field = document.querySelector("#address2");
  postalField = document.querySelector("#postcode");
  // Create the autocomplete object, restricting the search predictions to
  // addresses in the US and Canada.
  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ["us", "ca"] },
    fields: ["address_components", "geometry"],
    types: ["address"],
  });
  //address1Field.focus();
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  //autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  let address1 = "";
  let postcode = "";

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    // @ts-ignore remove once typings fixed
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        //document.querySelector("#locality").value = component.long_name;
        break;
      case "administrative_area_level_1": {
        //document.querySelector("#state").value = component.short_name;
        break;
      }
      case "country":
        //document.querySelector("#country").value = component.long_name;
        break;
    }
  }

  //address1Field.value = address1;
  //postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  //address2Field.focus();
}

window.initAutocomplete = initAutocomplete;
