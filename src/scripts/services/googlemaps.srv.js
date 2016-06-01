angular.module('dumpster').service('GooglemapsSrv', function($rootScope, $q) {
    'use strict';

    var self = this;

    self.infoWindows    = {};

    /**
     * Reference to map node
     *
     * @returns {*}
     */
    self.getMapNode = function() {
        if (!self.mapNode) {
            self.mapNode = document.getElementById('map');
        }

        return self.mapNode;
    };


    /**
     * Initiates the map
     *
     * @param coords
     */
    self.initiateMap = function(pos) {
        self.map = new google.maps.Map(self.getMapNode(), {
            center: pos,
            zoom: 8
        });

        self.map.setCenter(pos);
        self.map.addListener('dragend', (function() {

            self.closeAllActiveWindows();

            var coords = {
                'lat': self.map.getCenter().lat(),
                'lng': self.map.getCenter().lng()
            };

            $rootScope.$broadcast('map_dragged', coords);
        }).bind(self));
    };


    /**
     * Initiates info popup
     *
     */
    self.createInfoWindow = function(data) {
        self.infoWindows[data.objectId] = new google.maps.InfoWindow({
            content: self.createInfoWindowContent(data),
            maxWidth: 200
        });

        self.infoWindows[data.objectId].active = false;
        self.infoWindows[data.objectId].addListener('closeclick', function(){
            $rootScope.$broadcast('hide_comments');
        });

        return self.infoWindows[data.objectId];
    };


    /**
     * Creates content for infoWindow
     *
     * @param data
     */
    self.createInfoWindowContent = function(data) {
        var contentString = '<h2 id="firstHeading" class="firstHeading">' + data.name + '</h2><h4 id="bodyContent">' + data.city + ', ' + data.address + '</h4>', d = document.createElement('div'), b = document.createElement('button');

        b.innerText = 'Comment';
        b.addEventListener('click', function() {
            self.infoWindows[data.objectId].close();
            $rootScope.$broadcast('comment_request', data);
        });

        d.innerHTML = contentString;
        d.appendChild(b);

        return d;
    };


    /**
     * Asks browser for location, resolves {lat, long} or rejects
     *
     * @returns {Promise}
     */
    self.askForLocation = function () {

        var deferred = $q.defer();

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                self.initiateMap(pos);
                deferred.resolve(pos);
            }, function () {
                deferred.reject(self.handleLocationError(true));
            });
        } else {
            // Browser doesn't support Geolocation
            deferred.reject(self.handleLocationError(false));
        }

        return deferred.promise;
    };


    /**
     * Error handler for browsers without/disabled geolocation
     *
     * @param browserHasGeolocation
     * @param infoWindow
     * @param pos
     */
    self.handleLocationError = function (browserHasGeolocation) {
        return browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.';
    };


    /**
     * Iterates the data array, creates pins
     *
     * @param data
     */
    self.addPinsAndDescriptions = function(data) {
        for(var i = 0; i < data.length; i++) {
            self.createMarker(data, i);
        }
    };


    /**
     * Creates markers
     *
     * @param data
     * @param i
     */
    self.createMarker = function(data, i) {
        self.createInfoWindow(data[i]);
        var marker = new google.maps.Marker({
            position: {
                'lat': data[i].geo.latitude,
                'lng': data[i].geo.longitude
            },
            map: self.map,
            title: data[i].name
        });

        marker.addListener('click', function () {
            $rootScope.$broadcast('filter_comments', data[i].objectId);
            self.openInfoWindow(data[i].objectId, marker);
        });
    };


    /**
     * Wrapper over google.maps.InfoWindow.open: makes only 1 infowindow is active at the moment
     *
     * @param id
     * @param marker
     */
    self.openInfoWindow = function(id, marker) {
        self.closeAllActiveWindows();
        self.infoWindows[id].open(self.map, marker);
        self.infoWindows[id].active = true;
    };


    /**
     * Closes all active infoWindows
     *
     */
    self.closeAllActiveWindows = function() {
        for(var i in self.infoWindows) {
            if (self.infoWindows[i].active === true) {
                self.infoWindows[i].close();
                self.infoWindows[i].active = false;
            }
        }
    };
});
