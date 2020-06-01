function getColor(d) {
    return d > 5 ? 'red' :
        d > 4 ? '#E64A19' :
        d > 3 ? '#EF6C00' :
        d > 2 ? '#FFA000' :
        d > 1 ? '#FFF176' :
        '#81C784';
}

function createLegend() {
    // Set up the legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    return legend;
}

function createFeatures(earthquakeData, boundaryData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p><hr>Magnitude:<b>" + feature.properties.mag +
            "</b><hr>Tsunami:<b>" + feature.properties.tsunami + "</b>"
        )
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                color: "black",
                fillOpacity: 0.6,
                weight: 1,
                fillColor: getColor(feature.properties.mag),
            })
        },
        onEachFeature: onEachFeature
    });


    var boundaryStyle = {
        color: "orange",
        fillOpacity: 0,
        weight: 3
    };

    // Create a GeoJSON layer containing the features array on the boundaryData object
    const boundary = L.geoJSON(boundaryData, {
        style: boundaryStyle
    });

    // Sending our earthquakes and boundary layer to the createMap function
    createMap(earthquakes, boundary);
}

function createMap(earthquakes, boundary) {

    // Define streetmap, outdoormap and satellitemap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });


    const outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Satellite": satellitemap,
        "Outdoors": outdoormap,
        "Streets": streetmap
    };

    // Create overlay object to hold our overlay layer
    const overLayers = {
        "Earthquakes": earthquakes,
        "Fault Lines": boundary
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overLayers
    // Add the layer control to the map
    L.control.layers(baseMaps, overLayers, {
        collapsed: false
    }).addTo(myMap);

    createLegend().addTo(myMap)
}

// Store our API endpoint inside queryUrl
function buildUrl() {
    const
        domain = "earthquake.usgs.gov",
        endpoint = "/fdsnws/event/1/query",
        format = "geojson",
        starttime = "2020-05-23",
        endtime = "2020-05-31",
        maxLon = 180.0,
        minLon = -180.0,
        maxLat = 90.0,
        minLat = -90.0;

    return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
}

(async function() {
    const earthquakeURL = buildUrl();
    // const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
    const quakeData = await d3.json(earthquakeURL);
    const boundaryURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
    const boundaryData = await d3.json(boundaryURL);

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(quakeData.features, boundaryData.features);
})()