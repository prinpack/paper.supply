var thisId,
	areas,
	startCoords,
	map,
	pageId,
	zoomLevel,
	areaId,
	globalBounds;

var newJson = {};
var areaNames = [];
var markers = [];

function init(areas, startCoords) {
    var areaId = 0;

    for (area in areas) {
        areaNames.push(area)
        area = area.split("_");

        if (areaId < area[1])
            areaId = (parseInt(area[1]) + 1);

        else
            areaId++;
    }
    var myLatLng = new google.maps.LatLng(startCoords[0], startCoords[1]);
    globalBounds = new google.maps.LatLngBounds();
    var myOptions = {
        zoom: zoomLevel,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var coords = [];

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	drawOldAreas(areas, map);
    
	map.fitBounds(globalBounds);
	var blistener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
		this.setZoom(zoomLevel);
		google.maps.event.removeListener(blistener);
	});
	//map.panToBounds(bounds);
}


function drawCoords(coords, id, area, name, fillColor) {
	areas[id][1] = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < coords.length; i++) {

    	globalBounds.extend(coords[i]);

        var repeats = 0;
        var tempArr = [];
        bounds.extend(coords[i]);
        for (x in coords[i]) {
            tempArr.push(coords[i][x]);
            if (repeats > 0) {
                repeats = 0;
                break;
            }
            repeats++;
        }
        areas[id][1].push(tempArr.toString());
    }

    var find = '/';
    var re = new RegExp(find, 'g');

    var infowindow = new google.maps.InfoWindow({
        content: "<div style='width: 140px; height: auto;'>" + area.replace(re, '<br />') + "</div>",
    });

    var marker = new google.maps.Marker({
        position: bounds.getCenter(),
        map: map,
        icon: {
        	url: '/UI/styles/graphics/maps/sales.png'
        }
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
        });

        google.maps.event.addListener(marker, 'click', function () {
            window.location = name;
        });

    newJson[thisId] = areas;
}

function setSelection(event) {
    window.location = this.name;
}

function drawOldAreas(areas, map) {
   
    for (var i = 0; i < areaNames.length; i++) {
        var coords_old = [];
       
        for (var k = 0; k < areas[areaNames[i]][1].length; k++) {
            
            var area = areas[areaNames[i]][1][k].split(",");
            coords_old.push(new google.maps.LatLng(area[0], area[1]));
        }
        object = new google.maps.Polygon({
            id: areaNames[i],
            area: areas[areaNames[i]][0][0],
            name: areas[areaNames[i]][0][1],
            paths: coords_old,
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: areas[areaNames[i]][2][0],
            fillOpacity: 0.45,
            editable: false
        });

        //object.setMap(map);
        drawCoords(coords_old, object.id, object.area, object.name, "");

        //google.maps.event.addListener(object, 'click', setSelection);
        //google.maps.event.addListener(object, "mouseover", setOver);

        
    }
    $.getScript('/UI/scripts/libs/markerclusterer_packed.js', function (data, textStatus) {
    	var mcStyles = [{
    			url: '/UI/styles/graphics/maps/cluster1.png',
    			height: 53,
    			width: 53,
    			textColor: '#ffffff'
    		},
		    {
		    	url: '/UI/styles/graphics/maps/cluster2.png',
		    	height: 56,
		    	width: 56,
				textColor: '#ffffff'
		    },
		    {
		    	url: '/UI/styles/graphics/maps/cluster3.png',
		    	height: 66,
		    	width: 66,
		    	textColor: '#ffffff'
		    }];
	    
    	var mcOptions = {
    		gridSize: 50,
    		maxZoom: 11,
    		styles: mcStyles
    	};
    	var mc = new MarkerClusterer(map, markers, mcOptions);
    });
}

function getMaps(id) {
    $.ajax({
        dataType: 'json',
        url: "/GoogleMaps/Files/areas.js",
        cache: false,
        success: function (json) {
            thisId = id;
            if (json[thisId] != undefined || json[thisId] != null) {
	           
                areas = json[thisId];
                startCoords = json.settings[thisId][0];
                zoomLevel = json.settings[thisId][1];
            }
            else {
                startCoords = [60, 14];
                areas = new Object();
                zoomLevel = 6;
            }
           
            init(areas, startCoords);
        }, error: function (data) {

        }
    });
}

$(function () {
    pageId = $("#mapId").val();
    getMaps(pageId)
});