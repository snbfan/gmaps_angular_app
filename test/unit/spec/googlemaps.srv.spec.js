'use strict';
describe('Tests for googlemaps.srv.js : ', function () {

    var rootScope, q, GooglemapsSrv, google = GooglemapsStub();

    beforeEach(function () {
        module('dumpster', [bsLoadingOverlayStub]);
        inject(function ($q, $rootScope, _GooglemapsSrv_) {
            q = $q;
            rootScope = $rootScope;
            GooglemapsSrv = _GooglemapsSrv_;
        });
    });

    describe('when service instantiates', function() {
        it('should initially set some scope values', function () {

        });
    });

    describe('getMapNode() method', function() {
        it('should call getElementById if self.mapNode is undefined', function () {

        });

        it('return object', function() {

        });
    });

    describe('initiateMap() method', function() {
        it('should call Map()', function () {

        });

        it('should call setCenter()', function () {

        });

        it('should call addListener()', function () {

        });
    });

    describe('createInfoWindow() method', function() {
        it('should call InfoWindow()', function () {

        });

        it('should call addListener()', function () {

        });

        it('should increment self.infoWindows array', function () {

        });
    });

    describe('createInfoWindowContent() method', function() {
        it('should return html NODE', function () {

        });
    });

    describe('askForLocation() method', function() {
        it('should call initiateMap()', function () {

        });

        it('should return Promise',function(){

        });
    });

    describe('handleLocationError() method', function() {
        it('should give correct response depending on param', function () {

        });
    });

    describe('addPinsAndDescriptions() method', function() {
        it('should call createMarker()', function () {

        });
    });

    describe('createMarker() method', function() {
        it('should call createInfoWindow()', function () {

        });

        it('should call google.maps.Marker()', function () {

        });

        it('should call addListener()', function () {

        });
    });

    describe('openInfoWindow() method', function() {
        it('should call closeAllActiveWindows()', function () {

        });

        it('should call open() on infoWindow object', function () {

        });

        it('should set active property to true on infoWindow object', function () {

        });
    });

    describe('closeAllActiveWindows() method', function() {
        it('should call close() method on infoWindow object', function () {

        });

        it('should set active to false on infoWindow object if it was true', function () {

        });
    });
});
