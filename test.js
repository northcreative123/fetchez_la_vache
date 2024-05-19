// console.log('SUCCESS!! (suck it [again, and again, and...] Webflow!)');


$(function() {

	const defaultUserType = 'business';

	// Check local storage first
	let userType = localStorage.getItem('userType');

	// If not set in local storage, check query string
	if (!userType) {
		const queryString = new URLSearchParams(window.location.search);
		userType = queryString.get('userType');
	}


	attach_userType_buttons = function (to_parent) { // pass in jQuery selector
		const container = to_parent || $('body');
		const buttons = '<button id="personal-btn" class="button is-secondary-4 w-button">Personal</button><button id="business-btn" class="button is-secondary-4 w-button">Business</button>';
		container.append(buttons);
	}

	attach_userType_button_events = function () {
		// Button event listeners
		$( '#personal-btn' ).on( "click", function() {
		  	localStorage.setItem('userType', 'personal');
		  	window.location.search = 'userType=personal';
		  	$('#user_type_buttons').style.display = 'none';
		});
		$( '#business-btn' ).on( "click", function() {
		  	localStorage.setItem('userType', 'business');
		  	window.location.search = 'userType=business';
		  	$('#user_type_buttons').style.display = 'none';
		});
	}

	toggle_content = function () {
		// Show/hide content based on user type
		console.log('Type update: ' + userType);
		if (userType === 'personal') {
			$('#personal-content').removeClass('hide-me');
			//$('#business-content').style.display = 'none';
		} else {
			//$('#personal-content').style.display = 'none';
			$('#business-content').removeClass('hide-me');
		}
	}

	$( '#type-reset' ).on( "click", function() {
	  	window.location = window.location.pathname;
	  	localStorage.setItem('userType', '');
	  	$('#user_type_buttons').style.display = 'block';
	});

	$( '#type-toggle' ).on( "click", function() {
		const toggle_to = userType === 'business' ? 'personal' : 'business';
	  	localStorage.setItem('userType', toggle_to);
	  	window.location.search = 'userType=' + toggle_to;
	});


	// If still not set, use business as default
	if (!userType) {
		userType = defaultUserType;
		// apply buttons...
		attach_userType_buttons($('#user_type_buttons'));
		// attach events...
		attach_userType_button_events();
		// display content...
		// $('#default-tag').removeClass('hide-me');
	} else {
		const toggle_text = userType === 'business' ? 'personal' : 'business';
		$('#type-reset').removeClass('hide-me');
		$('#type-toggle').text('View ' + toggle_text).removeClass('hide-me');
	}
	toggle_content();
	$('#'+ userType + '-btn').addClass('user-type-selected');

});

