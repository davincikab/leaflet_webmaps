var map = L.map("map", {
    center: [-0.5741171505408661, 36.70326232910157],
    zoom: 10,
});

var geoData = 'data/contours.geojson';

var contours = L.geoJson(null,{
    style:function(feature){
        return {
            color: '#ff0000',
            weight: 0.6,
        }
        
    }
});

// contours.addTo(map);
fetch(geoData)
    .then(response => {
        return response.json();
    })
    .then(data => {
       contours.addData(data);

       createCountours(data.features);

    });


function createCountours(routes){
    routes.forEach( function(route, i){
        console.log();
        var coord = route.geometry.coordinates[0].map(route => route.reverse());
        // L.polyline(coord,{
        //     color: '#ff0000',
        //     weight: 0.6,
        //     snakingSpeed:200
        // }).addTo(map).snakeIn();

        L.motion.polyline(coord, {
            color: '#ff0000',
            weight: 0.6,
        }, {
            auto: true,
            duration: 20000,
            easing: L.Motion.Ease.linear
        }, {
            removeOnEnd: true,
            showMarker: true,
            icon: L.divIcon({ html: "<i class='fa fa-cog fa-2x' aria-hidden='true'></i>" })
        }).addTo(map);
    });

    // var coord = routes[10].geometry.coordinates[0].map(route => route.reverse());

  

    
}

