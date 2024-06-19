const body = document.body;

function playVideos(e) {

    // when in mini mode, check & remove previous wrapper
    const old_wrapper = document.getElementById("lvideo-wrap");
    old_wrapper && old_wrapper.parentNode.removeChild(old_wrapper);

    lvideo(e.currentTarget.dataset.url);
    body.classList.add("lvideo-active");

    let lvideoWrap = document.createElement("DIV");
    lvideoWrap.setAttribute("id", "lvideo-wrap");
    document.body.appendChild(lvideoWrap);

    const wrapper = document.getElementById("lvideo-wrap");

    let mini_mode = localStorage.getItem('mini_mode') === 'true';
    mini_mode && wrapper.classList.add("mini");
    wrapper.classList.add("active");

    const url = this.dataset.url;
    const vimeo_id = e.currentTarget.dataset.vimeoid;
    const client = this.dataset.client;
    const startModal = `<span onclick="lvideoClose();" class="lvideo-overlay"></span> <div class="lvideo-container"><button onclick="lvideoListToggle();" class="lvideo-list"><i class="fa-regular fa-folder-open" data-icon="f07c"></i></button>`;
    const finishModal = `</div><button onclick="lvideoMode();" class="lvideo-mode"><i class="fa-solid fa-arrow-right" data-icon="f061"></i></button><button onclick="lvideoClose();" class="lvideo-close"><i class="fa-solid fa-xmark" data-icon="f00d"></i></button><h3>${client}</h3>`;

    // if (url.indexOf("youtube") !== -1) {
    if (url.indexOf("youtube") !== -1 || url.indexOf("youtu") !== -1) {
        //console.log("is youtube")
        const ytUrl = [this.dataset.url];
        let i, r, regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

        for (i = 0; i < ytUrl.length; ++i) {
            r = ytUrl[i].match(regExp);
            document.getElementById("lvideo-wrap").innerHTML = `${startModal}<iframe width="560" height="315" title="YouTube Video" src='https://www.youtube.com/embed/${r[1]}?rel=0&autoplay=1&mute=1&loop=1&playlist=${r[1]}' frameborder="0" allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>${finishModal}`;
        }
    } else if (url.indexOf("vimeo") !== -1) {
        // console.log("is Vimeo")
        const vimeoURL = this.dataset.url;
        const regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
        const match = vimeoURL.match(regExp);

        if (match) {
            document.getElementById("lvideo-wrap").innerHTML = `${startModal}<iframe title="Vimeo" src="https://player.vimeo.com/video/${match[2]}?autoplay=1&loop=1" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>${finishModal}`;
        } else {
            alert("Not a Vimeo!  URL example:\n https://vimeo.com/120206922");
        }

    } else if (url.indexOf("mp4") !== -1 || url.indexOf("m4v") !== -1) {
        document.getElementById("lvideo-wrap").innerHTML = `${startModal}<video controls loop playsinline autoplay><source src='${this.dataset.url}' type="video/mp4"></video>${finishModal}`;
    } else {
        alert("No video link found.");
    }
    lvideoList();
}
//document.querySelectorAll(".play-inline").forEach((d) => d.addEventListener("click", playVideos));

// CLOSE MODAL LVIDEO
const lvideoClose = () => {
    body.classList.remove("lvideo-active");
    const wrapper = document.getElementById("lvideo-wrap");
    wrapper.parentNode.removeChild(wrapper);
}

// TOGGLE MIDI MODE
const lvideoMode = () => {
    const wrapper = document.getElementById("lvideo-wrap");
    let mini_mode = localStorage.getItem('mini_mode') === 'true';
    if ( mini_mode ) {
        localStorage.setItem('mini_mode', false);
        wrapper.classList.remove("mini");
    } else {
        localStorage.setItem('mini_mode', true);
        wrapper.classList.add("mini");
    }
    
}

// GET ALL VIDEOS LIST
const lvideoList = ( id ) => {
    const wrapper = document.getElementById("lvideo-wrap");
    //console.log( 'current ID: ' + id );
    let videoSelect = document.createElement("select");
    videoSelect.classList.add("video-select");
    videoSelect.setAttribute("id", "lvideo-list");
    clients.forEach( function( client_data ) { 
        if ( client_data.vimeo_ids.length > 0 ) {
            let client_group = document.createElement("optgroup");
            client_group.setAttribute("label", client_data.name);
            client_data.vimeo_ids.forEach( function( vimeo_id, index ) {
                let client_video = document.createElement("option");
                client_video.setAttribute("value", vimeo_id);
                client_video.textContent = index + ": " + vimeo_id; 
                client_group.appendChild(client_video);
            });
            videoSelect.appendChild(client_group);
        }
    });
    //videoSelect.setAttribute("value", id);
    wrapper.appendChild(videoSelect);
}

// TOGGLE LIST VISIBILITY
const lvideoListToggle = () => {
    const video_list = document.getElementById("lvideo-list");
    video_list.classList.toggle("active");
}

/*
const clients = [
    {
        "name": "Advanced Apathy",
        "industry": "Street Apparel",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530dd16f990d4ab9b010ee_Advanced%20Apathy.png",
        "vimeo_ids": [
            "729848380",
            "821025311",
            "621330630"
        ]
    }
]

<label for="cars">Choose a car:</label>
<select name="cars" id="cars">
  <optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
  </optgroup>
  <optgroup label="German Cars">
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </optgroup>
</select>
*/

// LAUNCH
function lvideo() { }