
    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topograph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street View": streetMap,
        "Topographic View": topograph
    };

    let earthquakes = new L.LayerGroup();

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [51.0054907, -109.723717],
        zoom: 4,
        layers: [streetMap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    
    

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryURL).then(function (data) {
    
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }


    function chooseColor(mag) {
        if (mag > 5) {
            return "red";
        }
        if (mag > 4) {
            return "orangered";
        }
        if (mag > 3) {
            return "orange";
        }
        if (mag > 2) {
            return "gold";
        }
        if (mag > 1) {
            return "yellow";
        }
        return "lightgreen"
    }

    function getRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: styleInfo,
    
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag} Location: ${feature.properties.place}</h3> <hr> <p>${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);

    let legend = L.control({
        position: "bottomright"
    });
    
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");

        const depth = [-10, 10, 30, 50, 70, 90];
        const colors = ["lightgreen", "yellow", "gold", "orange", "orangered", "red"];

    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            `<i style='background: ` + colors[i] + `'></i> ` + depth[i] + (depth[i + 1] ? `&ndash;` + depth[i + 1] + `<br>` : `+`);
    }
    return div;
    };
    
    legend.addTo(myMap);
});