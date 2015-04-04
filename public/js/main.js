function renderMap () {
    // Provide your access token
    L.mapbox.accessToken = 'pk.eyJ1Ijoiam9oYW5la2hhZ2VyIiwiYSI6IjZpMzViYmMifQ.NVFdpe3nKGvs5zAjqbRH5A';
    // Create a map in the div #map
    var map = L.mapbox.map('map', 'johanekhager.ladia1f3').setView([59.33171, 18.04821], 15);

    L.mapbox.featureLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            coordinates: [
                18.04821,
                59.33171

            ]
        },
        properties: {
            title: 'Mozarteum',
            description: '',
            // one can customize markers by adding simplestyle properties
            // https://www.mapbox.com/guides/an-open-platform/#simplestyle
            'marker-size': 'small',
            'marker-color': '#000',
            'marker-symbol': 'restaurant'
        }
    }).addTo(map);
}

(function(window) {
    "use strict";

    var content;
    var $editEl = $('[contenteditable]');

    $.getJSON( '/data/content.json', function( data ) {
        content = data;
    });

    $('body').on('focus', '[contenteditable]', function() {
        var $el = $(this);
        $el.data('before', $el.html());
        return $el;
    }).on('blur', '[contenteditable]', function() {
        var $el = $(this);
        if ($el.data('before') !== $el.html()) {
            $el.data('before', $el.html());
            $el.trigger('change');
        }
        return $el;
    }).on('change', '[contenteditable]', function() {
        var newContent = {};

        $editEl.each(function() {
            var $el = $(this);
            var name = $el.data().name;
            var data = $el.text();
            var isList = $el.data().list;
            var index = $el.data().index;

            if(isList && typeof index !== 'undefined') {
                debugger
                index = parseInt($el.data().index, 10);
                content[isList][index][name] = data;
            } else if(isList) {
                data = [];
                $el.children().each(function() {
                    data.push($(this).text());
                });

                content[name] = data;
            } else {
                content[name] = data;
            }


        });
        var jqxhr = $.ajax({
          type: "POST",
          contentType : 'application/json',
          url: '/admin',
          data: JSON.stringify(content),
          headers: {
            'x-access-token': $('#x-access-token').val()
          }
        })
        .done(function(data) {
            //alert('Sparat');
            debugger
        })
        .error(function() {
            //alert('Något gick fel');
            debugger
        });
    });


    renderMap();

})(window);
