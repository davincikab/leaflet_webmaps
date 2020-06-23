// Creating map object
var myMap = L.map("map", {
    center: [-0.5819228863274696,40.13854980468751],
    zoom: 6
});

// Adding tile layer

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

layer.addTo(myMap);
var customIcon = new L.icon({
    iconUrl:'images/pin4.png'
});

var selectIcon = new L.icon({
    iconUrl:'images/pin2.png'
});

var listing = L.geoJson(null, {
    style:function(feature){

    },
    onEachFeature:function(feature, layer){
        layer.on('click',function(e){
            console.log(e);
            var layer = e.target;
            layer.setZIndexOffset(400);
            layer.setIcon(selectIcon);
        });
    },
    pointToLayer:function(geoJsonObj, latlng){
        return L.marker(latlng,{
            icon:customIcon,
            // riseOnHover:true
        });
    }
});


// Fetch the data
var dataUrl = 'data/proportionalSymbol.geojson';
fetch(dataUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        createListing(data);
        addListingToMap(data);
    });

function createListing(data){
    var listFrag = document.createDocumentFragment();

    // data.features.forEach(item => {
    //     var element = ""
    //     listFrag.appendChild(element);
    // });
}

function addListingToMap(data){
    listing.addData(data); 
    listing.addTo(myMap);

    myMap.fitBounds(listing.getBounds());
}

// Change from list view to block view
var blockButton = document.getElementById('block');
var listButton = document.getElementById('list');
var products = document.getElementsByClassName('products');

blockButton.onclick = function(e){
    console.log("Block");
    for (const product of products) {
        product.classList.add('col-md-6');
        product.classList.remove('col-md-12');
        product.classList.remove('d-flex');
        
    }
};

listButton.onclick = function(e){
    console.log("List");
    for (const product of products) {
        product.classList.remove('col-md-6');
        product.classList.add('col-md-12');
        product.classList.add('d-flex');
        
    }

    // update the listing size and description
};


/*  ===================== Filtering Section ===================================== */
// price Slider
var lowerPrice = document.getElementById('lower-price');
var highPrice = document.getElementById('high-price');
var slider = $("#ex2").slider({

})
.on('slide', function(e){
    var value = e.value;
    // update the price value
    lowerPrice.innerHTML = "$ " + value[0];
    highPrice.innerHTML = "$ " + value[1];

})
.on('slideStop', function (e) {
    // console.log(e.value);
    filterListingByPrice(e.value);
});


function filterListingByPrice(price){
    // filtet the listing

    // calls the createListing method

    // update the map

}


// Rating Filter
var ratingValue = document.getElementsByClassName('stars');

for (const rating of ratingValue) {
    rating.onclick = function(e){
        var value = this.getAttribute('data-rate');

        for (let index = 1; index <= value; index++) {
            const element = document.getElementById('rating-' + index);

            element.classList.add('active');
        }

        if (value < 5) {
            value = parseInt(value, 10) + 1;
            console.log(value);

            for (let index = value; index < 6; index++) {
                const element = document.getElementById('rating-' + index);

                element.classList.remove('active');
            }
        }
    };
};

function updateRating(e){
    
}

var menuToggle = document.getElementById('menu');
var setting = document.getElementById('setting');
menuToggle.addEventListener('click', function(e){
    toggleSetting();
});

function toggleSetting(){
    console.log('OPen');
    setting.classList.toggle('open');
}

var themes = document.getElementsByClassName('theme');

function changeTheme(){ 

}

function changeOrientation(){
    
}