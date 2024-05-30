
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
			<div data-scroll-section id="audience_buttons" class="" data-scroll="" data-scroll-direction="vertical" data-scroll-speed="-1" data-scroll-position="top" data-scroll-target=".page-wrapper">
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
    	const response = await fetch('https://ipinfo.io/' + ip + '?token=d094b46883a2e4')
        .then((response) => { return response.json() })
        .then((json) => {
            const data = json;
            console.log('Location data: ' + JSON.stringify(data));
            console.log('Lat/Lon: ' + data.loc);
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

	getUserIP(); //.then(location => console.log(location));

});