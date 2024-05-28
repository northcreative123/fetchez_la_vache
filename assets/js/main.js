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
		console.log('All audience elements: ' + JSON.stringify(audience_elements));
		$( audience_elements ).not( '.' + audience + '-content' ).remove();
		console.log('Audience update: ' + audience);
		$('.' + audience + '-content').addClass('enabled');
	}

	set_scroll_listener = function () {
		window.addEventListener('scroll', () => {
			document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight)); 
		}, false);
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
		//set_scroll_listener();
	}

	// Initialize scroll animated elements
	//console.log(document.querySelector('[data-scroll-container]'))
	if (document.querySelector('[data-scroll-container]')) {
		const scroll = new LocomotiveScroll({
		    el: document.querySelector('[data-scroll-container]'),
		    smooth: true
		});
	}


});


/* META.AI:

// Get all elements with the scroll-animate class
var animateElems = document.querySelectorAll('.scroll-animate');

// Loop through each element
animateElems.forEach(function(elem) {
  // Get the element's height and the viewport height
  var elemHeight = elem.offsetHeight;
  var viewportHeight = window.innerHeight;

  // Check if the element is too big
  if (elemHeight > viewportHeight) {
	// Calculate the overage percentage
	var overagePercentage = (elemHeight / viewportHeight) * 100;

	// Apply a class to the body based on the overage percentage
	document.body.classList.add('overage-' + Math.floor(overagePercentage / 10) * 10);
  }
});

$(window).on('scroll', function() {
  var elem = $('#myElement'); // replace with your element
  var state = getElementViewportState(elem);

  switch (state) {
	case 'entering':
	  // animate element entering the viewport
	  break;
	case 'fully-in':
	  // animate element fully in the viewport
	  break;
	case 'leaving':
	  // animate element leaving the viewport
	  break;
  }
});
*/


animation_preflight = function(elements) {
	$(elements).each(function(elem) {
		let elemHeight = elem.offsetHeight;
		let viewportHeight = window.innerHeight;

		if (elemHeight > viewportHeight) {
			let overagePercentage = (elemHeight / viewportHeight) * 100;
			$('body').addClass('overage-' + Math.floor(overagePercentage / 10) * 10);
		}
	});
}

function getElementViewportState(elem) {
	let $elem = $(elem);
	let $window = $(window);

	let docViewTop = $window.scrollTop();
	let docViewBottom = docViewTop + $window.height();

	let elemTop = parseInt($elem.offset().top);
	let elemBottom = elemTop + $elem.height();
	let returnState = 'unknown';

	if (elemBottom <= docViewTop) {
		returnState = 'below';
	} 
	if (elemTop >= docViewBottom) {
		returnState = 'above';
	} 
	if (elemTop >= docViewTop && elemTop < docViewBottom) {
		returnState = 'entering';
	} 
	if (elemBottom > docViewTop && elemBottom <= docViewBottom) {
		returnState = 'leaving';
	} 
	if (elemTop > docViewTop && elemBottom < docViewBottom) {
		returnState = 'inside';
	} 
	if (elemTop < docViewTop && elemBottom > docViewBottom) {
		returnState = 'partially-in'; // too big?
	}
	console.log( 'el: ' + $elem.text() + ', state: ' + returnState + ', elTop: ' + elemTop + ', elBottom: ' + elemBottom + ', vpTop: ' + docViewTop + ', vpBottom: ' + docViewBottom );
	return {'state': returnState, 'elTop': elemTop, 'elBottom': elemBottom};
}


// https://codepen.io/Mehul_Rojasara/pen/gOwdvyG
$.fn.moveIt = function(){
	let $window = $(window);
	let instances = [];

	$(this).each(function(){
		instances.push(new moveItItem($(this)));
	});

	window.addEventListener('scroll', function(){
		let scrollTop = $window.scrollTop();
		const allowedValues = ['entering', 'leaving', 'inside'];
		instances.forEach(function(inst){
			// get state here
			//let currentState = getElementViewportState($(inst));
			//if (allowedValues.includes(currentState)) {
				//console.log('inst: ' + JSON.stringify(inst));
				inst.update(scrollTop);
			//}
		});
	}, { passive: true });
}

let moveItItem = function(el) {
	this.el = $(el);
	this.state = getElementViewportState(el);
	this.speed = parseInt(this.el.attr('data-scroll-speed'));
	this.startwhen = this.el.attr('data-scroll-start-when');
	this.starthow = this.el.attr('data-scroll-start-how');
	this.endwhen = this.el.attr('data-scroll-end-when');
	this.endhow = this.el.attr('data-scroll-end-how');
	//console.log('el: ' + el.text() + ', state: ' + this.state);
};

moveItItem.prototype.update = function() {
	let scrollTop = $(window).scrollTop();
	this.elstate = getElementViewportState(this.el); // {'state': returnState, 'elTop': elemTop, 'elBottom': elemBottom}
	console.log('el: ' + this.el.text() + ', state: ' + this.elstate.state + ', scrollTop: ' + scrollTop);
	const allowedValues = ['entering', 'leaving', 'inside'];
	if (allowedValues.includes(this.elstate.state)) {
		// el: L, state: above, elTop: 1898, elBottom: 1998, vpTop: 500, vpBottom: 1364

		//this.el.css('transform', 'translateY(' + (scrollTop + (this.elstate.elemTop - this.speed)) + 'px)'); // ??
		//this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)'); // UP
		this.el.css('transform', 'translateY(' + (scrollTop / this.speed) + 'px)'); // DOWN
		//this.el.css('transform', 'translateX(' + -(scrollTop / this.speed) + 'px)'); // LEFT
		//this.el.css('transform', 'translateX(' + (scrollTop / this.speed) + 'px)'); // RIGHT
		//this.el.css('transform', 'translate(' + -(scrollTop / this.speed) + 'px, ' + -(scrollTop / this.speed) + 'px)'); // UP-LEFT
	}
};

// Initialization
/*
$(function() {
	let animated = $('.scroll-animate');
	animation_preflight(animated);
	$(animated).moveIt();
});
*/



