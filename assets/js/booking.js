
const send_email = () => {
    let senderName = 'El Hefe'
    //let attName = csvFileName + moment().format() + '.csv'
    Email.send({
        Host : "smtp.gmail.com",
        Username : "mrjeffhill@gmail.com",
        Password : "bebgbivpimoiruwm",
        To : "jhill@northcreative.us",
        From : "jhill@northcreative.us",
        Subject : "A message from: " + senderName,
        Body : "<html><h2>What up yo?!</h2><p>From: <strong>" + senderName + "</strong></p><p><em>OMG IT WORKS!!! :)</em></p></html>"
        /*
        Attachments: [{
            name: attName,
            data: csvPath
        }] */
    }).then(
        message => console.log(message)
    )
}

const geocode_address = async ( address, parent_el ) => {

    console.log('searching the google for address: ' + address)
	const $parent = $(parent_el)
	const despaced = address.replace(/\s+/g, "+")
	// TODO: establish domain restrictions for all API keys
	const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+despaced+'&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA'
	const response = await fetch( url )
    .then(( response ) => { return response.json() })
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
        //localStorage.setItem('booking_data', JSON.stringify( booking_data ))

        prepopulate_booking_form()
        //get_map_embed( search_data.google_formatted_address )

    })
    .catch(( err ) => { 

		const error = `Error getting location data: ${err}`
		const result_message = '<strong>"'+address+'"</strong> was not recognized as valid.'
		console.log(error)
		$parent.find('input.search-input').focus()
		$parent.find('.error').html(result_message)

		return error

	})

}

const attach_search_event = () => {

	$('button.geocode-lookup').on( "click", function( e ) {
		e.preventDefault()
		const input = $(e.currentTarget).prev()
		const address = input.val()

		if ( address.length >= 5 ) {

			geocode_address(address, $(e.currentTarget).parent())

		}
	})

}



// TODO: integrate better!
// Stolen from: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform#maps_places_autocomplete_addressform-javascript
let autocomplete, address1Field //, address2Field, postalField

const initAutocomplete = () => {

	address1Field = document.querySelector("#hero_search")

	// Create the autocomplete object, restricting the search predictions to
	// addresses in the US and Canada.
	autocomplete = new google.maps.places.Autocomplete(address1Field, {
		componentRestrictions: { country: ["us", "ca"] },
		fields: ["address_components", "geometry"],
		types: ["address"],
	})
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

const prefix_object_keys = (original_object) => {

    const prefixedObject = Object.fromEntries(
        Object.entries(original_object).map(([key, value]) => [
            `fld_${key}`, // add the prefix to the key
            value // keep the original value
        ])
    )

    return prefixedObject
}

const get_local_booking = () => {

    const location_data = JSON.parse(localStorage.getItem('searched_address')) || null

    let booking_data = JSON.parse(localStorage.getItem('booking_data')) || {
        "fld_name_and_contact": null,
        "fld_county": null,
        "fld_township": null,
        "fld_country": null,
        "fld_hero_search": null,
        "fld_address_line_1": null,
        "fld_address_line_2": null,
        "fld_city": null,
        "fld_state": null,
        "fld_zip": null,
        "fld_target": null,
        "fld_on_site": null,
        "fld_video_description": null,
        "fld_video_types": null,
        "fld_video_platforms": null,
        "fld_recurring_video": null,
        "fld_shoot_date": null,
        "fld_delivery_date": null,
        "fld_first_name": null,
        "fld_last_name": null,
        "fld_email": null,
        "fld_phone": null,
        "fld_preferred_contact_method": null,
        "fld_company_name": null,
        "fld_website": null,
        "fld_booking_date_time": null
    }

    if ( location_data ) { 
       
        if ( location_data.google_formatted_address !== booking_data.fld_hero_search ) { // different address?
            // populate w/ last address search
            booking_data["fld_county"] = location_data.county
            booking_data["fld_township"] = location_data.township
            booking_data["fld_country"] = location_data.country
            booking_data["fld_hero_search"] = location_data.google_formatted_address
            booking_data["fld_address_line_1"] = location_data.address_line1
            booking_data["fld_address_line_2"] = location_data.address_line2
            booking_data["fld_city"] = location_data.city
            booking_data["fld_state"] = location_data.state
            booking_data["fld_zip"] = location_data.zip
        }

    }

    localStorage.setItem('booking_data', JSON.stringify( booking_data ))

    return booking_data

}

const verify_complete_address = () => {

    const location_data = JSON.parse(localStorage.getItem('searched_address')) || null

    if ( location_data ) {
        const required_data = ["street_number", "street_name", "city", "state", "zip"]

        if (required_data.every(key => location_data.hasOwnProperty(key) && location_data[key] !== null)) {
            console.log("Address has all required data")
            $('.address-detail').removeClass('active')
        } else {
            console.log("Address is missing required data")
            $('.address-detail').addClass('active')
        }
    }

}


const get_map_embed = (address) => {
	const formatted_address = address.replace(/\s+/g, "+")
	const dynamic_embed = '<iframe width="100%" height="100%"  style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA&q='+address+'"></iframe>'
	const static_embed = '<img src="https://maps.googleapis.com/maps/api/staticmap?center='+formatted_address+'&zoom=12&size=600x200&markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&key=AIzaSyBc8GJ2R3syEBVsuYVeiLGja1crMId7-JA" />'
	$('#map_embed').html(static_embed)
    $('.location-text').html('<h5>'+address+'</h5>')
}

const prepopulate_booking_form = () => {

	const getAllFormElements = element => Array.from(element.elements).filter(tag => ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()))

    const booking_data = get_local_booking()

    const form_elements = getAllFormElements(document.getElementById("booking"))
    //console.log(form_elements)

    form_elements.forEach(el => {
        // console.log(el.name)
        $('[name="' + el.name + '"]').val(booking_data[el.name])
    })

    if ( booking_data.fld_hero_search ) {
        get_map_embed( booking_data.fld_hero_search )
        verify_complete_address()
        validateStep()
    }
}

const prepare_form = () => {

	const pre_search = localStorage.getItem('searched_address')
	pre_search && $('form#booking').addClass('prepopulate')
	pre_search && prepopulate_booking_form()

}

const validateStep = (field) => {
    let next_button = $('fieldset.current button.next')
    let required = $('fieldset.current').find('input, textarea, select').filter('[required]')
    //console.log('req #: ' + required.length)
    let is_gtg = true
    required.each( function( index ) {
        let is_valid = $( this ).valid()
        if ( !is_valid ) is_gtg = false
    })
    next_button.prop( "disabled", !is_gtg )
}

const init_multi_step_form = ( multi_form, start_step ) => {

	const progress_bar = $("#progressbar")
	let current_fs, next_fs, previous_fs //fieldsets
	let current = start_step
	let steps = multi_form.find("fieldset").length

    multi_form.find('fieldset').eq(0).addClass('current active')
	setProgressBar(current)

	multi_form.find(".next").click(function () {

		current_fs = $(this).closest("fieldset") //.parent()
		next_fs = $(this).closest("fieldset").next()

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

		current_fs = $(this).closest("fieldset") //.parent()
		previous_fs = $(this).closest("fieldset").prev()

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

	// function validateStep(field) { // current
	// 	let next_button = $('.current button.next')
    //     let required = $('.current').find('input, textarea, select').filter('[required]')
    //     //console.log('req #: ' + required.length)
    //     let is_gtg = true
    //     required.each( function( index ) {
    //         let is_valid = $( this ).valid()
    //         if ( !is_valid ) is_gtg = false
    //     })
    //     next_button.prop( "disabled", !is_gtg )
	// }

    $('input[type=tel]').inputmask({"mask": "(999) 999-9999"})

	multi_form.find('input, textarea, select').on( "change, keyup", function( e ) {
        if ( $(this).is('#hero_search') && e.which == 13 ) {
            e.preventDefault()
            console.log('You pressed enter!')
            // clear address
            $( "#input_street_1, #input_street_2, #input_city, #input_state, #input_zip" ).val("")
            save_form_data( $( "form#booking" ), 'booking_form_data' )
            $(this).next().trigger('click')
        } 
        validateStep()
		
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

    dateInputs.attr('min', formattedTomorrow).attr('max', formattedNextyear).val('')

}

function init_select_tags() {

    $(".tag-select select").change(function () {
        const tag_container = $(this).parent().find('.selected')
        const selected = $(this).find(':selected').map(function(i, el) {
            return $(el).text()
        }).get()

        tag_container.text( 'Selected: [ ' + selected.join(', ') + ' ]')
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

    $('.send-email').click( function () {
        send_email()
    })

})




/* AIRTABLE: */
/*
DATES:      https://support.airtable.com/docs/supported-format-specifiers-for-datetime-format
MARKDOWN:   https://support.airtable.com/docs/using-markdown-in-airtable
JSON:       https://community.airtable.com/t5/other-questions/is-it-possible-to-add-json-data-or-an-array-of-objects-into/td-p/121614
            https://community.airtable.com/t5/other-questions/getting-started-with-airtable-importing-json-data-structure/td-p/58619
*/
/*
const AT_token = 'patcr2ZswB25Nu6lZ.7ce9948f870abc242d363be37aeebbd37396bb89ff3e02e33c77891efc770f75'
let Airtable = require('airtable')
let NC_base = new Airtable({apiKey: AT_token}).base('appDFrLNc39IyI21f')

let totalVideographers = 0
let zip_array = []
let loc = localStorage.getItem('location')

NC_base('Markers').select({
    view: "Grid view",
    filterByFormula: "NOT({Zip Code} = '')"
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
*/

/*
Name And Contact
string (First Name _ Preferred Contact Method: Phone/Email)

Address Line 1
string

Address Line 2
string

City
string

State
string (2)

Zip
string

County
string

Township
string

Country
string

Target
Single select, string e.g. "Self" OR "Client" (currently)

On-Site
boolean

Video Description
Long text (with rich text formatting enabled)

Video Types
Long text (with rich text formatting enabled)/json?

Video Platforms
Long text (with rich text formatting enabled)/json?

Recurring Video
boolean

Shoot Date
Date and time string (ISO 8601 formatted date) UTC date and time, e.g. "2014-09-05T07:00:00.000Z"

Delivery Date
Date and time string (ISO 8601 formatted date) UTC date and time, e.g. "2014-09-05T07:00:00.000Z"

First Name
string

Last Name
string

Email
string e.g. "support@example.com", "sales@example.com"

Phone
string e.g. "(415) 555-9876"

Company Name
string

Website
string (e.g. airtable.com or https://airtable.com/universe)
 
Booking Date Time
Date and time string (ISO 8601 formatted date) UTC date and time, e.g. "2014-09-05T07:00:00.000Z"

Preferred Contact Method
Single select, string e.g. "Phone" OR "Email" (currently)
*/



