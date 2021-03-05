function createMap(tect, earthquake) {

    // Adding a tile layer (the background map image) to our map
    // We use the addTo method to add objects to our map
    outdoorsLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    })

    // create gray scale layer that one was for old computers and put class with style for background 
    grayLayer = L.tileLayer.grayscale('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 14,
        minZoom: 2,
    })
    //using google satlite layer
    satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    })

    baseLayer = {
        "Satellite": satelliteLayer,
        "Grayscale": grayLayer,
        "Outdoors": outdoorsLayer
    }
    overlayMap = {
        "Earthquake": earthquake,
        "Tectonic Plates": tect
    }

    // Creating map object
    // Creating our initial map object
    // We set the longitude, latitude, and the starting zoom level
    // This gets inserted into the div with an id of 'mapid'
    var myMap = L.map("mapid", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [outdoorsLayer, earthquake]
    });

    L.control.layers(baseLayer, overlayMap, {
        collapsed: false
    }).addTo(myMap)

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Depth</h4>";
        div.innerHTML += '<i style="background: green"></i><span>(-10)-10</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: brown"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: purple"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: red"></i><span>+90</span><br>';


        return div;
    };

    legend.addTo(myMap);


}

// earthquake json file for last 7 days 
geoUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// function for  using in style later put switch true because condition return true or false 
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
        case (mag <= 0):
            return 5;

        case (mag <= 1):
            return 7;

        case (mag <= 2):
            return 9;

        case (mag <= 3):
            return 12;

        case (mag < 4):
            return 14;

        case (mag >= 4):
            return 16;
    }
};


// using d3 lib to put the data in the function 
function createCircleMarker() {
    let circles = new L.FeatureGroup();
    d3.json(geoUrl, function (data) {
        // loop to know max and min magnitude 
        mag = []
        for (var i = 0; i < data.features.length; i++) {

            mag.push(data.features[i].properties.mag)
        }
        console.log(d3.max(mag))
        console.log(d3.min(mag))
        // using leaflet lib to get json data coordainates 
        L.geoJson(data, {
            // using key name  before function 
            pointToLayer: function (feature, latlng) {
                // to create circle marker 
                circle = L.circleMarker(latlng, {
                    // style for data 
                    radius: 8,
                    fillColor: geojsonMarkerColor(feature.geometry.coordinates[2]),
                    color: "white",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                    radius: geojsonMarkerRadius(feature.properties.mag)
                    // put tooltips once click on circles 
                }).bindPopup(`<h3> Location: ${feature.properties.place}</h3><br><h4>Magnitude: ${feature.properties.mag}</h4><br><h4>Depth Of Earthquake: ${feature.geometry.coordinates[2]}</h4>`)
                return circle;
            }
        }).addTo(circles);

    });
    console.log(circles);
    return circles;
}

platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

var mapStyle = {
    color: "yellow",
    fillOpacity: 0,
    weight: 3
};
function createTectonicMarker() {
    tectonic = new L.FeatureGroup();
    d3.json(platesUrl, function (tect) {
        console.log("plates", tect)

        L.geoJson(tect, { style: mapStyle }).addTo(tectonic)

    })
    return tectonic;
}

createMap(createTectonicMarker(), createCircleMarker())


