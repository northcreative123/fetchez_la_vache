
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
		//const result_message = 'We have <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		//console.log('result count: ' + result_count)

		let local_result = {
			"radius": 50,
			"ll_center": ll_obj,
			"videographer_count": result_count
		}

		localStorage.setItem('local_result', JSON.stringify( local_result ))

		//$parent.find('.result-block p').html(result_message)
        //$parent.removeClass('searching').addClass('result')

        prepopulate_form()

        return result_message

    })
    .catch(( err ) => { 

		const error = `Error getting location data: ${err}`
		const result_message = '<strong>"'+address+'"</strong> was not recognized as valid.'
		console.log(error)

		$parent.find('input.search-input').focus()
		//$parent.find('.result-block p').html(result_message)
		//$parent.removeClass('searching').addClass('result error')

		return error

	})

}

const attach_search_event = () => {

	$('button.geocode-lookup').on( "click", function( e ) {

		e.preventDefault()
		const input = $(e.currentTarget).prev() //.find($('.search-input'))
		const address = input.val()

		if ( address.length >= 2 ) {

			//$(e.currentTarget).removeClass('result error').addClass('searching')
			console.log('searched address: ' + address)
			const address_ll = geocode_address(address, $(e.currentTarget).parent())
			//console.log('address lat/lon: ' + JSON.stringify(address_ll))

		} else {

			//console.log('invalid address: ' + address)
			//$(e.currentTarget).find('input.search-input').focus()
			//$(e.currentTarget).find('.result-block p').html('Search must contain <strong>more than 2 characters</strong>.')
			//$(e.currentTarget).addClass('result error')

		}

	})

}






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

const serialize_object = (form) => {
    var o = {}
    var a = form.serializeArray()
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]]
            }
            o[this.name].push(this.value || '')
        } else {
            o[this.name] = this.value || ''
        }
    })
    return o
}

const get_local_search = () => {

	//const location_data = JSON.parse(localStorage.getItem('search_location')) || null
    const location_data = JSON.parse(localStorage.getItem('searched_address')) || null
	//console.log('location array: \n' + JSON.stringify(location_data))

	if ( location_data ) {
		//const location_data2 = location_data.results[0].address_components
		//const location_array = [...location_data2]

        if ( location_data.street_number && location_data.street_name ) {
            location_data.address_line1 = location_data.street_number + ' ' + location_data.street_name
        }
        if ( location_data.address_line1 && location_data.city && location_data.state && location_data.postal_code ) {
            location_data.local_formatted_address = location_data.address_line1 + ', ' + location_data.city + ', ' + location_data.state + ', ' + location_data.postal_code
        }

/*

        location_data = {
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

        [
            { "long_name": "Chicago", "short_name": "Chicago", "types": ["locality", "political"] }, 
            { "long_name": "Cook County", "short_name": "Cook County", "types": ["administrative_area_level_2", "political"] }, 
            { "long_name": "Illinois", "short_name": "IL", "types": ["administrative_area_level_1", "political"] }, 
            { "long_name": "United States", "short_name": "US", "types": ["country", "political"] }
        ]
*/
		//const street_number = location_array.find(item => item.types.includes("street_number"))?.long_name
		//const street = location_array.find(item => item.types.includes("route"))?.long_name
		//const full_street = (street_number || '') + ' ' + (street || '')

		let booking_address = {
			"input_street_1": location_data.address_line1 && despace(location_data.address_line1) ? location_data.address_line1 : "",
			"input_street_2": location_data.address_line2,
			"input_city": location_data.city,
			"input_state": location_data.state,
			"input_zip": location_data.postal_code,
            "hero_search": location_data.google_formatted_address
		}
		//console.log('booking address: \n' + JSON.stringify(booking_address))
        
		const required_data = ["street_number", "street_name", "city", "state", "postal_code"]

        if (required_data.every(key => location_data.hasOwnProperty(key) && location_data[key] !== null)) {
            console.log("Address has all required data")
            $('.address-detail').removeClass('active')
        } else {
            console.log("Address is missing required data")
            $('.address-detail').addClass('active')
        }
        
        return booking_address

	} else {
		return null
	}

}


const get_map_embed = (address) => {
	const formatted_address = address.replace(/\s+/g, "+")
	const dynamic_embed = '<iframe width="100%" height="100%"  style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA&q='+address+'"></iframe>'
	const static_embed = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+formatted_address+'&zoom=12&size=600x200&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA" />'
	$('#map_embed').html(static_embed)
    $('.location-text').html('<h5>'+address+'</h5>')
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
		const formatted_address = JSON.parse(localStorage.getItem('searched_address')).google_formatted_address
		get_map_embed(formatted_address)
	}
}

const prepare_form = () => {

	const pre_search = localStorage.getItem('searched_address')
	pre_search && $('form#booking').addClass('prepopulate')
	pre_search && prepopulate_form()

}


const init_multi_step_form = ( multi_form, start_step ) => {

	const progress_bar = $("#progressbar")
	let current_fs, next_fs, previous_fs //fieldsets
	let current = start_step
	let steps = multi_form.find("fieldset").length

    multi_form.find('fieldset').eq(0).addClass('current active')
	setProgressBar(current)

	multi_form.find(".next").click(function () {

		current_fs = $(this).parent()
		next_fs = $(this).parent().next()

        save_form_data( $( "form#booking" ), 'booking_form_data' )

		// update progress bars
		progress_bar.find("li").eq($("fieldset").index(next_fs)).addClass("active")
		setProgressBar(++current)

		next_fs.addClass('current')
		current_fs.removeClass('current')
		current_fs.removeClass("active")
		next_fs.addClass("active")

		console.log('current step: ' + current)
		validateStep()
	})

	multi_form.find(".previous").click(function () {

		current_fs = $(this).parent()
		previous_fs = $(this).parent().prev()

        // update progress bars
		progress_bar.find("li").eq($("fieldset").index(current_fs)).removeClass("active")
		setProgressBar(--current)

		previous_fs.addClass('current')
		current_fs.removeClass('current')
		current_fs.removeClass("active")
		previous_fs.addClass("active")

		console.log('current step: ' + current)
		validateStep()
	})

	function setProgressBar(curStep) {
		var percent = parseFloat(100 / steps) * curStep
		percent = percent.toFixed()
		multi_form.find(".progress-bar").css("width", percent + "%")
	}

	function validateStep(field) { // current
		let next_button = $('.current button.next')
        let required = $('.current').find('input, textarea, select').filter('[required]')
        //console.log('req #: ' + required.length)
        let is_gtg = true
        required.each( function( index ) {
            let is_valid = $( this ).valid()
            if ( !is_valid ) is_gtg = false
        })
        next_button.prop( "disabled", !is_gtg )
	}

    $('input[type=tel]').inputmask({"mask": "(999) 999-9999"})

	multi_form.find('input, textarea, select').on( "change, keyup", function( e ) {
        if( $(this).is('#hero_search') && e.which == 13 ) {
            e.preventDefault()
            console.log('You pressed enter!')
            // clear address
            $( "#input_street_1, #input_street_2, #input_city, #input_state, #input_zip" ).val("")
            save_form_data( $( "form#booking" ), 'booking_form_data' )
            $(this).next().trigger('click')
        } else {
            validateStep($(this))
        }
		
	})

	validateStep()

}



const save_form_data = ( form, ls_name ) => {
    let serialized = serialize_object( form )
    localStorage.setItem(ls_name, JSON.stringify( serialized ))
    console.log( 'form saved to local storage' )
}

function adjust_datepickers() {

    const dateInputs = $('.date-picker')
    const today = new Date(Date.now()) 
    const formattedToday = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
    const tomorrow = new Date(Date.now() + 86400000) // 86400000 is the number of milliseconds in a day
    const formattedTomorrow = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0')
    const nextyear = new Date(Date.now() + (86400000 * 180)) // 6 mos
    const formattedNextyear = nextyear.getFullYear() + '-' + String(nextyear.getMonth() + 1).padStart(2, '0') + '-' + String(nextyear.getDate()).padStart(2, '0')

    dateInputs.attr('min', formattedTomorrow).attr('max', formattedNextyear).val(formattedTomorrow)

}

function init_select_tags() {

    $(".tag-select select").change(function () {
        const tag_container = $(this).parent().find('.selected')
        const selected = $(this).find(':selected').map(function(i, el) {
            return $(el).text()
        }).get()

        tag_container.text( '[ ' + selected.join(', ') + ' ]')
    })

}

$( function() {

    if ( $('form#booking').length ) {
        prepare_form()
        adjust_datepickers()
        init_select_tags()
        init_multi_step_form( $('#booking'), 1 )
        attach_search_event()
    }

    $( "form#booking" ).on( "submit", function( event ) {
        event.preventDefault()
        save_form_data( $(this), 'booking_form_data' )
    })

})




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
NC_base('form_submit_test').create([
    {
        "fields": {
            "Name": "another record",
            "Notes": "timestamp: " + Date.now()
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
*/

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


