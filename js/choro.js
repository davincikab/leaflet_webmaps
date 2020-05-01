// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
});

// Adding tile layer

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
   attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
   subdomains: 'abcd',
   maxZoom: 20,
   minZoom: 0
 });

 layer.addTo(myMap);
// Load in geojson data
var geoData = "/data/gunDeath.geojson";

fetch(geoData)
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        console.log(data);
        createChoropleth(data);
    });

// choropleth scales
// EmrId [#d3f2a3, #97e196, #6cc08b, #4c9b82, #217a79, #105965, #074050]
// Burg #ffc6c4,#f4a3a8,#e38191,#cc607d,#ad466c,#8b3058,#672044,
// OrYl #ecda9a,#efc47e,#f3ad6a,#f7945d,#f97b57,#f66356,#ee4d5a
// ["#ffffb2", "#b10026"], ['#006837',"#ffffb2"],
function createChoropleth(data){
    // Create a new choropleth layer
    geojson = L.choropleth(data, {

        // Define what  property in the features to use
        valueProperty: "NUMPOINTS",

        // Set color scale
        scale: ['#ffffff', '#ff0000'],

        // Number of breaks in step range
        steps: 9,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#ddd",
            weight: 0.2,
            fillOpacity: 0.7
        },

        // Binding a pop-up to each layer
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Zip Code: " + feature.properties.NAME + "<br>Death Count:<br>" +
                "$" + feature.properties.NUMPOINTS);
        }
    }).addTo(myMap);
}
