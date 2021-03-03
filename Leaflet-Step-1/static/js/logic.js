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
            return 10;

        case (mag <= 1):
            return 12;

        case ( mag <= 3):
            return 14;

        case ( mag <= 6):
            return 16;

        case ( mag < 8):
            return 20;

        case (mag >= 8):
            return 40;
    }
};



d3.json(geoUrl, function (data) {

    mag=[]
    for ( var i=0; data.length<i; i++){

        mag.push((data.features[i].properties.mag))
};


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
})



