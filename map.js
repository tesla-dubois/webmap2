var map = L.map('map', {center: [39.981192, -75.155399], zoom: 11});
    	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="https://www.phila.gov/programs/lead-and-healthy-homes-program/">Philadelphai Open Data</a>',
			maxZoom: 17,
			minZoom: 9
		}).addTo(map);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        
        var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGR1Ym9pcyIsImEiOiJjbG83czN0aG8wN2ZoMnFxcHluYWdueTU4In0.gYvYsMVbWvNO8zCb4M14dA';
            
        var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
            streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
            
 var baseMaps = {
    "grayscale": grayscale,
    "streets": streets
};

var temple = L.marker([39.981192, -75.155399]);
var drexel = L.marker([39.957352834066796, -75.18939693143933]);
var penn = L.marker([39.95285548473699, -75.19309508637147]);

var universities = L.layerGroup([temple, drexel, penn]);
var universityLayer = {
    "Phily University": universities
};
        // Add you code here 


                // Create an Empty Popup
                var popup = L.popup();
                // Write function to set Properties of the Popup
                function onMapClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent("You clicked the map at " + e.latlng.toString())
                        .openOn(map);
                }

                // Listen for a click event on the Map element
                map.on('click', onMapClick);

                // Set style function that sets fill color property equal to blood lead
                function styleFunc(feature) {
                    return {
                        fillColor: setColorFunc(feature.properties.mortlty),
                        fillOpacity: 0.9,
                        weight: 1,
                        opacity: 1,
                        color: '#000000',
                        dashArray: '3'
                    };
                }

                function setColorFunc(density){
                    return density === "Better" ? '#36A4AB' :
                        density === "Worse" ? '#3B2D5B' :
                        density === "No Different" ? '#ffffff' :
                                        '#BFBCBB';
                };

                // Now we’ll use the onEachFeature option to add the listeners on our state layers:
                function onEachFeatureFunc(feature, layer){
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight
                    });
                    layer.bindPopup('Level of Cancer Mortality Relative to City: '+feature.properties.mortlty);
                }

                

                function highlightFeature(e){
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                // for different web browsers
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                }

                  // Define what happens on mouseout:
                  function resetHighlight(e) {
                    neighborhoodsLayer.resetStyle(e.target);
                }  


                // As an additional touch, let’s define a click listener that zooms to the state: 
                function zoomFeature(e){
                    console.log(e.target.getBounds());
                    map.fitBounds(e.target.getBounds().pad(1.5));
                }

                var cityLayer = null;

                $.getJSON("city.geojson", function(data) {
                    // add GeoJSON layer to the map once the file is loaded
                    cityLayer = L.geoJson(data, {
                        style: {
                            fillColor: '#808080',  // Gray fill color
                            color: '#FFFFFF',      // White border color
                            weight: 1,             // Border weight
                            opacity: 1,            // Border opacity
                            fillOpacity: 0.7       // Fill opacity
                        }
                    }).addTo(map);
                });
                


                // load GeoJSON from an external file
                var neighborhoodsLayer = null;
                $.getJSON("mort2.geojson",function(data){
                    // add GeoJSON layer to the map once the file is loaded
                    neighborhoodsLayer = L.geoJson(data, {
                        style: styleFunc,
                        onEachFeature: onEachFeatureFunc
                    }).addTo(map);

                    var overlayLayer = {
                        "Relative Cancer Mortality": neighborhoodsLayer
                };

                L.control.layers(baseMaps, overlayLayer).addTo(map);
                });

                
		// Create Leaflet Control Object for Legend
		var legend = L.control({position: 'bottomright'});
		
		// Function that runs when legend is added to map
		legend.onAdd = function (map) {
			// Create Div Element and Populate it with HTML
			var div = L.DomUtil.create('div', 'legend');		    
			div.innerHTML += '<b>Cancer Mortality Relative to City</b><br />';
			div.innerHTML += 'by neighborhood<br />';
			div.innerHTML += '<br>';
			div.innerHTML += '<i style="background: #36A4AB"></i><p>Better</p>';
			div.innerHTML += '<i style="background: #ffffff"></i><p>No Different</p>';
			div.innerHTML += '<i style="background: #3B2D5B"></i><p>Worse</p>';
			div.innerHTML += '<hr>';
			div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
			
			// Return the Legend div containing the HTML content
			return div;
		};
		
		// Add Legend to Map
		legend.addTo(map);

		// Add Scale Bar to Map
		L.control.scale({position: 'bottomleft'}).addTo(map);
        

