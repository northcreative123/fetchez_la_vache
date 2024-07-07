
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
        message => !is_prod && console.log(message)
    )
}

const tz_from_latlon = async ( ll_obj ) => {
    // { "lat": 42.3778496, "lng": -83.4688607 }
    // https://www.geotimezone.com/
    const url = 'https://api.geotimezone.com/public/timezone?latitude=' + ll_obj.lat + '&longitude=' + ll_obj.lng
    const response = await fetch( url )
    .then(( response ) => { return response.json() })
    .then(( json ) => {

        localStorage.setItem('searched_address_tz', JSON.stringify( json ))

    })
    .catch(( err ) => { 
		const error = `Error getting timezone data: ${err}`
		!is_prod && console.log(error)
		return null
	})
}

const geocode_address = async ( address, parent_el ) => {

    !is_prod && console.log('searching the google for address: ' + address)
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
        //!is_prod && console.log("search data: \n", search_data)

        if ( search_data.street_number && search_data.street_name ) {
            search_data.address_line1 = search_data.street_number + ' ' + search_data.street_name
        }
        if ( search_data.address_line1 && search_data.city && search_data.state && search_data.postal_code ) {
            search_data.local_formatted_address = search_data.address_line1 + ', ' + search_data.city + ', ' + search_data.state + ', ' + search_data.postal_code
        }

        !current_url.includes('file://') && tz_from_latlon( search_data.lat_lng )

        localStorage.setItem('raw_search_response', JSON.stringify( json.results[0] ))
		localStorage.setItem('searched_address', JSON.stringify( search_data ))

        prepopulate_booking_form()
        //get_map_embed( search_data.google_formatted_address )

    })
    .catch(( err ) => { 

		const error = `Error getting location data: ${err}`
		const result_message = '<strong>"'+address+'"</strong> was not recognized as valid.'
		!is_prod && console.log(error)
		$parent.find('input.search-input').focus()
		$parent.find('.error').html(result_message)

		return error

	})

}

const attach_search_event = () => {

	$('button.geocode-lookup').on( "click", function( e ) {
		e.preventDefault()
		const input = $('#fld_hero_search')
		const address = input.val()
        //console.log('CLICK!: ', input.val())

		if ( address.length >= 5 ) {
			geocode_address(address, $(e.currentTarget).parent())
		}
	})
}



const serialize_object = () => {

    const form_elements = getAllFormElements(document.getElementById("booking"))
    var o = {}
    form_elements.forEach(el => {
        if (el.type === 'radio') {
            if (!o[el.name]) {
                o[el.name] = [o[el.name]]
                o[el.name] = null
            }
            if (el.checked) {
                if ( (el.value === "true") || (el.value === "false") ) {
                    o[el.name] = (el.value === "true")
                } else {
                    o[el.name] = el.value
                }
            }
        } else if (el.type === 'select-multiple') {
            let selected = Array.from(el.options).filter(function (option) {
                return option.selected
            }).map(function (option) {
                return option.value
            })
            o[el.name] = selected  || null
        } else if ( el.type === 'date' ) {
            let to_utc = el.value ? moment(el.value).utc() : null
            if (o[el.name]) {
                if (!o[el.name].push) {
                    o[el.name] = [o[el.name]]
                }
                o[el.name].push(to_utc)
            } else {
                o[el.name] = to_utc
            }
        } else {
            if (o[el.name]) {
                if (!o[el.name].push) {
                    o[el.name] = [o[el.name]]
                }
                o[el.name].push(el.value || null)
            } else {
                o[el.name] = el.value || null
            }
        }
    })
    return o
}
  

// deprecated
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
        "fld_video_types": [],
        "fld_video_platforms": [],
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
    // TODO: GET booking datetimes from DB?

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
            !is_prod && console.log("Address has all required data")
            $('.address-detail').removeClass('active')
        } else {
            !is_prod && console.log("Address is missing required data")
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

const getAllFormElements = element => Array.from(element.elements).filter(tag => ["select", "textarea", "input"].includes(tag.tagName.toLowerCase()))

const prepopulate_booking_form = () => {


    const booking_data = get_local_booking()

    const form_elements = getAllFormElements(document.getElementById("booking"))
    //!is_prod && console.log(form_elements)

    form_elements.forEach(el => { // TODO: update for radio & multi
        //!is_prod && console.log('name: ' + el.name + ' type: ' + el.type + ' value: ' + el.value)

        if ( el.type == "radio" ) {
            let tmp_val = booking_data[el.name]
            if (typeof tmp_val == "boolean") {
                tmp_val = tmp_val.toString()
            }
            if ( el.value === tmp_val ) {
                el.checked = true
            }

        } else if ( el.type == "select-multiple" ) {

            //let options = Array.from(el.options)
            let selected = booking_data[el.name]

            Array.from(el.options).forEach(function (option) {
                option.selected = selected.includes(option.value)
            })

        } else if ( el.type == "date" ) {

            let time = booking_data[el.name] ? moment(booking_data[el.name]).format('YYYY-MM-DD') : ''
            $('[name="' + el.name + '"]').val(time)

        } else {

            $('[name="' + el.name + '"]').val(booking_data[el.name])

        }
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
    //!is_prod && console.log('req #: ' + required.length)
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

        save_form_data( $( "form#booking" ), 'booking_data' )

		// update progress bars
		progress_bar.find("li").eq($("fieldset").index(next_fs)).addClass("active")
		setProgressBar(++current)

		next_fs.addClass('current')
		current_fs.removeClass('current')
		current_fs.removeClass("active")
		next_fs.addClass("active")

		!is_prod && console.log('current step: ' + current)
        if ( $(this).attr('id') == 'booking_submit' ) {
            handle_booking( $('fieldset.step-success') )
        } else {
		    validateStep()
        }
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

		!is_prod && console.log('current step: ' + current)
		validateStep()
	})

	function setProgressBar(curStep) {
		var percent = parseFloat(100 / steps) * curStep
		percent = percent.toFixed()
		multi_form.find(".progress-bar").css("width", percent + "%")
	}

    $('input[type=tel]').inputmask({"mask": "(999) 999-9999"})

	multi_form.find('input, textarea, select').on( "change keyup blur", function( e ) {
        if ( $(this).is('#fld_hero_search') && e.which == 13 ) {
            e.preventDefault()
            //!is_prod && console.log('You pressed enter!')
            // clear address
            $( "#input_street_1, #input_street_2, #input_city, #input_state, #input_zip" ).val("")
            save_form_data( $( "form#booking" ), 'booking_data' )
            $(this).next().trigger('click')
        }
        validateStep()
		
	})

	validateStep()

}



const format_summary = ( data_obj ) => {

    let summary = {
        "Service Address": data_obj.fld_hero_search,
        "Video Subject": data_obj.fld_target,
        "Service Type": data_obj.fld_on_site ? "On-Site" : "Edit Only",
        "Brief Description": data_obj.fld_video_description,
        "Video Type(s)": data_obj.fld_video_types,
        "Video Platform(s)": data_obj.fld_video_platforms,
        "Recurring": data_obj.fld_recurring_video ? "Yes" : "No",
        "Shoot Date": data_obj.fld_shoot_date,
        "Delivery Date": data_obj.fld_delivery_date,
        "Name": data_obj.fld_first_name + ( data_obj.fld_last_name ? " " + data_obj.fld_last_name : "" ),
        "Email": data_obj.fld_email,
        "Phone": data_obj.fld_phone,
        "Company": data_obj.fld_company_name,
        "Website": data_obj.fld_website
    }

    const entries = Object.entries( summary )
    let html_summary = ""
    entries.forEach(([key, value]) => {
        if ( value && value.length )  html_summary += `<dl><dt>${key}</dt><dd>${value}</dd></dl>`
    })

    return html_summary
    
}

const save_form_data = ( form, ls_name ) => {

    let serialized = serialize_object( form )
    let html_summary = format_summary( serialized )
    $('span.booking-summary').html( html_summary )
    localStorage.setItem(ls_name, JSON.stringify( serialized ))
    !is_prod && console.log( 'form saved to local storage' )

}

function adjust_datepickers() {

    const dateInputs = $('.date-picker')
    const today = new Date(Date.now()) 
    const formattedToday = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
    const tomorrow = new Date(Date.now() + 86400000) // 86400000 is the number of milliseconds in a day
    const formattedTomorrow = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0')
    const nextyear = new Date(Date.now() + (86400000 * 180)) // 6 mos
    const formattedNextyear = nextyear.getFullYear() + '-' + String(nextyear.getMonth() + 1).padStart(2, '0') + '-' + String(nextyear.getDate()).padStart(2, '0')

    dateInputs.attr('min', formattedTomorrow).attr('max', formattedNextyear) //.val('')

}

function init_select_tags() {

    $(".tag-select select").change(function () {
        const tag_container = $(this).parent().find('.selected')
        const selected = $(this).find(':selected').map(function(i, el) {
            return $(el).text()
        }).get()

        tag_container.text( '[ ' + selected.length + ' Selected ]')
    }).trigger('change')

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
        save_form_data( $(this), 'booking_data' )
    }) 

    $('input[name="fld_preferred_contact_method"]').on( "change", function( event ) {
        let phone_req = $(this).val() === "Phone"
        $("input#fld_phone").prop('required', phone_req)
        validateStep()
    })

    $( "form#booking button.reload-dirty" ).on( "click", function( event ) {
        event.preventDefault()
        location.reload()
    })

    $( "form#booking button.reload-clean" ).on( "click", function( event ) {
        event.preventDefault()
        localStorage.removeItem("booking_data")
        localStorage.removeItem("searched_address")
        location.reload()
    })

    // $('.send-email').click( function () {
    //     send_email()
    // })

})



const format_object_key = (str) => {
    //const str = "fld_my_string_to_process";
    const result = str
    .replace("fld_", "") // remove "fld_"
    .replace(/\_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (match) => match.toUpperCase()) // uppercase first letter of each word

    return result
}

const convert_object_keys = (original_object) => {

    const formatted_keys = Object.fromEntries(
        Object.entries(original_object).map(([key, value]) => [
            format_object_key(key), value
        ])
    )
    return formatted_keys
}

const remove_object_nulls = (original_object) => {
    const filteredObj = Object.fromEntries(
        Object.entries(original_object).filter(([key, value]) => value !== null)
    )
    return filteredObj
}
  
// UTC date and time, e.g. "2014-09-05T07:00:00.000Z"
const prepare_record_data = () => { // TODO: remove null values
    const booking_data = JSON.parse(localStorage.getItem('booking_data'))
    const formatted_data = convert_object_keys( booking_data )

    const date = moment(formatted_data["Booking Date"], "YYYY-MM-DD") // date parts, be careful about timezone
    const time = moment(formatted_data["Booking Time"], "HH-mm") // time parts, may be extended with seconds, milliseconds
    date?.hour(time ? time.hours() : date.hours()).minute(time ? time.minutes() : date.minutes())
    const datetime = date?.format()
    //!is_prod && console.log(datetime) // time of date is set
    //!is_prod && console.log(date?.toDate()) // Javascript DateTime object

    const pref = formatted_data["Preferred Contact Method"] ? formatted_data[ formatted_data["Preferred Contact Method"] ]  : formatted_data["Email"]

    formatted_data["Booking Date Time"] = datetime
    formatted_data["Name And Contact"] = formatted_data["First Name"] + ( formatted_data["Last Name"] ? ' ' + formatted_data["Last Name"] : '' ) + ': ' + pref

    delete formatted_data["Booking Date"]
    delete formatted_data["Booking Time"]
    delete formatted_data["Hero Search"]

    return remove_object_nulls(formatted_data)
}




const lancez_la_vache = async ( data ) => { 
    
	const url = 'https://api-proxy-five-omega.vercel.app/wfapi/db/create-booking'
    const config = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( data )
    }

    try {
        const resdata = await fetch( url, config )
        //const resdata = await response.json()
        .then(( response ) => { 
            
            !is_prod && console.log( 'lancez_la_vache response: ', response )
            return response.json() 
    
        })
        .then(( json ) => {
    
            !is_prod && console.log('%c 🤓 Proxy test:', console_data_style, json)
        
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

const handle_booking = ( response_container ) => {
    !is_prod && console.log('SUBMIT')
    record_data = prepare_record_data()
    console.log('record data:\n', record_data )

    !is_local && lancez_la_vache( record_data )

    /*
    NC_base('Web Booking').create([
        {
            "fields": record_data
        }
    ], function (err, records) {
        if (err) {
            console.error(err)
            response_container.find('.step-fields').append(`<dl><dt>error:</dt><dd>${err}</dd></dl>`)
            response_container.addClass('error')
            return
        }
        records.forEach(function (record) {
            !is_prod && console.log(record.getId())
        })
        response_container.find('.step-fields').remove('.thx').append(`<h2 class="thx">Thank you ${record_data['First Name']}!</h2>`)
        response_container.addClass('complete')
        localStorage.removeItem("booking_data")
        localStorage.removeItem("searched_address")
        $('.progress-bar').removeClass(('progress-bar-animated'))
    })
    */


}



let autocomplete, address1Field
const initAutocomplete = () => {

	address1Field = document.querySelector("#fld_hero_search")

	// Create the autocomplete object, restricting the search predictions to addresses in the US and Canada.
	autocomplete = new google.maps.places.Autocomplete(address1Field, {
		componentRestrictions: { country: ["us", "ca"] },
		fields: ["address_components", "geometry"],
		types: ["address"],
	})
	address1Field.focus()

}
if ( $('form#booking').length ) {
	window.initAutocomplete = initAutocomplete
}