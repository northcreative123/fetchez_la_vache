
const current_url = window.location.href
const is_prod = window.location.hostname === 'northcreative' // || window.location.hostname === 'webflow'
const is_local = current_url.includes('file://')
localStorage.setItem( 'env_prod', is_prod )

const get_random = ( x ) => { return Math.floor( Math.random() * ( x ? x : 10000000 ) ) }
const get_classy = ( str ) => { return str.replace(/\s+/g, '-').toLowerCase() }
const despace = ( str ) => { return str.replace(/\s+/g, '') }
const get_fn_name = () => { return getFuncName.caller.name }
// const log_fn_name = () => { return getFuncName.caller.name }
//const get_loc = () => { return 'Loc Sniffing Inactive' }
const get_loc = () => { return localStorage.getItem('location') || 'unknown' } // user IP sniff - TODO: REMOVE (or detail in privacy/terms)
const clear_local_storage = () => { localStorage.clear() }

const tz = new Date().getTimezoneOffset() / 60 //moment.tz.guess()
localStorage.setItem('user_tz_offset', tz)

!localStorage.getItem( 'user_tag' ) && localStorage.setItem( 'user_tag', get_random() )
const user_tag = localStorage.getItem( 'user_tag' )
console.log('user tag: ', user_tag)

// remove W3C link if local file
is_local ? $('a.w3c').parent().remove() : $('a.w3c').attr('href', 'https://validator.w3.org/nu/?doc='+current_url)
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

if ( user_tag === "8989986" ) {
    // window.open("https://www.youtube.com/watch?v=LLFhKaqnWwk", '_blank')
    !is_prod && console.log('%c 🐄 Hello Jacob !!!', console_pride_style)
} else {
    !is_prod && console.log('%c 🐄 Fetchez la Vache !', console_pride_style)
}

/*
!is_prod && console.log( '%c 🤓 console.log: ', console_key_style, 'message/data' )
!is_prod && console.info( '%c 🤓 console.info: ', console_key_style, 'message/data' )
!is_prod && console.warn( '%c 🤓 console.warn: ', console_key_style, 'message/data' )
!is_prod && console.error( '%c 🤓 console.error: ', console_key_style, 'message/data' )
*/


const animate_CSS = (element, animation, prefix = 'animate__') =>  new Promise(( resolve, reject ) => {

    const animationName = `${prefix}${animation}`
    const node = document.querySelector(element)

    node.classList.add(`${prefix}animated`, animationName)

    function handleAnimationEnd(event) {
        event.stopPropagation()
        node.classList.remove(`${prefix}animated`, animationName)
        resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true})

})



// async containers/features that don't already have a "loading" class
// async functions must remove the class on completion
$('.web-feature').addClass('loading') // TODO: only add class to parent container?

const link_fixer = () => {

    let legacy_links = $('a[data-wf-loc]')
    let prod_url = 'https://www.northcreative.us'
    legacy_links.each(function( index ) {
        let path = $( this ).data('wf-loc')
        $( this ).attr("href", prod_url+path)
        //console.log( $( this ).data('wf-loc') )
    })

}

if ( window.innerWidth <= 480 ) { $('html').addClass('mobile') }
//console.log(window.innerWidth)

const post_sniff_data = async ( data ) => { 
    
	const url = 'https://api-proxy-five-omega.vercel.app/wfapi/db/create-visit'
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
            
            !is_prod && console.log( 'post_sniff_data response: ', response )
            return response.json() 
    
        })
        .then(( json ) => {
    
            // !is_prod && console.log('%c 🤓 Proxy test:', console_data_style, json)
        
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

const handle_sniff = () => {

    const loc = get_loc()
    const log_data = {
        "Name": "Tag: " + visitor_log.tag + ", Stamp: " + Date.now(),
        "Host": visitor_log.host,
        "Page": visitor_log.page,
        "Title": visitor_log.title,
        "Datetime": visitor_log.datetime,
        "Browser Tag": visitor_log.tag,
        "Location": loc
    }

    console.log('log data:\n', log_data )

    post_sniff_data( log_data )

}
!is_local && handle_sniff()



$( function() {

    link_fixer()

    // mobile menu trigger - TODO: refactor
    $('.royals-w-cheese .logo-map').click( function () {
        $('body').toggleClass('nav-open')
    })

    screen.orientation.addEventListener("change", () => {
        console.log( 'The orientation of the screen is: ', screen.orientation.type )
        if ( !navigator.xr && self.isMobile && screen.orientation && screen.orientation.lock ) {
            screen.orientation.lock( 'portrait-primary' )
        }
    })

})