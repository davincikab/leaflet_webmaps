var content = document.getElementById('content');
var search = document.getElementById('search-control');
var searcActive = false;

// Creating map object
var myMap = L.map("map", {
    center: [ 0.671647859580566,35.945798679941127],
    zoom: 8
});

// Adding tile layer

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

var circleMarker = L.circleMarker([0,0],{
    radius:20,
    fillColor: '#F5F4F4',
    fillOpacity: 0.7,
    color:'#F5F4F4',
    weight:0.9
}).addTo(myMap);

function highLightLayer(e){
    var layer = e.target;

    circleMarker.setLatLng(layer.getLatLng());

    // update the side section
    updateSection(layer.feature.properties);

    if(content.classList.contains('expand')){

    }else{
        toggleDescriptionTab(content);
    }
    
}

var customLayerMarker = L.geoJson(null, {
    style:function(feature){
        return {
            fillColor: '#fff',
            fillOpacity: 0.95,
        };
       
    },
    onEachFeature:function(feature, layer){
        layer.on('click', highLightLayer)
    },
    pointToLayer:function(goeObj, latlng){
        return L.marker(latlng,{
            icon:new L.Icon({
                iconUrl:'images/pin.png',
                iconSize: [35, 35],
                iconAnchor: [17, 17],
                popupAnchor: [-3, -76],
            })
        });
    }
}).addTo(myMap);

layer.addTo(myMap);

// fetch the data layer
var dataUrl = 'data/proportionalSymbol.geojson';

fetch(dataUrl)
 .then(response => {
    return response.json();
 })
 .then(data=>{
     customLayerMarker.addData(data);

     console.log(data);
    // populate the data do the list
     createList(data.features);
 });

//  Update the description
var title = document.getElementById('title-text');
var description = document.getElementById('description');
var detailTitle = document.getElementById('detail-title');

function updateSection(properties){
   
    title.innerHTML = properties.County +" County, Kenya";
    detailTitle.innerHTML = properties.County + " County, Kenya";

    // Description of the title 
    

    // display the section



}

// Create a list of counties
var countyList = document.getElementById('list');
function createList(data){
    let counties = [];
    for (const county of data) {
        let el = `<li class="list-item" data-id="${county.properties.County}"><img src='images/pin.png'>${county.properties.County}</li>`;
        counties.push(el);
    }

    countyList.innerHTML += counties;

    listEventLister();
}

// List Event Listener
function listEventLister() {
    // List click handler
    var listItems = document.getElementsByClassName('list-item');
    
    for (const item of listItems) {

        item.addEventListener('click', function (e) {
            zoomToFeature(this.getAttribute('data-id'));
        });

    }
}

// collapse and expand the list
var expandButton = document.getElementById('toggle-list');
expandButton.addEventListener('click', expandList);

function expandList(e){
    this.classList.toggle('expand-toggle-list');
    countyList.classList.toggle('list-expand');
}

// Zoom To feature
function zoomToFeature(county){
    customLayerMarker.eachLayer(function(layer){

        if(layer.feature.properties.County == county){
            circleMarker.setLatLng(layer.getLatLng());
            updateSection(layer.feature.properties);

            toggleDescriptionTab(content);
        }

    });
}

// Add eventlistener
var backButtons = document.getElementsByClassName('arrow');
for(const backButton of backButtons){
    backButton.addEventListener('click', function (e) {
        let element = document.getElementById(this.getAttribute('data-parent'));
        toggleDescriptionTab(element);
    });
}


// toggle the descripton tab
function toggleDescriptionTab(element){   
    element.classList.toggle('expand');

    if (searcActive) {
        search.classList.toggle('expand');
        searcActive = false;
    }
    searcActive = element == search ? true : false;
}

// Search bar
var searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function (e) {
    toggleDescriptionTab(search);

});

// menu Section
var menuButton = document.getElementById('menu');
var navbar = document.getElementById('navbar');

menuButton.addEventListener('click', function(e){
    navbar.classList.toggle('navbar-expand');
});

// Close menu
var closeMenu = document.getElementById('close-menu');
closeMenu.addEventListener('click', function(e){
    navbar.classList.toggle('navbar-expand');
});

// Search