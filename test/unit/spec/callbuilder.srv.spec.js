'use strict';
describe('Tests for callbuilder.srv.js : ', function () {

    var CURL_STUB = {
        // template for getting object around pos
        'radius': 'where={ "geo": { "$nearSphere": {"__type": "GeoPoint", "latitude": %lat%, "longitude": %lng% }, "$maxDistanceInKilometers": 2.0 } }',
        // template for retrieving reviews for dumpster with given id
        'review': 'where={"location":{"__type":"Pointer","className":"location","objectId":"%objectId%"}}',
        // template for leaving comments for dumpster location
        'comment': '{"comment":"%comment%","location":{"__type":"Pointer","className":"location","objectId":"%objectId%"},"positive":false}'
    }, scope, q, http, CallbuilderSrv;

    beforeEach(function () {
        module('dumpster', [bsLoadingOverlayStub]);
        inject(function ($q, $rootScope, $http, _CallBuilderSrv_) {
            q = $q;
            scope = $rootScope.$new();
            http = $http;
            CallbuilderSrv = _CallBuilderSrv_;
        });
    });

    describe('when service instantiates', function() {
        it('should initially set some scope values', function () {
            expect(CallbuilderSrv.callTpl).toBeDefined();
            expect(CallbuilderSrv.CURL).toEqual(CURL_STUB);
        });
    });

    describe('createRequestObject() method', function() {
        it('should return an object with fields', function() {
            var id = '123456'
            expect(CURL_STUB.comment.indexOf(id)).toEqual(-1);
            var res = CallbuilderSrv.createRequestObject('comment', {objectId: id});

            expect(res.data).not.toBeUndefined();
            expect(res.method).not.toBeUndefined();
            expect(res.headers).not.toBeUndefined();
            expect(res.url).not.toBeUndefined();
            expect(res.data.indexOf(id)).toBeGreaterThan(0);
        });
    });

    describe('getCommentCall() method', function() {
        it('should return a string without %% values', function() {
            var param = {objectId:'123456',comment:'testComment'};
            var res = CallbuilderSrv.getCommentCall('comment', param);
            expect(res.indexOf(param.objectId)).toBeGreaterThan(0);
            expect(res.indexOf(param.comment)).toBeGreaterThan(0);
            expect(res.indexOf('%objectId%')).toEqual(-1);
            expect(res.indexOf('%comment%')).toEqual(-1);
        });
    });

    describe('getReviewCall() method', function() {
        it('should return a string without %% values', function() {
            var id = '123456';
            var res = CallbuilderSrv.getCommentCall('review', {objectId: id});
            expect(res.indexOf(id)).toBeGreaterThan(0);
            expect(res.indexOf('%objectId%')).toEqual(-1);

        });
    });

    describe('getCoordinatesCall() method', function() {
        it('should return a string without %% values', function() {
            var param = {lat:'123456', lng:'654321'};
            var res = CallbuilderSrv.getCoordinatesCall('radius', param);
            expect(res.indexOf(param.lat)).toBeGreaterThan(0);
            expect(res.indexOf(param.lng)).toBeGreaterThan(0);
            expect(res.indexOf('%lat%')).toEqual(-1);
            expect(res.indexOf('%lng%')).toEqual(-1);
        });
    });
});


