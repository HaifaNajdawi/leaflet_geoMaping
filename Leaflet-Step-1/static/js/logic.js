// Creating map object
// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("mapid", {
    center: [37.0902, -95.7129],
    zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

geoUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function geojsonMarkerColor(depth) {

    switch (true) {
        case (depth < 10):
            return "green";

        case (depth >= 10 && depth < 30):
            return "yellow";

        case (depth >= 30 && depth < 50):
            return "orange";

        case (depth >= 50 && depth < 70):
            return "brown";

        case (depth >= 70 && depth < 90):
            return "purple";

        case (depth >= 90):
            return "red";
    }
};
function geojsonMarkerRadius(mag) {
    switch (true) {
        case (mag <= 0 ):
            return 5;

        case (mag <= 1):
            return 7;

        case ( mag <= 2):
            return 9;

        case ( mag <= 3):
            return 12;

        case ( mag < 4):
            return 14;

        case (mag >= 4):
            return 16;
    }
};



d3.json(geoUrl, function (data) {

    mag=[]
    for ( var i=0;i< data.features.length; i++){

        mag.push(data.features[i].properties.mag)
}
console.log(d3.max(mag))
console.log(d3.min(mag))

    L.geoJson(data, {
        
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: geojsonMarkerColor(feature.geometry.coordinates[2]),
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                radius: geojsonMarkerRadius(feature.properties.mag)
            }).bindPopup(`<h3> Location: ${feature.properties.place}</h3><br><h4>Magnitude: ${feature.properties.mag}</h4><br><h4>Depth Of Earthquake: ${feature.geometry.coordinates[2]}</h4>`)
        }


    }).addTo(myMap)
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: green"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: brown"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: purple"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>+90</span><br>';

    div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
    
    

    return div;
    };

    legend.addTo(map);

})



