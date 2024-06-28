
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
            "zip": json.results[0].address_components.find(item => item.types.includes("postal_code"))?.long_name || null,
            "local_formatted_address": null,
            "google_formatted_address": json.results[0].formatted_address || null,
            "lat_lng": json.results[0].geometry.location || null
        }
        //console.log("search data: \n" + JSON.stringify(search_data))

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

		if ( address.length >= 4 ) {

			$(e.currentTarget).removeClass('result error').addClass('searching')
			console.log('searched address: ' + address)
			const address_ll = geocode_address(address, $(e.currentTarget))
			//console.log('address lat/lon: ' + JSON.stringify(address_ll))

		} else {

			//console.log('invalid address: ' + address)
			$(e.currentTarget).find('input.search-input').focus()
			$(e.currentTarget).find('.result-block p').html('Search must contain <strong>more than 3 characters</strong>.')
			$(e.currentTarget).addClass('result error')

		}
	})
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
		//$('#audience_buttons').css('bottom', down_value)

	}
	const set_scroll_listener = () => {

		window.addEventListener('scroll', () => {
			let offset_calc = window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
			document.body.style.setProperty('--scroll', offset_calc)
			move_stuff(offset_calc)
		}, false)

	}
	set_scroll_listener()



    // http://ip-api.com/json/24.127.12.129
    // ipinfo.io/24.127.12.129?token=d094b46883a2e4
	const getUserLocation = async ( ip ) => {

    	const response = await fetch('https://ipinfo.io/' + ip + '?token=d9e7dd4ebf804b')
        .then(( response ) => { return response.json() })
        .then(( json ) => {

            const data = json
            localStorage.setItem('location', JSON.stringify(json))
            //console.log('Location data: ' + JSON.stringify(data))
            //console.log('Lat/Lon: ' + data.loc)

          	const ll_obj = { "lat": data.loc.split(',')[0], "lon":  data.loc.split(',')[1] }

          	const results1 = get_points_in_radius(points, ll_obj, 50)
          	const results2 = get_points_in_radius(points, ll_obj, 100)
			const results3 = get_points_in_radius(points, ll_obj, 200)

          	//console.log('Videographers within 50 miles of ' + data.city + ': ' + results1)
          	//console.log('... 100 miles: ' + results2)
          	//console.log('... 200 miles: ' + results3)

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

	// $('section.hero div.chunklet h2').addClass('animate')

	// Modal video player
	document.querySelectorAll(".play-inline").forEach((d) => d.addEventListener("click", playVideos))

	// mobile menu
	$('.royals-w-cheese button').click( function () {
		$('body').toggleClass('nav-open')
	})

	// TODO: REMOVE
	getUserIP()

})



let autocomplete, address1Field

const initAutocomplete = () => {

	address1Field = document.querySelector("#hero_search")

	// Create the autocomplete object, restricting the search predictions to addresses in the US and Canada.
	autocomplete = new google.maps.places.Autocomplete(address1Field, {
		componentRestrictions: { country: ["us", "ca"] },
		fields: ["address_components", "geometry"],
		types: ["address"],
	})
	address1Field.focus()

}

if ( $('form.videographer-search').length ) {
	window.initAutocomplete = initAutocomplete
}




/* AIRTABLE: */

const AT_token = 'patcr2ZswB25Nu6lZ.7ce9948f870abc242d363be37aeebbd37396bb89ff3e02e33c77891efc770f75'
let Airtable = require('airtable')
let NC_base = new Airtable({apiKey: AT_token}).base('appDFrLNc39IyI21f')

let totalVideographers = 0
let zip_array = []
let loc = localStorage.getItem('location')

NC_base('Markers').select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {

	records.forEach(function(record) {
        let zip = record.get('Zip Code')
		zip !== "" && zip_array.push(zip)
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

NC_base('form_submit_test').create([
    {
        "fields": {
            "Name": "another TEST record",
            "Notes": "timestamp: " + Date.now(),
            "URL": window.location.href,
			"Location": loc
        }
    }
], function (err, records) {
    if (err) {
        console.error(err)
        return
    }
    records.forEach(function (record) {
        console.log(record.getId())
    })
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