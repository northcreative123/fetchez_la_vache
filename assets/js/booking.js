
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

        const data = json
        localStorage.setItem('search_location', JSON.stringify( json ))
		
        const formatted_address = data.results[0].formatted_address
		const ll_result = data.results[0].geometry.location
		const ll_obj = { "lat": ll_result.lat, "lon":  ll_result.lng }

		let result_count = get_points_in_radius(points, ll_obj, 50)
		//if (result_count === 0) { result_count = '[3]' }
		let be = result_count === 1 ? 'is' : 'are'
		let plural = result_count === 1 ? '' : 's'

        //const result_message = 'There '+be+' currently <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		// TODO: if 0 add "Want a videographer? Find a nearby videographer ..."
		const result_message = 'We have <strong>' + result_count + ' videographer'+plural+'</strong> within 50 miles of ' + formatted_address
		console.log('result count: ' + result_count)

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
	const static_embed = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+formatted_address+'&zoom=12&size=600x200&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA" />'
	$('#map_embed').html(static_embed)
    $('.location-text').html('<h4>'+address+'</h4>')
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

    if ( $('form#booking').length ) {
        prepare_form()
        init_multi_step_form( $('#booking') )
    }

})