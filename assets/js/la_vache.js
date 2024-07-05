
const is_prod = window.location.hostname === 'northcreative'
localStorage.setItem( 'env_prod', is_prod )

const get_random = ( x ) => { return Math.floor( Math.random() * ( x ? x : 10000000 ) ) }
const get_classy = ( str ) => { return str.replace(/\s+/g, '-').toLowerCase() }
const despace = ( str ) => { return str.replace(/\s+/g, '') }
const get_fn_name = () => { return getFuncName.caller.name }
// const log_fn_name = () => { return getFuncName.caller.name }
const get_loc = () => { return 'Loc Sniffing Inactive' } // () => { return localStorage.getItem('location') || 'unknown' } // user IP sniff - TODO: REMOVE (or detail in privacy/terms)
const clear_local_storage = () => { localStorage.clear() }

const tz = new Date().getTimezoneOffset() / 60 //moment.tz.guess()
localStorage.setItem('user_tz_offset', tz)

const current_url = window.location.href
!localStorage.getItem( 'user_tag' ) && localStorage.setItem( 'user_tag', get_random() )
const user_tag = localStorage.getItem( 'user_tag' )
console.log('user tag: ', user_tag)

// remove W3C link if local file
current_url.includes('file://') ? $('a.w3c').parent().remove() : $('a.w3c').attr('href', 'https://validator.w3.org/nu/?doc='+current_url)
const visitor_log = { 
    "host": current_url.includes('file://') ? 'local file' : window.location.hostname,
    "page": current_url.substring(current_url.lastIndexOf("/") + 1, current_url.length),
    "datetime": new Date(),
    "tag": user_tag,
    "title": document.title
}

// https://www.telerik.com/blogs/how-to-style-console-log-contents-in-chrome-devtools
// ✨ 🤓 ☠️ ❣️ 🤪 🙊
const console_key_style = "color: yellow; font-size: 12px;"
const console_data_style = "color: orange; font-size: 12px; padding: 5px 10px;"
const console_success_style = "color: green; font-size: 20px;"
const console_revisit_style = "color: pink; font-size: 18px; font-weight: bold;"
const console_error_style = "color: red; font-size: 20px; font-weight: bold;"
const console_pride_style = "padding: 10px 0 20px; font-weight: bold; font-size: 30px;color: white; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)"

!is_prod && console.log('%c 🐄 Fetchez la Vache !', console_pride_style)

/*
!is_prod && console.log( '%c 🤓 console.log: ', console_key_style, 'message/data' )
!is_prod && console.info( '%c 🤓 console.info: ', console_key_style, 'message/data' )
!is_prod && console.warn( '%c 🤓 console.warn: ', console_key_style, 'message/data' )
!is_prod && console.error( '%c 🤓 console.error: ', console_key_style, 'message/data' )
*/


/* AIRTABLE: */
// TODO: Hide & establish domain restrictions for all API keys ( Zapier )
const AT_token = 'patcr2ZswB25Nu6lZ.7ce9948f870abc242d363be37aeebbd37396bb89ff3e02e33c77891efc770f75'
let Airtable = require('airtable')
let NC_base = new Airtable({apiKey: AT_token}).base('appDFrLNc39IyI21f')



// async containers/features that don't already have a "loading" class
// async functions must remove the class on completion
$('.web-feature').addClass('loading') // TODO: only add class to parent container?

$( function() {

    // mobile menu trigger - TODO: refactor
    $('.royals-w-cheese .burger').click( function () {
        $('body').toggleClass('nav-open')
    })



    let loc = get_loc()
    NC_base('User Sniff').create([
        {
            "fields": {
                "Name": "Tag: " + visitor_log.tag + ", Stamp: " + Date.now(),
                "Host": visitor_log.host,
                "Page": visitor_log.page,
                "Title": visitor_log.title,
                "Datetime": visitor_log.datetime,
                "Location": loc
            }
        }
    ], function (err, records) {
        if (err) {
            console.error(err)
            return
        }
        records.forEach(function (record) {
            !is_prod && console.log( '%c 🙊 View logged: ', console_revisit_style, record.getId() )
        })
    })

})