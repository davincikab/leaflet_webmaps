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

var dataUrl = 'data/proportionalSymbol.geojson';

fetch(dataUrl)
 .then(response => {
    return response.json();
 })
 .then(data=>{
     customLayerMarker.addData(data);

     
 });

var title = document.getElementById('title-text');
var description = document.getElementById('description');
var detailTitle = document.getElementById('detail-title');

function updateSection(properties){
   
    title.innerHTML = properties.County +" County, Kenya";
    detailTitle.innerHTML = properties.County + " County, Kenya";

    // Description of the title 
    

    // display the section



}

// toggle the descripton tab
var descriptionTab = document.getElementById('')
function toggleDescriptionTab(){

}