var colorSection = document.getElementById('color-picker');
// Creating map object
var myMap = L.map("map", {
    center: [38.70265930723801, -96.50390625000001],
    zoom: 5
});

// Adding tile layer

var layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
   attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
   subdomains: 'abcd',
   maxZoom: 20,
   minZoom: 0
 });

layer.addTo(myMap);
var colorSchemes = {
    scheme1: ['#ecda9a', '#efc47e' , '#f3ad6a' , '#f7945d', '#f97b57', '#f66356', '#ee4d5a'],
    scheme2:['#ffc6c4', '#f4a3a8', '#e38191', '#cc607d', '#ad466c', '#8b3058', '#672044'],
    scheme3:['#d3f2a3', '#97e196', '#6cc08b', '#4c9b82', '#217a79', '#105965', '#074050'],
    scheme4:['#fcde9c', '#faa476', '#f0746e', '#e34f6f', '#dc3977', '#b9257a', '#7c1d6f'],
    scheme5:['#d1eeea', '#a8dbd9', '#85c4c9', '#68abb8', '#4f90a6', '#3b738f', '#2a5674'],
    scheme6:['#fef6b5', '#ffdd9a', '#ffc285', '#ffa679', '#fa8a76', '#f16d7a', '#e15383'],
    scheme7:['#b0f2bc', '#89e8ac', '#67dba5', '#4cc8a3', '#38b2a3', '#2c98a0', '#257d98']
};

// Load in geojson data
var geoData = "./data/gunDeath.geojson";

fetch(geoData)
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        console.log(data);
        createChoropleth(data);
    });

// choropleth scales
// EmrId['#d3f2a3, '#97e196, '#6cc08b, '#4c9b82, '#217a79, '#105965, '#074050]
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
        steps: 7,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#ddd",
            weight: 0.5,
            fillOpacity: 0.7
        },

        // Binding a pop-up to each layer
        onEachFeature: function (feature, layer) {
            var popupContent;
            layer.on('click', e =>{
                myMap.closePopup();
                let fillColor = layer.options.fillColor;

                popupContent = "<div style='background-color:" + fillColor + ";' class='text-center text-white py-1 h6 header'>"
                        + feature.properties.NAME+
                        "</div><div class='text-center pb-2'> <h5>"+ feature.properties.NUMPOINTS +"</h5>Gun Deaths" +
                        "</div>";

                layer.bindPopup(popupContent).openPopup();
            });

            
        }
    }).addTo(myMap);

    console.log(geojson);
}


// click handler
var previousScheme;
var colorChoices = document.getElementsByClassName('color-section');
for (const colorScheme of colorChoices) {
    colorScheme.addEventListener('click', function(e){
        
        if(previousScheme){
            previousScheme.classList.remove('active-color');
        }

        let id = this.getAttribute('id');
        let color = colorSchemes[id];
        changeMapColor(color);

        previousScheme = document.getElementById(id);

        this.classList.toggle('active-color');


        // Update the backgroundColor
        colorSection.style.backgroundImage = "linear-gradient(45deg, "+color+")";
    });
}


function changeMapColor(colors){
    let limits = geojson.options.limits;

    geojson.eachLayer((layer) => {
        layer.setStyle({'fillColor':getFillColor(layer.feature,limits, colors)});
    });

   
}

function getFillColor(feature, limits, colors){
    let value = feature.properties.NUMPOINTS;

    let limit = limits.find((lim,i) => {
        if(value <= lim){
            return lim;
        }
    });

   
    let limitIndex = limits.indexOf(limit);
    fillColor = colors[limitIndex];

    return fillColor;
}


// Change Opacity
var opacityElement = document.getElementById('opacity-level');
opacityElement.addEventListener('change', function(e){

    let value = e.srcElement.value;

    geojson.eachLayer(layer => {
        layer.setStyle({
            'fillOpacity':value
        });
    });
});

// change the number of classes


class ColorPicker{
    constructor(){

    }

    // getter and setters
}