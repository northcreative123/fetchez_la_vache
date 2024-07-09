
/* ****************************************
 * [ GOOGLE ADDRESS SEARCH ]
 *
 * ***************************************/

// A bity hacky, but effective for now
function fillInAddress() {

	var place = autocomplete.getPlace()
	//console.log(place)

}
function fillInAddress2() {

	var place = autocomplete2.getPlace()
	console.log(place.formatted_address)
	localStorage.setItem('cta_address', place.formatted_address)

}
function initAutocomplete() {

	autocomplete = new google.maps.places.Autocomplete( (document.getElementById('hero_search')), {
		types: ['geocode'],
		componentRestrictions: { country: ['us'] }
	})

	autocomplete2 = new google.maps.places.Autocomplete( (document.getElementById('fld_fake_search')), {
		types: ['geocode'],
		componentRestrictions: { country: ['us'] }
	})

	autocomplete.addListener('place_changed', fillInAddress)
	autocomplete2.addListener('place_changed', fillInAddress2)
	is_prod && document.getElementById('hero_search').focus()
}

const get_points_in_radius = ( points, center, radius ) => {

	// const earthRadius = 6371 // in kilometers
	const earthRadius = 3959 // in miles
	const radiansToDegrees = Math.PI / 180

	return points.filter( point => {

		const lat1 = center.lat * radiansToDegrees
		const lon1 = center.lon * radiansToDegrees
		const lat2 = point.lat * radiansToDegrees
		const lon2 = point.lon * radiansToDegrees

		const dLat = lat2 - lat1
		const dLon = lon2 - lon1

		const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		const distance = earthRadius * c

		return distance <= radius

	}).length

}  

const geocode_address = async ( address, parent_el ) => {

	const $parent = $(parent_el)
	const despaced = address.replace(/\s+/g, "+")
	// TODO: Hide & establish domain restrictions for all API keys ( Zapier )
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+despaced+'&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA'
	const response = await fetch( url )
    .then(( response ) => { 

		return response.json() 

	})
    .then(( json ) => {

        let search_data = {
            "street_number": json.results[0].address_components.find(item => item.types.includes("street_number"))?.long_name || null,
            "street_name": json.results[0].address_components.find(item => item.types.includes("route"))?.long_name || null,
            "address_line1": null,
            "address_line2": json.results[0].address_components.find(item => item.types.includes("subpremise"))?.long_name || null,
            "city": json.results[0].address_components.find(item => item.types.includes("locality"))?.long_name || null,
            "state": json.results[0].address_components.find(item => item.types.includes("administrative_area_level_1"))?.short_name || null,
            "county": json.results[0].address_components.find(item => item.types.includes("administrative_area_level_2"))?.long_name || null,
            "township": json.results[0].address_components.find(item => item.types.includes("administrative_area_level_3"))?.long_name || null,
            "country": json.results[0].address_components.find(item => item.types.includes("country"))?.short_name || null,
            "zip": json.results[0].address_components.find(item => item.types.includes("postal_code"))?.long_name || null,
            "local_formatted_address": null,
            "google_formatted_address": json.results[0].formatted_address || null,
            "lat_lng": json.results[0].geometry.location || null
        }
        !is_prod && console.log("search data: \n", search_data)

        if ( search_data.street_number && search_data.street_name ) {
            search_data.address_line1 = search_data.street_number + ' ' + search_data.street_name
        }
        if ( search_data.address_line1 && search_data.city && search_data.state && search_data.postal_code ) {
            search_data.local_formatted_address = search_data.address_line1 + ', ' + search_data.city + ', ' + search_data.state + ', ' + search_data.postal_code
        }

		localStorage.setItem('raw_search_response', JSON.stringify( json.results[0] ))
		localStorage.setItem('searched_address', JSON.stringify( search_data ))
		
        const formatted_address = search_data.google_formatted_address
		const ll_result = search_data.lat_lng
		const ll_obj = { "lat": ll_result.lat, "lon":  ll_result.lng }

		// TODO: get points from AirTable vs data.js! ALSO: https://gist.github.com/erichurst/7882666
		let result_count = get_points_in_radius(points, ll_obj, 50)
		//if (result_count === 0) { result_count = '[3]' }
		let be = result_count === 1 ? 'is' : 'are'
		let plural = result_count === 1 ? '' : 's'

		const result_message = 'We have <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		!is_prod && console.log('result count: ' + result_count)

		let local_result = {
			"radius": 50,
			"ll_center": ll_obj,
			"videographer_count": result_count
		}

		localStorage.setItem('local_result', JSON.stringify( local_result ))

		$parent.find('.result-block p').html(result_message)
        $parent.removeClass('searching').addClass('result')

        return result_message

    })
    .catch(( err ) => { 

		const error = `Error getting location data: ${err}`
		const result_message = '<strong>"'+address+'"</strong> was not recognized as valid.'
		!is_prod && console.log(error)

		$parent.find('input.search-input').focus()
		$parent.find('.result-block p').html(result_message)
		$parent.removeClass('searching').addClass('result error')

		return error

	})

}

const attach_search_event = () => {

	$('form.videographer-search').on( "submit", function( e ) {

		e.preventDefault()
		const input = $(e.currentTarget).find($('.search-input'))
		const address = input.val()

		if ( address.length >= 4 ) {

			$(e.currentTarget).removeClass('result error').addClass('searching')
			!is_prod && console.log('searched address: ' + address)
			const address_ll = geocode_address(address, $(e.currentTarget))
			//!is_prod && console.log('address lat/lon: ', address_ll)

		} else {

			//!is_prod && console.log('invalid address: ' + address)
			$(e.currentTarget).find('input.search-input').focus()
			$(e.currentTarget).find('.result-block p').html('Search must contain <strong>more than 3 characters</strong>.')
			$(e.currentTarget).addClass('result error')

		}
	})
}

const attach_fake_search_event = () => {

	$('#cta_section a.cta-link').on( "click", function( e ) {

		e.preventDefault()
		const input = $(e.currentTarget).parent().find($('.search-input'))
		const address = input.val()
		const cta_search = localStorage.getItem('cta_address') || null

		if ( cta_search ) {

			!is_prod && console.log('Address: ', cta_search)
			window.location = $(this).attr('href')

		} else {
			// validation?
		}
	})

}



/* ****************************************
 * [ SCROLL JACKING ]
 *
 * ***************************************/

$.fn.jack_the_scroll = function() { // TODO: complete or deprecate

	// https://learn.jquery.com/plugins/basic-plugin-creation/
	// https://jsfiddle.net/hrishikeshk/7ks5ztj8/
	/*
    return this.each( function( options ) {
        let window_offset = $(document).scrollTop()
		let element_offset = Math.floor( $(this).offset().top )
		let jack_on = ( element_offset - 200 ) < window_offset && ( element_offset + 500 ) > window_offset
		console.log('OFFSETS - window: : ' + window_offset +  ', element: ' + element_offset)
		jack_on && console.log('JACK ON!!')
    })
	*/
	// https://jsfiddle.net/hrishikeshk/7ks5ztj8/
	/*
	return this.each( function( options ) {
		var target = $('.scroll').get(0)
		$('body').on('wheel', function (e) {
			var o = e.originalEvent
			target.scrollTop += o.deltaY
		})
	})
	*/
 
}



$( function() {

	/* ****************************************
	 * [ AUDIENCE CONTENT TOGGLE ]
	 *
	 * ***************************************/

	const audiences = ['businesses', 'videographers'] 
	const audience_elements = audiences.map(item => `.${item}-content`).join(', ')
	const defaultAudience = 'businesses'

	// Check local storage first
	let audience = localStorage.getItem('audience')

	// If not set in local storage, check query string
	if ( !audience ) {

		const queryString = new URLSearchParams( window.location.search )
		audience = queryString.get('audience')

	}
	const attach_audience_buttons = ( to_parent ) => { // pass in jQuery selector

		const container = to_parent || $('body')
		// TODO: business, videographer text in buttons
		const buttons = `
			<div id="audience_buttons" class="scroll-animate" data-animation="">
				${audiences.map(item => `<button data-audience="${item}" id="${item}-btn">${item}</button>`).join('')}
			</div>`

		container.append( buttons )

		// attach events...
		attach_audience_button_events()

	}
	const attach_audience_button_events = () => {

		// Button event listeners
		$( '#audience_buttons button' ).on( "click", function( event ) {

			const eventData = $(this).data('audience')
			localStorage.setItem('audience', eventData)
			window.location.search = 'audience=' + eventData
			//$('#user_type_buttons').style.display = 'none'

		})

	}
	const toggle_content = ( audience ) => {

		// Show/hide content (section.businesses-content, section.videographers-content) based on (see audiences array var) user type
		// !is_prod && console.log('All audience elements: ', audience_elements)

		$( audience_elements ).not( '.' + audience + '-content' ).remove()
		!is_prod && console.log(`%c ❣️ Audience: ${audience}`, console_success_style)
		$('.' + audience + '-content').addClass('enabled')

	}
	// Initialize audience content selection?
	if ( $( audience_elements ).length ) {

		// If still not set, use default
		if ( !audience ) {
			audience = defaultAudience
		}
		// apply buttons?...
		$('body.audience-select').length && attach_audience_buttons( $('.page-wrapper') )
		//attach_audience_buttons($('#home_hero .chunklet'))

		// enable content display
		toggle_content( audience )

		// highlight current user type
		$('#'+ audience + '-btn').addClass('audience-selected')

	}



	/* ****************************************
	 * [ SCROLL ANIMATIONS ]
	 *
	 * ***************************************/

	let hovered_element
	let mouse_X = 0, mouse_Y = 0

	const in_viewport = ( element ) => {

		// Get the elements position relative to the viewport
		let bb = element.getBoundingClientRect()
		let padding = 500
		// Check if the element is outside the viewport, Then invert the returned value because you want to know the opposite
		let in_view = !( (bb.top + padding) > innerHeight || (bb.bottom - padding) < 0)
		console.log('in view?: ', in_view)
		return in_view
		// return !( (bb.top + padding) > innerHeight || (bb.bottom - padding) < 0)

	}

	//let myElement = document.querySelector('div')

	const set_scroll_hover = ( element ) => {

		// If the target and stored element are the same, return early because setting it again is unnecessary.
		if ( hovered_element === element ) { return }
		// On first run, `hovered_element` is undefined.
		if ( hovered_element ) { hovered_element.classList.remove( 'scroll-hover' ) }
	  
		hovered_element = element
		hovered_element && hovered_element.classList.add( 'scroll-hover' )

	}

	const move_stuff = ( offset, el, direction, speed ) => {

		// TODO: Establish/populate element array
		let down_value = -(offset * 500) + 'vh'
		let scroll_percent = parseInt( Math.abs(offset) * 100 )

		// header animation
		if ( scroll_percent > 3 ) {
			$('body > header').addClass('shrink')
		} else {
			$('body > header').removeClass('shrink')
		}

		// audience buttons animation
		$('body.audience-select').length && $('#audience_buttons').css('bottom', down_value)

	}
	
	const set_scroll_listener = () => {

		document.addEventListener( 'mousemove', ( event ) => {

			mouse_X = event.clientX
			mouse_Y = event.clientY
			let hover_parent = event.target.closest('section.full-centered-chunk') || null
			set_scroll_hover( hover_parent )

		})

		let last_scrolltop = 0
		window.addEventListener( 'scroll', ( event ) => {

			let offset_calc = window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
			document.body.style.setProperty('--scroll', offset_calc)

			// together w/ mousemove listener (above): evaluates mouse position while scrolling & adds/removes "scroll-hover" class to elements
			let hover_target = document.elementFromPoint( mouse_X, mouse_Y )
			let hover_parent = document.elementFromPoint( mouse_X, mouse_Y ).closest('section.full-centered-chunk') || false
			if ( hover_target && hover_parent ) { set_scroll_hover( hover_parent ) }
			
			if ( $('body.home').length > 0 ) {
				move_stuff( offset_calc )
			} else {
				$('body > header').addClass('shrink')
			}

			// Check the viewport status
			// let shady_element = document.querySelector('.do-the-shady-thing')
			// in_viewport( shady_element ) ? document.body.classList.add( 'shade-active' ) : document.body.classList.remove( 'shade-active' )

			/*
			let process_element = document.querySelector('section#process .scrolljacker')
			let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop()
			console.log('body top: ' + scrollTop)
			
			let scrolling_down =  ( scrollTop > last_scrolltop )
			let scroll_direction = scrolling_down ? 'down' : 'up'
			last_scrolltop = scrollTop

			let jacker = $('section#process .scrolljacker')
			// $('body').scrollTop()
			// $('div').offset().top
			// $('div').scrollTop()
			// let at_bottom = jacker.scrollTop() + jacker.outerHeight() >= jacker.prop("scrollHeight")
			let at_bottom = $(window).scrollTop() >= jacker.offset().top + jacker.outerHeight() - window.innerHeight
			let at_top = jacker.scrollTop() === 0

			console.log('scroll direction: ' + scroll_direction)
			if ( in_viewport( process_element ) ) {
				//document.body.classList.add( 'shade-active' )
				$('body').addClass( 'scrolljack' )
				$('html').not('.noscroll').addClass('noscroll') //.css('top',-scrollTop)
				console.log('jacker at top: ' + at_top + ' ...or bottom?: ' + at_bottom)

			} else {
				//document.body.classList.remove( 'shade-active' )
				//scrollTop = parseInt($('html').css('top'))
				$('body').removeClass( 'scrolljack' )
				$('html').removeClass('noscroll')
				//$('html,body').scrollTop(-scrollTop)
			}
			*/

		})

	}



	/* ****************************************
	 * [ DATA-DRIVEN SHOWCASES ]
	 *
	 * ***************************************/

	const populate_logo_marquee = ( parent, feature_data ) => {

		let marquee_markup = '<div class="logo-ticker-section-logos-slide-container"><div class="logo-ticker-section-logos-slide">' // AKA marquee_wahlberg?
        feature_data.forEach(function(data) { // TODO: randomize order
			marquee_markup += '<div class="logo-ticker-section-image-container"><div class="logo-ticker-section-image-frame"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'" /></div></div>'
        })
		marquee_markup += '</div></div>'

        parent.html( marquee_markup ).append( marquee_markup ).removeClass('loading') // twice is nice!
		speed_log.push({ "event" : "Logos Loaded", "time" : to_seconds() })
		//console.log('Logos Loaded: ', to_seconds())

    }

	let marquee_count = 1
	const populate_video_marquee = ( parent, feature_data, start, count ) => {

		const marquee_data = feature_data.slice( start, count )
		let marquee_markup = '<div class="video-ticker-section-videos-slide-container"><div class="video-ticker-section-videos-slide">'

        marquee_data.forEach(function( data ) {
			marquee_markup += '<div class="video-ticker-section-image-container"><div class="video-ticker-section-image-frame play-inline" title="'+data.name+'" data-vimeo-id="'+data.featured_video+'" data-url="https://vimeo.com/'+data.featured_video+'" data-client="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.featured_video+'.jpg" /></div></div>'
        })

		marquee_markup += '</div></div>'
        parent.html( marquee_markup ).append( marquee_markup ).removeClass('loading')
		speed_log.push({ "event" : "Marquee "+marquee_count+" Loaded", "time" : to_seconds() })
		//console.log('Marquee '+marquee_count+' Loaded: ', to_seconds())
		marquee_count++

    }
  
	const attach_industry_events = () => {

		$( '.featured-industries ul.industry-list li' ).on( "click", function( e ) {

			const tag = $(e.currentTarget)
			const industry = tag.data('industry')
			//!is_prod && console.log('industry: ' + industry)

			$('.featured-industries ul.industry-list li, .featured-industries  div.card-panel .card').removeClass('active')
			tag.addClass('active')
			$('.featured-industries  div.card-panel .card[data-industry="'+industry+'"]').addClass('active')

		})

	}
	const populate_industry_card_panel = ( parent, feature_data ) => {

		let industry_card_markup = '<div class="card-panel">'
		let industry_tag_markup = '<ul class="industry-list">'
		let random_select = get_random( (feature_data.length -1 ) )

        feature_data.forEach(function( data, i ) { 
			let connector = data.industry.toLowerCase()
			connector = connector.replace(/&/g, "and").replace(/\s+/g, "_")
        	//industry_card_markup += '<div class="card" data-industry="'+connector+'"><h4>'+data.name+'</h4><p>'+data.industry+'</p><div class="image-frame play-inline" title="'+data.name+'" data-vimeoid="'+data.featured_video+'" data-url="https://vimeo.com/'+data.featured_video+'" data-client="'+data.name+'"><img data-vimeoid="'+data.featured_video+'" alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.featured_video+'.jpg" /></div></div>'
			industry_card_markup += '<div class="card" data-industry="'+connector+'"><div class="image-frame play-inline" title="'+data.name+'" data-vimeoid="'+data.featured_video+'" data-url="https://vimeo.com/'+data.featured_video+'" data-client="'+data.name+'"><img data-vimeoid="'+data.featured_video+'" alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.featured_video+'.jpg" /></div></div>'
			industry_tag_markup += '<li data-industry="'+connector+'" class="'+ ( i === random_select ? "active" : "" ) +'">'+data.industry+'</li>'

        })

		industry_card_markup += '</div>'
		industry_tag_markup += '</ul>'

		parent.html( industry_card_markup ).append( industry_tag_markup ).removeClass('loading')
		speed_log.push({ "event" : "Industry Tags Loaded", "time" : to_seconds() })
		//console.log('Industry Tags Loaded: ', to_seconds())

    }
	
	const attach_testimonial_events = () => {

		$( 'ul.testimonial-list > li > a' ).on( "click", function( e ) {

			e.preventDefault()
			const link = $(e.currentTarget)
			const section = link.closest('.testimonial-list')
			const item = link.parent()
			section.find('>li').removeClass('active')
			item.addClass('active')

		})

	}
	/*
	let carousel_interval = 5000
	let carousel_timer = setInterval( () => {
		console.log("...next")
		$('.testimonial-list-redux').parent().find('.show-btn.show-next').trigger('click')
		carousel_interval = 5000
	}, carousel_interval )
	*/
	const attach_testimonial_redux_events = () => {

		const container = $('.testimonial-list-redux').parent()
		container.find('li:first-child').addClass('active')
		container.append('<button class="show-btn show-prev"><i class="fa-solid fa-chevron-left"></i></button><button class="show-btn show-next"><i class="fa-solid fa-chevron-right"></i></button>')

		container.find('.show-btn').on( "click", function( e ) {

		let parent_el = $(this).parent()
		let panels = parent_el.find('li')
		let current, next_panel

			if ( $(this).is('.show-next')) {

				//console.log('NEXT')
				//clearInterval(carousel_timer)
				current = parent_el.find('.active')
				next_panel = current.next().length ? current.next() : parent_el.find('li:first-child')

				current.removeClass('active')
				next_panel.addClass('active')
				
				/*
				animateCSS('.my-element', 'bounce') // or
				animateCSS('.my-element', 'bounce').then(( message ) => {
					// Do something after the animation
				})
				*/

			} else {

				//console.log('PREV')
				//clearInterval(carousel_timer)
				current = parent_el.find('.active')
				next_panel = current.prev().length ? current.prev() : parent_el.find('li:last-child')

				current.removeClass('active')
				next_panel.addClass('active')

				
			}
			//carousel_interval = 10000

		})

	}
	const populate_testimonials = ( parent, feature_data ) => {

		let testimony_markup = ''

        feature_data.forEach(function( data ) { 
			//testimony_markup += '<li class=""><a href="" title="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'" /></a><div class="card"><div class="image-frame play-inline" title="'+data.name+'" data-vimeo-id="'+data.featured_video+'" data-url="https://vimeo.com/'+data.featured_video+'" data-client="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.featured_video+'.jpg" /></div><q>""</q><blockquote>'+data.testimonial+'</blockquote><cite>'+data.contact+'</cite></div></li>'
			testimony_markup += '<li class=""><div class="image-frame play-inline" title="'+data.name+'" data-vimeo-id="'+data.featured_video+'" data-url="https://vimeo.com/'+data.featured_video+'" data-client="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.featured_video+'.jpg" /></div><div class="card animate__animated animate__fadeInUp"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'"><blockquote>'+data.testimonial+'</blockquote><cite>'+data.contact+'</cite></div></li>'
		})

		parent.append(testimony_markup).find('li:first-child').addClass('active')
		parent.removeClass('loading')
		speed_log.push({ "event" : "Testimonials Loaded", "time" : to_seconds() })
		//console.log('Testimonials Loaded: ', to_seconds())

    }

	const prepare_web_features = ( web_features ) => {

		!is_prod && console.log(`%c 🤓 All Web Features:`, console_data_style, web_features)
		const logo_data = web_features.filter( obj => obj.web_features && obj.web_features.includes("Logo Showcase") ).sort(() => Math.random() - 0.5)
		!is_prod && console.log(`%c 🤓 Logo Data:`, console_data_style, logo_data)
		const videos_data = web_features.filter( obj => obj.web_features && obj.web_features.includes("Video Showcase") && obj.featured_video ).sort(() => Math.random() - 0.5)
		!is_prod && console.log(`%c 🤓 Video Data:`, console_data_style, videos_data)
		const testimonial_data = web_features.filter( obj => obj.web_features && obj.web_features.includes("Testimony Showcase") ).sort(() => Math.random() - 0.5)
		!is_prod && console.log(`%c 🤓 Testimonial Data:`, console_data_style, testimonial_data)
		const industry_data = web_features.filter( obj => obj.web_features && obj.web_features.includes("Industry Showcase") ).sort(() => Math.random() - 0.5)
		!is_prod && console.log(`%c 🤓 Industry Data:`, console_data_style, industry_data)

		populate_logo_marquee( $('.logo-ticker-section-logos-container'), logo_data )
		populate_video_marquee($('#video_scroll_1 .video-ticker-section-videos-container'), videos_data, 0, 14) // Row 1
		populate_video_marquee($('#video_scroll_2 .video-ticker-section-videos-container'), videos_data, 14, 28) // Row 2
		//populate_testimonials($('.featured-testimonials .testimonial-list'), testimonial_data)
		populate_testimonials($('.featured-testimonials .testimonial-list-redux'), testimonial_data)
		populate_industry_card_panel($('.featured-industries'), industry_data)

		attach_industry_events()
		$('.featured-industries .industry-list .active').trigger('click')
		//attach_testimonial_events()
		attach_testimonial_redux_events()

		// Modal video player
		document.querySelectorAll(".play-inline").forEach((d) => d.addEventListener("click", playVideos))
		
	}
	

	// https://api-proxy-five-omega.vercel.app/wfapi/db/web-features
	const fetchez_la_vache = async () => { 
    
		const url = 'https://api-proxy-five-omega.vercel.app/wfapi/db/web-features'

		try {
			const resdata = await fetch( url )
			.then(( response ) => { 
		
				return response.json() 
		
			})
			.then(( json ) => {
		
				// !is_prod && console.log(`%c 🤓 Proxy test:`, console_data_style, json)
				prepare_web_features( json )
		
			})
			.catch(( err ) => { 
		
				const error = 'Error posting data: ' + JSON.stringify( err )
				!is_prod && console.log( error )
				return error
		
			})
		} catch ( e ) {
			//!is_prod && console.log( 'lancez_la_vache error: ', e )
			return e
		}

	}
	$('.web-feature').length && fetchez_la_vache()



	/* ****************************************
	 * [ OTHER TRICKS ]
	 *
	 * ***************************************/

	// TODO: fully integrate w/ scroll listener & deprecate
	const attach_shady_events = ( shady_things ) => {

		shady_things.on( "mouseenter", function( e ) {
			e.preventDefault()
			$('body').addClass('shade-active')
		}).on( "mouseleave", function( e ) {
			e.preventDefault()
			$('body').removeClass('shade-active')
		})

	}
	const do_the_shady = ( shady_things ) => {

		$('body main').prepend('<div id="shady_shade"></div>')
		//attach_shady_events( shady_things )

	}
	$('.do-the-shady-thing').length && do_the_shady( $('.do-the-shady-thing') )



	/* ****************************************
	 * [ ADDITIONAL INITS ]
	 *
	 * ***************************************/

	// for scrolly tricks
	set_scroll_listener()

	// hero video loaded listener
	$('video#hero_video').on("loadeddata", function() {
		!is_prod && console.log('%c ❣️ Hero Video loaded', console_success_style)
		$(this).parent().removeClass('loading')
	})

	// videographer search
  	attach_search_event()
	attach_fake_search_event()

})

