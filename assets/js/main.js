
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
	// TODO: establish domain restriction for all API keys
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
            "postal_code": json.results[0].address_components.find(item => item.types.includes("postal_code"))?.long_name || null,
            "local_formatted_address": null,
            "google_formatted_address": json.results[0].formatted_address || null,
            "lat_lng": json.results[0].geometry.location || null
        }
        //console.log("search data: \n" + JSON.stringify(search_data))

        const data = json
        localStorage.setItem('search_location', JSON.stringify( json ))
		localStorage.setItem('searched_address', JSON.stringify( search_data ))
		
        const formatted_address = data.results[0].formatted_address
		const ll_result = data.results[0].geometry.location
		const ll_obj = { "lat": ll_result.lat, "lon":  ll_result.lng }

		// TODO: get points from AirTable vs data.js!
		// ALSO: https://gist.github.com/erichurst/7882666
		let result_count = get_points_in_radius(points, ll_obj, 50)
		//if (result_count === 0) { result_count = '[3]' }
		let be = result_count === 1 ? 'is' : 'are'
		let plural = result_count === 1 ? '' : 's'

        //const result_message = 'There '+be+' currently <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		// TODO: if 0 add "Want a videographer? Find a nearby videographer ..."
		const result_message = 'We have <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		console.log('result count: ' + result_count)

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
		console.log(error)

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

		if ( address.length >= 2 ) {

			$(e.currentTarget).removeClass('result error').addClass('searching')
			console.log('searched address: ' + address)
			const address_ll = geocode_address(address, $(e.currentTarget))
			//console.log('address lat/lon: ' + JSON.stringify(address_ll))

		} else {

			//console.log('invalid address: ' + address)
			$(e.currentTarget).find('input.search-input').focus()
			$(e.currentTarget).find('.result-block p').html('Search must contain <strong>more than 2 characters</strong>.')
			$(e.currentTarget).addClass('result error')

		}

	})

}


const init_multi_step_form = ( multi_form ) => {

	const progress_bar = $("#progressbar")
	let current_fs, next_fs, previous_fs //fieldsets
	let opacity
	let current = 1
	let steps = multi_form.find("fieldset").length

	setProgressBar(current)

	multi_form.find(".next").click(function () {

		current_fs = $(this).parent()
		next_fs = $(this).parent().next()


		//Add Class Active
		progress_bar.find("li").eq($("fieldset").index(next_fs)).addClass("active")

		//show the next fieldset
		next_fs.show()
		//hide the current fieldset with style
		current_fs.animate({ opacity: 0 }, {
			step: function (now) {
				// for making fielset appear animation
				opacity = 1 - now
				current_fs.css({ 'display': 'none', 'position': 'relative' })
				next_fs.css({ 'opacity': opacity })
			},
			duration: 500
		})
		setProgressBar(++current)
		current_fs.removeClass("active")
		next_fs.addClass("active")
		console.log('current: ' + current)
		validateStep()
	});

	multi_form.find(".previous").click(function () {

		current_fs = $(this).parent()
		previous_fs = $(this).parent().prev()



		//Remove class active
		progress_bar.find("li").eq($("fieldset").index(current_fs)).removeClass("active")

		//show the previous fieldset
		previous_fs.show()

		//hide the current fieldset with style
		current_fs.animate({ opacity: 0 }, {
			step: function (now) {
				// for making fielset appear animation
				opacity = 1 - now
				current_fs.css({ 'display': 'none', 'position': 'relative' })
				previous_fs.css({ 'opacity': opacity }) 
			}, 
			duration: 500 
		})
		setProgressBar(--current)
		current_fs.removeClass("active")
		previous_fs.addClass("active")
		validateStep()
	})

	function setProgressBar(curStep) {
		var percent = parseFloat(100 / steps) * curStep
		percent = percent.toFixed()
		multi_form.find(".progress-bar").css("width", percent + "%")
	}

	function validateStep() {
		//let next_button = $('fieldset.active .next')
		//let is_gtg = $('fieldset.active').find('input,textarea,select').filter('[required]').valid()
		//console.log('Valid?: ' + is_gtg)
		//next_button.prop( "disabled", !is_gtg )

		let next_button = $('fieldset .next')
		next_button.prop( "disabled", false )
	}

	function adjust_datepickers() {

		const dateInputs = $('.date-picker')
		const today = new Date(Date.now()) 
		const formattedToday = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
		const tomorrow = new Date(Date.now() + 86400000) // 86400000 is the number of milliseconds in a day
		const formattedTomorrow = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0')
		const nextyear = new Date(Date.now() + (86400000 * 180))
		const formattedNextyear = nextyear.getFullYear() + '-' + String(nextyear.getMonth() + 1).padStart(2, '0') + '-' + String(nextyear.getDate()).padStart(2, '0')

		dateInputs.attr('min', formattedTomorrow).attr('max', formattedNextyear).val(formattedTomorrow)

	}
	adjust_datepickers()

	function init_select_tags() {

		$(".tag-select select").change(function () {
			const tag_container = $(this).parent().find('.selected')
			const selected = $(this).find(':selected').map(function(i, el) {
				return $(el).text();
			}).get()

			tag_container.text( '[ ' + selected.join(', ') + ' ]')
		})

	}
	init_select_tags()

	// multi_form.find(".submit").click(function () {
	// 	return false
	// })

	multi_form.find('input,textarea,select').keyup( function() {
		validateStep()
	})
	validateStep()

}
  
$( function() {

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

		// Show/hide content based on user type
		// console.log('All audience elements: ' + JSON.stringify(audience_elements))
		$( audience_elements ).not( '.' + audience + '-content' ).remove()
		console.log('Audience update: ' + audience)
		$('.' + audience + '-content').addClass('enabled')

	}

	const move_stuff = ( offset, el, direction, speed ) => {

		// TODO: Establish/populate element array
		//console.log( -(offset * 100) + 'vh')
		let down_value = -(offset * 500) + 'vh'
		let scroll_percent = parseInt( Math.abs(offset) * 100 )
		//console.log( 'hey: ' + scroll_percent )
		if ( scroll_percent > 3 ) {
			$('body > header').addClass('shrink')
		} else {
			$('body > header').removeClass('shrink')
		}
		$('#audience_buttons').css('bottom', down_value)

	}

	const set_scroll_listener = () => {

		window.addEventListener('scroll', () => {
			let offset_calc = window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
			document.body.style.setProperty('--scroll', offset_calc)
			move_stuff(offset_calc)
		}, false)

	}

	// Initialize audience content selection?
	if ( $( audience_elements ).length ) {

		// If still not set, use default
		if ( !audience ) {
			audience = defaultAudience
		}
		// apply buttons?...
		//$('body.audience-select').length && attach_audience_buttons( $('.page-wrapper') )
		//attach_audience_buttons($('#home_hero .chunklet'))

		// enable content display
		toggle_content( audience )

		// highlight current user type
		$('#'+ audience + '-btn').addClass('audience-selected')
		set_scroll_listener()

	}



    // http://ip-api.com/json/24.127.12.129
    // ipinfo.io/24.127.12.129?token=d094b46883a2e4
	const getUserLocation = async ( ip ) => {

    	const response = await fetch('https://ipinfo.io/' + ip + '?token=d9e7dd4ebf804b')
        .then(( response ) => { return response.json() })
        .then(( json ) => {

            const data = json
            localStorage.setItem('location', JSON.stringify(json))
            console.log('Location data: ' + JSON.stringify(data))
            console.log('Lat/Lon: ' + data.loc)

          	const ll_obj = { "lat": data.loc.split(',')[0], "lon":  data.loc.split(',')[1] }

          	const results1 = get_points_in_radius(points, ll_obj, 50)
          	const results2 = get_points_in_radius(points, ll_obj, 100)
			const results3 = get_points_in_radius(points, ll_obj, 200)

          	console.log('Videographers within 50 miles of ' + data.city + ': ' + results1)
          	console.log('... 100 miles: ' + results2)
          	console.log('... 200 miles: ' + results3)

            return data.city

        })
        .catch((err) => { return `Error getting location data: ${err}` })

    }
  
	const getUserIP = async () => {

		try {
			const response = await fetch( 'https://api.ipify.org?format=json' )
            .then(( response ) => { return response.json() })
            .then(( json ) => {

                const ip = json.ip
                console.log( 'IP Address: ' + ip )
                const city = getUserLocation( ip )

                return city

            })
            .catch((err) => { return `Error getting IP Address: ${err}` })

		} catch (error) {

			console.error('Error getting user location:', error)

		}

	}

	const attach_iplookup_events = () => { // deprecate?

		// Button event listeners
		$( 'a.user-location' ).on( "click", function( event ) {
			getUserIP()
		})

	}
	attach_iplookup_events()
	


	const attach_marquee_events = () => { // DEPRECATED by playa.js

		// Play Button event listeners (open video in new tab)
		$( '.video-ticker-section-image-frame' ).on( "click", function( e ) {
			console.log('Clicked: '+$(e.currentTarget).attr('title')+', video?: '+$(e.currentTarget).attr('data-vimeo-id'))
            $(e.currentTarget).attr('data-vimeo-id') && window.open('https://vimeo.com/'+$(e.currentTarget).attr('data-vimeo-id'), '_blank')
		})

	}
  

	const populate_logo_marquee = ( parent ) => {

		const marquee_data = clients.filter(client => client.web_features.logo_marquee === true).sort(() => Math.random() - 0.5)
		let marquee_markup = '<div class="logo-ticker-section-logos-slide-container"><div class="logo-ticker-section-logos-slide">'

        marquee_data.forEach(function(data) { // TODO: randomize order
			marquee_markup += '<div class="logo-ticker-section-image-container"><div class="logo-ticker-section-image-frame"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'" /></div></div>'
        })
		
		marquee_markup += '</div></div>'
        parent.html( marquee_markup ).append( marquee_markup ) // twice is nice!

    }
	populate_logo_marquee($('.logo-ticker-section-logos-container'))


	const populate_video_marquee = ( parent, start, count ) => {

		const marquee_data = clients.slice( start, count ).sort(() => Math.random() - 0.5)
		let marquee_markup = '<div class="video-ticker-section-videos-slide-container"><div class="video-ticker-section-videos-slide">'

        marquee_data.forEach(function( data ) {
			if ( data.web_features.video_marquee ) {
				marquee_markup += '<div class="video-ticker-section-image-container"><div class="video-ticker-section-image-frame play-inline" title="'+data.name+'" data-vimeo-id="'+data.vimeo_ids[0]+'" data-url="https://vimeo.com/'+data.vimeo_ids[0]+'" data-client="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.web_features.featured_video[0]+'.jpg" /></div></div>'
			}
        })

		marquee_markup += '</div></div>'
        parent.html( marquee_markup ).append( marquee_markup )

    }
    populate_video_marquee($('#video_scroll_1 .video-ticker-section-videos-container'), 0, 15)
    populate_video_marquee($('#video_scroll_2 .video-ticker-section-videos-container'), 15, 30)
  

	const attach_industry_events = () => {

		$( '.featured-industries ul.industry-list li' ).on( "click", function( e ) {

			const tag = $(e.currentTarget)
			const industry = tag.data('industry')
			//console.log('industry: ' + industry)

			$('.featured-industries ul.industry-list li, .featured-industries  div.card-panel .card').removeClass('active')
			tag.addClass('active')
			$('.featured-industries  div.card-panel .card[data-industry="'+industry+'"]').addClass('active')

		})

	}


	const populate_industry_card_panel = ( parent ) => {

		const industry_data = clients.filter(client => client.web_features.home_industry === true).sort(() => Math.random() - 0.5)
		let industry_card_markup = '<div class="card-panel">'
		let industry_tag_markup = '<ul class="industry-list">'

        industry_data.forEach(function(data) { 

			let connector = data.industry.toLowerCase()
			connector = connector.replace(/&/g, "and").replace(/\s+/g, "_")
        	industry_card_markup += '<div class="card" data-industry="'+connector+'"><h4>'+data.name+'</h4><p>'+data.industry+'</p><div class="image-frame play-inline" title="'+data.name+'" data-vimeoid="'+data.vimeo_ids[0]+'" data-url="https://vimeo.com/'+data.vimeo_ids[0]+'" data-client="'+data.name+'"><img data-vimeoid="'+data.vimeo_ids[0]+'" alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.web_features.featured_video[0]+'.jpg" /></div></div>'
			industry_tag_markup += '<li data-industry="'+connector+'">'+data.industry+'</li>'

        })

		industry_card_markup += '</div>'
		industry_tag_markup += '</ul>'

		parent.html( industry_card_markup ).append( industry_tag_markup )
		attach_industry_events()

    }
	populate_industry_card_panel($('.featured-industries'))
	

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


	const populate_testimonials = ( parent ) => {

		const testimony_data = clients.filter(client => client.web_features.home_testimonials === true)
		let testimony_markup = ''

        testimony_data.forEach(function( data ) { 
			testimony_markup += '<li class=""><a href="" title="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="'+data.logo_url+'" /></a><div class="card"><div class="image-frame play-inline" title="'+data.name+'" data-vimeo-id="'+data.vimeo_ids[0]+'" data-url="https://vimeo.com/'+data.vimeo_ids[0]+'" data-client="'+data.name+'"><img alt="'+data.name+'" aria-hidden="false" src="https://vumbnail.com/'+data.web_features.featured_video[0]+'.jpg" /></div><q>'+data.web_features.testimonial.snippet+'</q><blockquote>'+data.web_features.testimonial.full_text+'</blockquote><cite>'+data.web_features.testimonial.contact+'</cite></div></li>'
        })

		parent.append(testimony_markup).find('li:first-child').addClass('active')
		attach_testimonial_events()

    }
	populate_testimonials($('.featured-testimonials .testimonial-list'))

  	attach_search_event()

    // $('.total-videographer-count').text( points.length )

	//$('section.hero div.chunklet').addClass('anim-test-2')
	$('section.hero div.chunklet h2').addClass('animate')

	//attach_marquee_events()

	// Modal video player
	document.querySelectorAll(".play-inline").forEach((d) => d.addEventListener("click", playVideos))

	$('.royals-w-cheese button').click( function () {
		$('body').toggleClass('nav-open')
	})

	$('#booking').length && init_multi_step_form( $('#booking') )

	/*
	$('.copy-btn').click( function () {
		let text = $('.copy-text').text()
		window.navigator.clipboard.writeText(text).then( x => {
			$('.fbm-copied-message').text('Copied to Clipboard')
			setTimeout( () => { $('.fbm-copied-message').text('') }, 5000 )
		})
	})
	*/

})



// TODO: integrate better!
// Stolen from: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform#maps_places_autocomplete_addressform-javascript
let autocomplete, address1Field //, address2Field, postalField

const initAutocomplete = () => {

	address1Field = document.querySelector("#hero_search")
	//address2Field = document.querySelector("#address2")
	//postalField = document.querySelector("#postcode")

	// Create the autocomplete object, restricting the search predictions to
	// addresses in the US and Canada.
	autocomplete = new google.maps.places.Autocomplete(address1Field, {
		componentRestrictions: { country: ["us", "ca"] },
		fields: ["address_components", "geometry"],
		types: ["address"],
	})
	//address1Field.focus()

	// When the user selects an address from the drop-down, populate the
	// address fields in the form.
	//autocomplete.addListener("place_changed", fillInAddress)

}

const fillInAddress = () => {

	// Get the place details from the autocomplete object.
	const place = autocomplete.getPlace()
	let address1 = ""
	let postcode = ""

	// Get each component of the address from the place details,
	// and then fill-in the corresponding field on the form.
	// place.address_components are google.maps.GeocoderAddressComponent objects
	// which are documented at http://goo.gle/3l5i5Mr
	for (const component of place.address_components) {
		// @ts-ignore remove once typings fixed
		const componentType = component.types[0]

		switch (componentType) {
			case "street_number": {
				address1 = `${component.long_name} ${address1}`
				break
			}
			case "route": {
				address1 += component.short_name
				break
			}
			case "postal_code": {
				postcode = `${component.long_name}${postcode}`
				break
			}
			case "postal_code_suffix": {
				postcode = `${postcode}-${component.long_name}`
				break
			}
			case "locality":
				//document.querySelector("#locality").value = component.long_name
				break
			case "administrative_area_level_1": {
				//document.querySelector("#state").value = component.short_name
				break
			}
			case "country":
				//document.querySelector("#country").value = component.long_name
				break
		}
	}

	//address1Field.value = address1
	//postalField.value = postcode
	// After filling the form with address components from the Autocomplete
	// prediction, set cursor focus on the second address line to encourage
	// entry of subpremise information such as apartment, unit, or floor number.
	address1Field.focus()

}

if ( $('form.videographer-search, form#booking').length ) {
	window.initAutocomplete = initAutocomplete
}

const despace = (str) => {
	return str.replace(/\s+/g, '')
}

const get_local_search = () => {

	const location_data = JSON.parse(localStorage.getItem('search_location')) || null

	if ( location_data ) {
		const location_data2 = location_data.results[0].address_components
		const location_array = [...location_data2]
		console.log('location array: \n' + location_data2)
		const required_data = ["street_number", "route", "locality", "administrative_area_level_1", "postal_code"]
		const street_number = location_array.find(item => item.types.includes("street_number"))?.long_name
		const street = location_array.find(item => item.types.includes("route"))?.long_name
		const full_street = (street_number || '') + ' ' + (street || '')

		let booking_address = {
			"input_street_1": full_street,
			"input_street_2": location_array.find(item => item.types.includes("subpremise"))?.long_name,
			"input_city": location_array.find(item => item.types.includes("locality"))?.long_name,
			"input_state": location_array.find(item => item.types.includes("administrative_area_level_1"))?.short_name,
			"input_zip": location_array.find(item => item.types.includes("postal_code"))?.long_name,
		}
		console.log(booking_address)
		return booking_address

	} else {
		return null
	}

}


const get_map_embed = (address) => {
	const formatted_address = address.replace(/\s+/g, "+")
	const dynamic_embed = '<iframe width="100%" height="100%"  style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA&q='+address+'"></iframe>'
	const static_embed = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+formatted_address+'&zoom=12&size=600x200&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA" /><h4>'+address+'</h4>'
	$('#map_embed').html(static_embed)
}

const prepopulate_form = () => {

	const getAllFormElements = element => Array.from(element.elements).filter(tag => ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()))

	const local_data = get_local_search()

	if ( local_data ) {
		const form_elements = getAllFormElements(document.getElementById("booking"))
		//console.log(form_elements)

		form_elements.forEach(el => {
			//console.log(el.name)
			$('form#booking #' + el.name).val(local_data[el.name])
		})
		const formatted_address = JSON.parse(localStorage.getItem('search_location')).results[0].formatted_address
		get_map_embed(formatted_address)
	}
}

const prepare_form = () => {

	const pre_search = localStorage.getItem('search_location')
	pre_search && $('form#booking').addClass('prepopulate')
	pre_search && prepopulate_form()

}

if ( $('form#booking').length ) {
	prepare_form()
}


/* AIRTABLE: */

const AT_token = 'patcr2ZswB25Nu6lZ.7ce9948f870abc242d363be37aeebbd37396bb89ff3e02e33c77891efc770f75'
let Airtable = require('airtable')
let V_base = new Airtable({apiKey: AT_token}).base('viwPes26VIkxAVnmd') // OLD videographers
let C_base = new Airtable({apiKey: AT_token}).base('appbdi6tmH8jEwTeT') // OLD clients
let NC_base = new Airtable({apiKey: AT_token}).base('appDFrLNc39IyI21f')

let totalVideographers = 0
let zip_array = []

NC_base('Videographers (Short)').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {

	records.forEach(function(record) {
		zip_array.push(record.get('Zip Code'))
    })
	totalVideographers += records.length
    fetchNextPage()

}, function done(err) {
    if (err) { 
		console.error(err)
		return
	} else { 
		console.log(`Total number of videographers: ${totalVideographers}`) 
		//console.log(`zip_array: ${zip_array}`)
		//$('.total-videographer-count').text( totalVideographers )
	}
})

/*
let allClients = []
C_base('Imported table').select({
    //maxRecords: 10, // or pageSize
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
		allClients.push({ "name": record.get('Name'), "industry": record.get('Industry')})
    })

	try { // HERE: https://github.com/Airtable/airtable.js/issues/246
		fetchNextPage()
	} catch { 
		console.log('Client total: ' + allClients.length)
		console.log('...and also: ' + JSON.stringify(allClients))
		return 
	}
    

}, function done(err) {
    if (err) { 
		console.error(err) 
		return 
	} else {
		console.log('Clients object: ' + JSON.parse(allClients))
	}
})
*/


