var map = L.map('map', {
    zoom:7,
    maxZoom:18,
    center:[-0.9877,37.56454],
    // crs: L.CRS.EPSG4326
});

// Tile layer
var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0
});

layer.addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

var counties = L.geoJSON(null, {
    style: function (feature) {
        return {
            fillColor: '#C2C8CC',
            color: '#fff',
            weight: 0.7,
            fillOpacity: 0.5
        }
    }
});

counties.addTo(map);
// // Get data
$.getJSON('data/transition.geojson')
    .done(function (data) {
        counties.addData(data);
    }).fail(function (error) {
        console.log(error);
});

// GeoJSON layer
var pointLayer = L.geoJSON(null,{
    style:function(feature){
        return {
            fillColor:'#e6b332',
            color:'#e6b332',
            radius:setRadius(feature),
            fillOpacity:0.7,
            weight:0.8
        }
    },
    onEachFeature:function(feature, layer){
        let popupText = "<p>"+feature.properties.County+"</p>"
        layer.bindPopup(popupText);
    },
    pointToLayer:function(geojObj, latlng){
        return L.circleMarker(latlng,{});
    }
});

// Point Layer Radius Size
function setRadius(feature){
    // Normalize the values
    return parseFloat(feature.properties.sec_field_2)*20;
}

var legend = L.control({position:'bottomright'});
legend.onAdd = function creatLegend(map){
    let div = L.DomUtil.create('div', 'container legend');
    let values = [8,10,12,,14,16,18,20,24];

    div.innerHTML += "<h4 class='mb-5 text-white'>County GPI </h4>";
    values.forEach(function(value){
        div.innerHTML += "<div class='legend-info' style='height:" + value * 2 + "px; width:" +
            value * 2 + "px;'><small class='h4 mt-5'> "+value/20+" <small></div>";
        
    });

    console.log(div);
    return div;
}

legend.addTo(map);

// Output any program errors
fetch('data/proportionalSymbol.geojson')
   .then(response=> response.json())
   .then(data => {
       pointLayer.addData(data);
       console.log(data);
   })
   .catch(error=> console.log("Failed to load the data"));


