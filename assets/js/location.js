
/* ****************************************
 * [ USER IP SNIFF ]
 *
 * ***************************************/

const getUserLocation = async ( ip ) => {

    // http://ip-api.com/json/24.127.12.129
    // ipinfo.io/24.127.12.129?token=d094b46883a2e4

    const response = await fetch('https://ipinfo.io/' + ip + '?token=d9e7dd4ebf804b')
    .then(( response ) => { return response.json() })
    .then(( json ) => {

        const data = json
        localStorage.setItem('location', JSON.stringify(json))
        !is_prod && console.log('Location data: ', data)
        !is_prod && console.log('Lat/Lon: ' + data.loc)

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
            !is_prod && console.warn( '%c 🙊 IP Address: ', console_revisit_style, ip )
            const city = getUserLocation( ip )

            return city

        })
        .catch((err) => { return `Error getting IP Address: ${err}` })

    } catch (error) {
        //console.error('Error getting user location:', error)
        console.error( '%c ☠️ Error getting user location:\n ', console_error_style, error )
    }

}

$( function() {
    // user IP sniff - TODO: REMOVE (or detail in privacy/terms)
    getUserIP()
})
