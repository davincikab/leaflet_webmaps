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
            fillColor: styleCounties(feature),
            color: '#ddd',
            weight: 0.5,
            fillOpacity: 0.90
        }
    }
});


function styleCounties(feature){
    let value = feature.properties.sec_fiel_2;
    // #fcde9c, #faa476, #f0746e, #e34f6f, #dc3977, #b9257a, #7c1d6f
    return value <= 0.4 ? '#fcde9c' : value <= 0.5 ? '#faa476' : value <= 0.6 ? '#f0746e' : value <= 0.7 ? '#e34f6f' :
        value <= 0.8 ? '#dc3977' : value <= 0.9 ? ' #b9257a' : value <= 1.0 ? '#7c1d6f' : '#7c1d6f';

    // #d3f2a3, #97e196, #6cc08b, #4c9b82, #217a79, #105965, #074050
    return value <= 0.4 ? '#d3f2a3' : value <= 0.5 ? '#97e196' : value <= 0.6 ? '#6cc08b' : value <= 0.7 ? '#4c9b82' :
        value <= 0.8 ? '#217a79' : value <= 0.9 ? '#105965' : value <= 1.0 ? '#074050' :'#074050';

    // '#ecda9a', '#efc47e', '#f3ad6a', '#f7945d', '#f97b57', '#f66356', '#ee4d5a'
    // return value <= 0.4 ? '#ecda9a' : value <= 0.6 ? '#f3ad6a' : value <= 0.8 ? '#f7945d' : value <= 1.0 ? '#f66356' : '#ee4d5a';
}

counties.addTo(map);
// // Get data
$.getJSON('data/transition.geojson')
    .done(function (data) {
        counties.addData(data);
        counties.bringToBack();
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

pointLayer.addTo(map);
// Point Layer Radius Size
function setRadius(feature){
    // Normalize the values
    return parseFloat(feature.properties.sec_field_2)*20;
}

var legend = L.control({position:'bottomright'});
legend.onAdd = function creatLegend(map){
    let div = L.DomUtil.create('div', 'container legend');
    let values = [8,10,12,14,16,18,20,24];

    div.innerHTML += "<h4 class='mb-5 text-white'>County GPI </h4>";
    values.forEach(function(value, i){
        let size = value * 2;

        div.innerHTML += "<div class='legend-container'><div class='legend-info' style='height:" + size+ "px; width:" +
            size+ "px;'></div><span style='margin-left:"+ 48/value+"px;'>" + value / 20 +"</span></div>";
        
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

// zoom event listeners
map.on('zoomend', function(e){
    let zoom = map.getZoom();
    if(zoom < 7){
        map.removeLayer(pointLayer);
    }else{
        map.hasLayer(pointLayer)?'':map.addLayer(pointLayer);
    }
});
