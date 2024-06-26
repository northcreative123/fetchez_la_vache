// DEPRECATED
const clients = [
    {
        "name": "Advanced Apathy",
        "industry": "Street Apparel",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530dd16f990d4ab9b010ee_Advanced%20Apathy.png",
        "vimeo_ids": [
            "729848380",
            "821025311",
            "621330630"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["729848380"]
        }
    },
    {
        "name": "Arcminute Marketing",
        "industry": "Marketing & Digital",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d43b60dc27403f9b568_Arcminute%20Marketing.png",
        "vimeo_ids": [
            "821026684",
            "821027195"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": false,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["821026684"]
        }
    },
    {
        "name": "Barrio",
        "industry": "Restaurant",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d34c2106e5208c220f4_Barrio.png",
        "vimeo_ids": [
            "821028098",
            "596210066"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["821028098"]
        }
    },
    {
        "name": "Clean Plates",
        "industry": "Food & Beverage",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d128cdea071c20ef9cb_Clean%20Plates.png",
        "vimeo_ids": [
            "821031409",
            "821031865",
            "821032106",
            "821031556",
            "821032354",
            "821029408",
            "821028992",
            "821029708",
            "821033014",
            "821029577",
            "821032225",
            "821031291",
            "821032850",
            "821032696",
            "821033125",
            "821032485"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": true,
            "home_industry": true,
            "featured_video": ["821031409"],
            "testimonial": {
                "contact": "Jon Teodoro",
                "snippet": "Next level...",
                "full_text": "Had a great experience working with North Creative. They arrived on-time, put out great quality work, and offered many creative insights throughout the process. I highly recommend them to anyone looking to take their social media video/content production to the next level."
            }
        }
    },
    {
        "name": "Community Health Focus",
        "industry": "Healthcare",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530dfe88c53a9febf7ea7c_Community%20Health%20Focus.png",
        "vimeo_ids": [
            "697539896",
            "697542303",
            "729848407"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["697539896"]
        }
    },
    {
        "name": "Corby Energy Services",
        "industry": "Construction",
        "logo_url": "",
        "vimeo_ids": [
            "903932770",
            "902105247"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": false,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["903932770"]
        }
    },
    {
        "name": "CSM Group",
        "industry": "Construction",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530df4e1ed7f5c00125d16_CSM%20Group.png",
        "vimeo_ids": [
            "821033999",
            "821034152"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["821033999"]
        }
    },
    {
        "name": "Finders Keepers",
        "industry": "Apparel & Fashion",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530de43b21b29f278262a8_Finders%20Keepers.png",
        "vimeo_ids": [
            "599286695"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["599286695"]
        }
    },
    {
        "name": "Fresh RX",
        "industry": "Healthcare",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530cfd1912a3815cc0afe1_Fresh%20RX.png",
        "vimeo_ids": [
            "599287014"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["599287014"]
        }
    },
    {
        "name": "George Law",
        "industry": "Legal",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d68dcff960a43fd528a_George%20Law.png",
        "vimeo_ids": [
            "599287816",
            "729859562"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["599287816"]
        }
    },
    {
        "name": "Hemp Pot",
        "industry": "Cannabis",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530ced3b21b2caca82570c_Hemp%20Pot.png",
        "vimeo_ids": [
            "740161804"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["740161804"]
        }
    },
    {
        "name": "Huck Finch",
        "industry": "Marketing & Digital",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530ca1dcff96530cfd4676_Huck%20Finch.png",
        "vimeo_ids": [
            "821054559",
            "821055401",
            "821054811",
            "821054385",
            "821055762",
            "821055586",
            "821054135",
            "821054999"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["821054559"]
        }
    },
    {
        "name": "IMPACT Digital Marketing",
        "industry": "Marketing & Digital",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c7ebf29155baf1fd9c7_IMPACT%20Digital%20Marketing.png",
        "vimeo_ids": [
            "735779950"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["735779950"]
        }
    },
    {
        "name": "Kiefer Foundation",
        "industry": "Community and Event",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530b71974c63484625b787_Kiefer%20Foundation.png",
        "vimeo_ids": [
            "599288369"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["599288369"]
        }
    },
    {
        "name": "Life Driving Academy",
        "industry": "Service",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d869577a113e142c1a0_Life%20Driving%20Academy.png",
        "vimeo_ids": [
            "704259393"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["704259393"]
        }
    },
    {
        "name": "Maple Dentistry",
        "industry": "Dental",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c69c7c9868f2790f348_Maple%20Dentistry.png",
        "vimeo_ids": [
            "821038890",
            "821039291",
            "821037046",
            "744072638",
            "821035976",
            "821039708",
            "744072306",
            "744072524",
            "821039058",
            "761457403",
            "762988755",
            "762988874",
            "821035410",
            "821040535",
            "821040350",
            "821036786",
            "821038670",
            "744072845",
            "767000259"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["821038890"]
        }
    },
    {
        "name": "Mondo",
        "industry": "Community & Event",
        "logo_url": "",
        "vimeo_ids": [],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": false,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": []
        }
    },
    {
        "name": "New Life Hope",
        "industry": "Church",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530da7676e6a30e08ef0c0_New%20Life%20Hope.png",
        "vimeo_ids": [
            "678810050"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["678810050"]
        }
    },
    {
        "name": "OWL Services",
        "industry": "Oil & Gas",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c553a337db7fd15c707_OWL%20Services.png",
        "vimeo_ids": [
            "821052007",
            "821052262",
            "821053397",
            "821052627",
            "821052840",
            "821053195",
            "821050626",
            "821051218",
            "821050408",
            "821049920",
            "821051460",
            "910659163",
            "886198901"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["821052007"]
        }
    },
    {
        "name": "PARC",
        "industry": "Community & Event",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c441912a3d188c0a51d_PARC.png",
        "vimeo_ids": [
            "714600217"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["714600217"]
        }
    },
    {
        "name": "Pizze e Vino",
        "industry": "Restaurant",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d7a8cdea04f950f01d2_Pizza%20e%20Vino.png",
        "vimeo_ids": [
            "707627782"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["707627782"]
        }
    },
    {
        "name": "Rapid Finance",
        "industry": "Finance",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d949c34570bcb0eb1b4_Rapid%20Finance.png",
        "vimeo_ids": [
            "599288439"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["599288439"]
        }
    },
    {
        "name": "Reel Health Network",
        "industry": "Healthcare",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c2fc7c986733290effa_Reel%20Health%20Network.png",
        "vimeo_ids": [
            "742362340",
            "742362761",
            "742363321",
            "742363855",
            "742364461",
            "742364878",
            "742365223",
            "742365595",
            "742365991",
            "742366561",
            "767108748",
            "767108818",
            "767108880",
            "767108936",
            "767108991",
            "767109044",
            "767109092",
            "767109112",
            "767109131",
            "767109154",
            "821045738",
            "821045934",
            "821046300",
            "821046460",
            "821046658",
            "821046815",
            "821046988",
            "821047388",
            "821047519",
            "822779510"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["742362340"]
        }
    },
    {
        "name": "RENSA",
        "industry": "Product",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c1ff473ee21d1d87762_RENSA.png",
        "vimeo_ids": [
            "751888268",
            "751919769",
            "738124147",
            "751941627"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["751888268"]
        }
    },
    {
        "name": "Rotary Club",
        "industry": "Community Service",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530b608cdea076f50ededd_Rotary%20Club.png",
        "vimeo_ids": [
            "823008084"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": true,
            "featured_video": ["823008084"]
        }
    },
    {
        "name": "Runner's High 5k",
        "industry": "Community & Event",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530c0eca5bd918bfb6701f_Runner%27s%20High.png",
        "vimeo_ids": [
            "599288626"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["599288626"]
        }
    },
    {
        "name": "Shades Optical",
        "industry": "Service",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530dc0676e6a42868ef215_Shades%20Optical.png",
        "vimeo_ids": [
            "690344140"
        ],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["690344140"]
        }
    },
    {
        "name": "Short's Brewing Company",
        "industry": "Food & Beverage",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/665ba2dd640aa259b366bd25_Short%27s%20Brewing%20Company.png",
        "vimeo_ids": [
            "597877691"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["597877691"]
        }
    },
    {
        "name": "Simon Xpress",
        "industry": "Gas Station",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/665ba25cdfaf844c2b9780e3_Simon%20Xpress.png",
        "vimeo_ids": [
            "919792575"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["919792575"]
        }
    },
    {
        "name": "Skymint",
        "industry": "Cannabis",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530bd2fbd92f3ce69d2ecc_Skymint.png",
        "vimeo_ids": [
            "729869112",
            "596913785",
            "715713134",
            "701787047",
            "729869093",
            "729863837"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": true,
            "home_industry": true,
            "featured_video": ["729869112"],
            "testimonial": {
                "contact": "Connor Jacobs",
                "snippet": "Incredibly organized...",
                "full_text": "I’ve worked with North Creative on several projects over the last 2 years. This group is incredibly organized and communicates through the entire project. Not to mention, they provide a top tier product at an affordable price!"
            }
        }
    },
    {
        "name": "SPARK Business Works",
        "industry": "Software",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530b8188c53a5adff7b37b_SPARK%20Business%20Works.png",
        "vimeo_ids": [
            "672973132",
            "674509776",
            "672973791",
            "672840759",
            "672974089",
            "684360384",
            "672973668",
            "674509616",
            "672973976",
            "684365932",
            "672840465",
            "674509709",
            "672840252"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": true,
            "home_industry": true,
            "featured_video": ["672973132"],
            "testimonial": {
                "contact": "Jillian Hufford",
                "snippet": "Great to work with!",
                "full_text": "They were professional, attentive, and great communicators! We were impressed with how well (and quickly) they got to know our brand and translated it into video for us. A few of the videos we use on a regular basis to send to potential new clients and employees."
            }
        }
    },
    {
        "name": "Sun and Snow",
        "industry": "Community & Event",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/64530d226f990defb3afef4f_Sun%20%26%20Snow.png",
        "vimeo_ids": [
            "659750225"
        ],
        "web_features": {
            "logo_marquee": true,
            "video_marquee": true,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": ["659750225"]
        }
    },
    {
        "name": "Verde Media",
        "industry": "",
        "logo_url": "https://uploads-ssl.webflow.com/63fbf496c1ef8e81a06600fe/645a3107fc955ec00deadccb_Verde%20Media.png",
        "vimeo_ids": [],
        "web_features": {
            "logo_marquee": false,
            "video_marquee": false,
            "home_testimonials": false,
            "home_industry": false,
            "featured_video": []
        }
    }
];

// 310/436
// TODO: get points from AirTable vs here!
// ALSO: https://gist.github.com/erichurst/7882666
const points = [
    {
        "lat": 42.462983,
        "lon": -96.321502
    },
    {
        "lat": 40.712597,
        "lon": -73.953098
    },
    {
        "lat": 41.921215,
        "lon": -87.701028
    },
    {
        "lat": 41.874935,
        "lon": -87.6516
    },
    {
        "lat": 33.849034,
        "lon": -118.147902
    },
    {
        "lat": 33.830006,
        "lon": -118.387124
    },
    {
        "lat": 34.059163,
        "lon": -118.306892
    },
    {
        "lat": 34.048041,
        "lon": -118.294177
    },
    {
        "lat": 33.889151,
        "lon": -118.402127
    },
    {
        "lat": 32.764971,
        "lon": -117.123146
    },
    {
        "lat": 34.139402,
        "lon": -118.128659
    },
    {
        "lat": 34.030755,
        "lon": -118.492101
    },
    {
        "lat": 34.065975,
        "lon": -118.238642
    },
    {
        "lat": 34.088474,
        "lon": -118.325526
    },
    {
        "lat": 34.028127,
        "lon": -118.28483
    },
    {
        "lat": 34.011312,
        "lon": -118.469762
    },
    {
        "lat": 34.173885,
        "lon": -118.346937
    },
    {
        "lat": 34.099912,
        "lon": -118.326912
    },
    {
        "lat": 34.099912,
        "lon": -118.326912
    },
    {
        "lat": 34.17731,
        "lon": -118.615704
    },
    {
        "lat": 34.013666,
        "lon": -118.49375
    },
    {
        "lat": 42.519204,
        "lon": -83.164362
    },
    {
        "lat": 33.634626,
        "lon": -117.874882
    },
    {
        "lat": 42.410694,
        "lon": -82.941265
    },
    {
        "lat": 41.902172,
        "lon": -87.683337
    },
    {
        "lat": 44.96669,
        "lon": -93.195072
    },
    {
        "lat": 40.700647,
        "lon": -73.889423
    },
    {
        "lat": 40.662688,
        "lon": -73.98674
    },
    {
        "lat": 40.001553,
        "lon": -75.298929
    },
    {
        "lat": 40.662688,
        "lon": -73.98674
    },
    {
        "lat": 40.72779,
        "lon": -73.947605
    },
    {
        "lat": 40.712597,
        "lon": -73.953098
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 40.531346,
        "lon": -74.219857
    },
    {
        "lat": 41.232466,
        "lon": -73.129873
    },
    {
        "lat": 40.543139,
        "lon": -74.358981
    },
    {
        "lat": 40.712597,
        "lon": -73.953098
    },
    {
        "lat": 40.531346,
        "lon": -74.219857
    },
    {
        "lat": 40.700647,
        "lon": -73.889423
    },
    {
        "lat": 40.701954,
        "lon": -73.942358
    },
    {
        "lat": 40.726402,
        "lon": -73.978635
    },
    {
        "lat": 40.74528,
        "lon": -74.032112
    },
    {
        "lat": 32.925765,
        "lon": -97.071545
    },
    {
        "lat": 40.680769,
        "lon": -73.949313
    },
    {
        "lat": 40.715777,
        "lon": -73.986207
    },
    {
        "lat": 40.551884,
        "lon": -74.147646
    },
    {
        "lat": 40.785828,
        "lon": -74.3291
    },
    {
        "lat": 40.663046,
        "lon": -73.954219
    },
    {
        "lat": 40.662688,
        "lon": -73.98674
    },
    {
        "lat": 41.867567,
        "lon": -87.617228
    },
    {
        "lat": 42.941231,
        "lon": -88.0495
    },
    {
        "lat": 36.432426,
        "lon": -86.81663
    },
    {
        "lat": 34.028887,
        "lon": -118.317183
    },
    {
        "lat": 41.801647,
        "lon": -87.596288
    },
    {
        "lat": 42.030355,
        "lon": -87.685549
    },
    {
        "lat": 41.885303,
        "lon": -87.622092
    },
    {
        "lat": 34.045421,
        "lon": -118.445873
    },
    {
        "lat": 41.921215,
        "lon": -87.701028
    },
    {
        "lat": 41.922714,
        "lon": -87.649578
    },
    {
        "lat": 41.676907,
        "lon": -87.977229
    },
    {
        "lat": 35.581316,
        "lon": -97.573674
    },
    {
        "lat": 34.009552,
        "lon": -118.346724
    },
    {
        "lat": 27.316509,
        "lon": -82.553534
    },
    {
        "lat": 37.866528,
        "lon": -122.258039
    },
    {
        "lat": 41.946961,
        "lon": -87.702548
    },
    {
        "lat": 34.1692,
        "lon": -118.372498
    },
    {
        "lat": 25.779391,
        "lon": -80.151566
    },
    {
        "lat": 26.067601,
        "lon": -80.222643
    },
    {
        "lat": 34.039378,
        "lon": -118.2663
    },
    {
        "lat": 26.087019,
        "lon": -80.152992
    },
    {
        "lat": 26.213579,
        "lon": -80.270272
    },
    {
        "lat": 34.052913,
        "lon": -118.26434
    },
    {
        "lat": 38.599987,
        "lon": -89.915474
    },
    {
        "lat": 25.783834,
        "lon": -80.23609
    },
    {
        "lat": 32.830657,
        "lon": -97.145158
    },
    {
        "lat": 33.090085,
        "lon": -96.740008
    },
    {
        "lat": 32.969699,
        "lon": -96.797334
    },
    {
        "lat": 32.873485,
        "lon": -96.747539
    },
    {
        "lat": 33.146665,
        "lon": -96.855767
    },
    {
        "lat": 32.880196,
        "lon": -96.651555
    },
    {
        "lat": 33.013546,
        "lon": -97.00016
    },
    {
        "lat": 26.663773,
        "lon": -80.151608
    },
    {
        "lat": 32.959873,
        "lon": -97.148433
    },
    {
        "lat": 32.943901,
        "lon": -96.452875
    },
    {
        "lat": 42.464424,
        "lon": -82.896175
    },
    {
        "lat": 29.734813,
        "lon": -95.416098
    },
    {
        "lat": 29.776093,
        "lon": -95.603037
    },
    {
        "lat": 29.620312,
        "lon": -95.605693
    },
    {
        "lat": 29.675339,
        "lon": -95.479372
    },
    {
        "lat": 34.139402,
        "lon": -118.128659
    },
    {
        "lat": 34.139402,
        "lon": -118.128659
    },
    {
        "lat": 32.637868,
        "lon": -117.058031
    },
    {
        "lat": 34.030578,
        "lon": -118.399613
    },
    {
        "lat": 34.085784,
        "lon": -118.206666
    },
    {
        "lat": 38.619054,
        "lon": -90.347697
    },
    {
        "lat": 33.82774,
        "lon": -118.17482
    },
    {
        "lat": 32.573755,
        "lon": -117.120872
    },
    {
        "lat": 32.737832,
        "lon": -117.09267
    },
    {
        "lat": 32.741501,
        "lon": -117.127948
    },
    {
        "lat": 32.764971,
        "lon": -117.123146
    },
    {
        "lat": 32.795508,
        "lon": -116.969747
    },
    {
        "lat": 34.05038,
        "lon": -118.211991
    },
    {
        "lat": 32.945791,
        "lon": -117.214366
    },
    {
        "lat": 32.741501,
        "lon": -117.127948
    },
    {
        "lat": 32.908466,
        "lon": -117.141393
    },
    {
        "lat": 33.102005,
        "lon": -117.080419
    },
    {
        "lat": 38.122869,
        "lon": -122.196863
    },
    {
        "lat": 33.254619,
        "lon": -117.283341
    },
    {
        "lat": 40.738299,
        "lon": -111.859547
    },
    {
        "lat": 32.806476,
        "lon": -117.168879
    },
    {
        "lat": 32.96692,
        "lon": -117.126158
    },
    {
        "lat": 32.861727,
        "lon": -117.171224
    },
    {
        "lat": 40.798452,
        "lon": -73.974413
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 37.758799,
        "lon": -122.485127
    },
    {
        "lat": 40.657253,
        "lon": -73.673718
    },
    {
        "lat": 40.663046,
        "lon": -73.954219
    },
    {
        "lat": 40.86894,
        "lon": -73.899995
    },
    {
        "lat": 40.726402,
        "lon": -73.978635
    },
    {
        "lat": 40.744647,
        "lon": -73.920203
    },
    {
        "lat": 40.745221,
        "lon": -73.978294
    },
    {
        "lat": 40.825288,
        "lon": -73.950045
    },
    {
        "lat": 33.241889,
        "lon": -111.725674
    },
    {
        "lat": 33.599739,
        "lon": -112.178276
    },
    {
        "lat": 33.610739,
        "lon": -111.891472
    },
    {
        "lat": 33.558659,
        "lon": -112.132418
    },
    {
        "lat": 40.701954,
        "lon": -73.942358
    },
    {
        "lat": 33.42744,
        "lon": -111.934004
    },
    {
        "lat": 33.37545,
        "lon": -111.63867
    },
    {
        "lat": 32.24672,
        "lon": -110.948658
    },
    {
        "lat": 40.738299,
        "lon": -111.859547
    },
    {
        "lat": 33.431905,
        "lon": -112.196998
    },
    {
        "lat": 33.443097,
        "lon": -112.128136
    },
    {
        "lat": 33.372975,
        "lon": -112.410829
    },
    {
        "lat": 33.3224,
        "lon": -111.635342
    },
    {
        "lat": 33.364638,
        "lon": -111.931604
    },
    {
        "lat": 29.490048,
        "lon": -98.397135
    },
    {
        "lat": 44.984577,
        "lon": -93.269097
    },
    {
        "lat": 29.749778,
        "lon": -95.345885
    },
    {
        "lat": 29.462006,
        "lon": -98.676785
    },
    {
        "lat": 36.233315,
        "lon": -115.29015
    },
    {
        "lat": 35.998585,
        "lon": -114.961711
    },
    {
        "lat": 41.760117,
        "lon": -81.060305
    },
    {
        "lat": 36.258916,
        "lon": -115.171797
    },
    {
        "lat": 36.140961,
        "lon": -115.281091
    },
    {
        "lat": 33.535277,
        "lon": -117.104791
    },
    {
        "lat": 37.773793,
        "lon": -122.278115
    },
    {
        "lat": 37.952452,
        "lon": -121.329655
    },
    {
        "lat": 38.990381,
        "lon": -94.678214
    },
    {
        "lat": 39.0059,
        "lon": -94.216384
    },
    {
        "lat": 38.911994,
        "lon": -94.351673
    },
    {
        "lat": 38.893764,
        "lon": -94.879975
    },
    {
        "lat": 30.43963,
        "lon": -97.594686
    },
    {
        "lat": 30.167103,
        "lon": -97.823978
    },
    {
        "lat": 30.17681,
        "lon": -97.72586
    },
    {
        "lat": 30.270569,
        "lon": -97.742589
    },
    {
        "lat": 30.560322,
        "lon": -97.546399
    },
    {
        "lat": 30.294331,
        "lon": -97.738516
    },
    {
        "lat": 30.543255,
        "lon": -97.645243
    },
    {
        "lat": 32.917126,
        "lon": -111.744208
    },
    {
        "lat": 30.270569,
        "lon": -97.742589
    },
    {
        "lat": 32.271329,
        "lon": -110.993712
    },
    {
        "lat": 29.712099,
        "lon": -95.480935
    },
    {
        "lat": 37.625086,
        "lon": -122.433593
    },
    {
        "lat": 37.306491,
        "lon": -122.08064
    },
    {
        "lat": 37.648104,
        "lon": -121.849965
    },
    {
        "lat": 37.758799,
        "lon": -122.485127
    },
    {
        "lat": 38.103234,
        "lon": -122.249096
    },
    {
        "lat": 37.814613,
        "lon": -121.990551
    },
    {
        "lat": 38.493966,
        "lon": -121.529188
    },
    {
        "lat": 37.785969,
        "lon": -122.437253
    },
    {
        "lat": 37.745916,
        "lon": -122.441473
    },
    {
        "lat": 37.879234,
        "lon": -122.266839
    },
    {
        "lat": 34.089848,
        "lon": -118.294661
    },
    {
        "lat": 37.625086,
        "lon": -122.433593
    },
    {
        "lat": 40.843267,
        "lon": -73.860417
    },
    {
        "lat": 41.775868,
        "lon": -87.711496
    },
    {
        "lat": 34.065975,
        "lon": -118.238642
    },
    {
        "lat": 34.080017,
        "lon": -118.262643
    },
    {
        "lat": 34.127607,
        "lon": -118.296387
    },
    {
        "lat": 33.794348,
        "lon": -118.116391
    },
    {
        "lat": 33.031561,
        "lon": -96.673164
    },
    {
        "lat": 26.02313,
        "lon": -80.186539
    },
    {
        "lat": 32.925765,
        "lon": -97.071545
    },
    {
        "lat": 41.707463,
        "lon": -72.538932
    },
    {
        "lat": 37.916555,
        "lon": -122.341233
    },
    {
        "lat": 34.160359,
        "lon": -118.213769
    },
    {
        "lat": 34.052913,
        "lon": -118.26434
    },
    {
        "lat": 25.777404,
        "lon": -80.172412
    },
    {
        "lat": 25.606126,
        "lon": -80.343496
    },
    {
        "lat": 41.548788,
        "lon": -72.994041
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 41.848897,
        "lon": -87.717661
    },
    {
        "lat": 37.326791,
        "lon": -121.916745
    },
    {
        "lat": 42.7539,
        "lon": -71.015935
    },
    {
        "lat": 40.663046,
        "lon": -73.954219
    },
    {
        "lat": 42.488769,
        "lon": -71.154438
    },
    {
        "lat": 42.379657,
        "lon": -71.061487
    },
    {
        "lat": 42.350518,
        "lon": -71.059077
    },
    {
        "lat": 43.654353,
        "lon": -70.297611
    },
    {
        "lat": 40.646448,
        "lon": -73.956649
    },
    {
        "lat": 39.004771,
        "lon": -77.102903
    },
    {
        "lat": 32.96692,
        "lon": -117.126158
    },
    {
        "lat": 42.369451,
        "lon": -71.177925
    },
    {
        "lat": 39.209967,
        "lon": -94.514665
    },
    {
        "lat": 30.543255,
        "lon": -97.645243
    },
    {
        "lat": 40.778971,
        "lon": -73.90625
    },
    {
        "lat": 42.336371,
        "lon": -71.850626
    },
    {
        "lat": 42.343499,
        "lon": -71.122243
    },
    {
        "lat": 41.664711,
        "lon": -71.015698
    },
    {
        "lat": 42.423839,
        "lon": -71.107673
    },
    {
        "lat": 32.817888,
        "lon": -117.031956
    },
    {
        "lat": 47.367737,
        "lon": -122.117029
    },
    {
        "lat": 47.945519,
        "lon": -122.231095
    },
    {
        "lat": 47.555647,
        "lon": -122.37959
    },
    {
        "lat": 40.64959,
        "lon": -73.934374
    },
    {
        "lat": 25.703032,
        "lon": -80.297375
    },
    {
        "lat": 47.659861,
        "lon": -122.284977
    },
    {
        "lat": 38.256783,
        "lon": -85.754048
    },
    {
        "lat": 29.545041,
        "lon": -95.350692
    },
    {
        "lat": 32.969699,
        "lon": -96.797334
    },
    {
        "lat": 36.179319,
        "lon": -86.731083
    },
    {
        "lat": 36.051294,
        "lon": -86.968798
    },
    {
        "lat": 36.149775,
        "lon": -86.789146
    },
    {
        "lat": 36.067234,
        "lon": -86.723711
    },
    {
        "lat": 36.149775,
        "lon": -86.789146
    },
    {
        "lat": 36.339969,
        "lon": -86.607922
    },
    {
        "lat": 35.855753,
        "lon": -78.707038
    },
    {
        "lat": 47.659861,
        "lon": -122.284977
    },
    {
        "lat": 36.162189,
        "lon": -86.670867
    },
    {
        "lat": 36.21658,
        "lon": -86.726854
    },
    {
        "lat": 35.999288,
        "lon": -86.785062
    },
    {
        "lat": 40.791763,
        "lon": -73.94397
    },
    {
        "lat": 40.945239,
        "lon": -73.992428
    },
    {
        "lat": 40.734012,
        "lon": -74.006746
    },
    {
        "lat": 40.798601,
        "lon": -73.966622
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 40.74756,
        "lon": -73.938942
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 40.730145,
        "lon": -73.82703
    },
    {
        "lat": 40.781428,
        "lon": -73.95001
    },
    {
        "lat": 40.599148,
        "lon": -73.99609
    },
    {
        "lat": 40.750877,
        "lon": -74.056865
    },
    {
        "lat": 40.791763,
        "lon": -73.94397
    },
    {
        "lat": 40.701954,
        "lon": -73.942358
    },
    {
        "lat": 40.70416,
        "lon": -73.921139
    },
    {
        "lat": 28.541774,
        "lon": -81.374351
    },
    {
        "lat": 40.723317,
        "lon": -73.704949
    },
    {
        "lat": 40.762211,
        "lon": -73.931528
    },
    {
        "lat": 40.700647,
        "lon": -73.889423
    },
    {
        "lat": 41.232466,
        "lon": -73.129873
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 40.700647,
        "lon": -73.889423
    },
    {
        "lat": 40.680769,
        "lon": -73.949313
    },
    {
        "lat": 40.599263,
        "lon": -74.165748
    },
    {
        "lat": 40.663046,
        "lon": -73.954219
    },
    {
        "lat": 40.643477,
        "lon": -73.976042
    },
    {
        "lat": 40.762211,
        "lon": -73.931528
    },
    {
        "lat": 40.715777,
        "lon": -73.986207
    },
    {
        "lat": 40.639413,
        "lon": -73.900664
    },
    {
        "lat": 40.898788,
        "lon": -73.90313
    },
    {
        "lat": 40.601293,
        "lon": -73.944493
    },
    {
        "lat": 40.69134,
        "lon": -73.927879
    },
    {
        "lat": 40.657708,
        "lon": -74.004377
    },
    {
        "lat": 40.80238,
        "lon": -73.952681
    },
    {
        "lat": 40.734924,
        "lon": -74.071875
    },
    {
        "lat": 40.6937,
        "lon": -73.989859
    },
    {
        "lat": 42.464424,
        "lon": -82.896175
    },
    {
        "lat": 41.539574,
        "lon": -74.057223
    },
    {
        "lat": 41.046823,
        "lon": -85.088361
    },
    {
        "lat": 39.715601,
        "lon": -86.320586
    },
    {
        "lat": 39.836957,
        "lon": -85.974537
    },
    {
        "lat": 39.898839,
        "lon": -86.05872
    },
    {
        "lat": 39.966704,
        "lon": -86.017173
    },
    {
        "lat": 41.740931,
        "lon": -86.126918
    },
    {
        "lat": 39.898614,
        "lon": -86.233341
    },
    {
        "lat": 39.898614,
        "lon": -86.233341
    },
    {
        "lat": 38.31313,
        "lon": -85.7686
    },
    {
        "lat": 38.151687,
        "lon": -85.517172
    },
    {
        "lat": 37.7616,
        "lon": -84.312523
    },
    {
        "lat": 38.271962,
        "lon": -85.799332
    },
    {
        "lat": 38.177589,
        "lon": -85.719409
    },
    {
        "lat": 38.239913,
        "lon": -85.721591
    },
    {
        "lat": 38.299974,
        "lon": -85.575689
    },
    {
        "lat": 38.256783,
        "lon": -85.754048
    },
    {
        "lat": 38.256783,
        "lon": -85.754048
    },
    {
        "lat": 42.683619,
        "lon": -82.909486
    },
    {
        "lat": 42.481899,
        "lon": -83.168088
    },
    {
        "lat": 42.519204,
        "lon": -83.164362
    },
    {
        "lat": 42.650226,
        "lon": -82.928905
    },
    {
        "lat": 42.731996,
        "lon": -84.554683
    },
    {
        "lat": 42.997596,
        "lon": -84.376341
    },
    {
        "lat": 42.292497,
        "lon": -85.63146
    },
    {
        "lat": 42.497902,
        "lon": -83.185859
    },
    {
        "lat": 42.226439,
        "lon": -85.775518
    },
    {
        "lat": 42.738361,
        "lon": -84.524017
    },
    {
        "lat": 42.875093,
        "lon": -85.619304
    },
    {
        "lat": 42.520357,
        "lon": -83.264824
    },
    {
        "lat": 39.957342,
        "lon": -82.962019
    },
    {
        "lat": 41.658372,
        "lon": -83.408909
    },
    {
        "lat": 41.650277,
        "lon": -83.673822
    },
    {
        "lat": 39.99083,
        "lon": -82.999946
    },
    {
        "lat": 39.818854,
        "lon": -83.990896
    },
    {
        "lat": 38.806931,
        "lon": -82.694911
    },
    {
        "lat": 38.806931,
        "lon": -82.694911
    },
    {
        "lat": 40.097462,
        "lon": -83.150204
    },
    {
        "lat": 39.920952,
        "lon": -82.870492
    },
    {
        "lat": 39.629338,
        "lon": -84.275969
    },
    {
        "lat": 40.297786,
        "lon": -83.060181
    },
    {
        "lat": 40.011814,
        "lon": -82.97053
    }
];