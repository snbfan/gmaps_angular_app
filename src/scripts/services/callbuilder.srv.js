angular.module('dumpster').service('CallBuilderSrv', function($q, $http) {
    'use strict';

    var self = this;

    // call object template to be enriched depending on the call
    self.callTpl = {
        url: 'https://api.parse.com/1/classes/',
        headers: {
            'X-Parse-Application-Id': 'R8jG6ChCSOGxvB4UWjcMMlEMuloVjoVLo4mS2xkD',
            'X-Parse-REST-API-Key': '8GjcnO3gOdaIE41Nl9Y2juLEQgiNvHVdUM1aZoxF'
        }
    };

    // CURL data payload tpls
    self.CURL = {
        // template for getting object around pos
        'radius': 'where={ "geo": { "$nearSphere": {"__type": "GeoPoint", "latitude": %lat%, "longitude": %lng% }, "$maxDistanceInKilometers": 2.0 } }',
        // template for retrieving reviews for dumpster with given id
        'review': 'where={"location":{"__type":"Pointer","className":"location","objectId":"%objectId%"}}',
        // template for leaving comments for dumpster location
        'comment': '{"comment":"%comment%","location":{"__type":"Pointer","className":"location","objectId":"%objectId%"},"positive":false}'
    };


    /**
     * Compiles the object for $http
     *
     * @param calltype
     * @param pos
     * @returns {Object}
     */
    self.createRequestObject = function(calltype, params) {

        var callTpl = angular.copy(self.callTpl), urlEndpoint = 'review';

        callTpl.method = 'GET';

        switch(calltype) {
            case 'comment':
                callTpl.method = 'POST';
                callTpl.headers['Content-Type'] = 'application/json';
                callTpl.data = self.getCommentCall(calltype, params);
                break;

            case 'radius':
                callTpl.data = encodeURI(self.getCoordinatesCall(calltype, params));
                urlEndpoint = 'location';
                break;

            case 'review':
                callTpl.data = encodeURI(self.getReviewCall(calltype, params));
                break;
        }

        callTpl.url += urlEndpoint;

        return callTpl;
    };


    /**
     * Replaces comment tpl with objectid and comment text
     *
     * @param calltype
     * @param params
     */
    self.getCommentCall = function(calltype, params) {
        var currentTpl = self.CURL[calltype] || '';
        return currentTpl.replace('%objectId%', params.objectId).replace('%comment%', params.comment);
    };


    /**
     * Replaces tpl with objectId
     *
     * @param objectId
     * @returns {string}
     */
    self.getReviewCall = function(calltype, objectId) {
        var currentTpl = self.CURL[calltype] || '';
        return currentTpl.replace('%objectId%', objectId);
    };


    /**
     * Replaces tpl with pos coordinates
     *
     * @param pos
     * @returns {{data: string}}
     */
    self.getCoordinatesCall = function (calltype, pos) {
        var currentTpl = self.CURL[calltype] || '';
        return currentTpl.replace('%lat%', pos.lat).replace('%lng%', pos.lng);
    };


    /**
     * Creates a request object,
     *
     * @param calltype
     * @returns {Promise}
     */
    self.requestBackend = function(calltype, param) {
        var deferred = $q.defer();
        var requestObject = self.createRequestObject(calltype, param);

        $http(requestObject)
        .success(function (data, status, headers, config) {
            deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
            deferred.reject('Server unavailable');
        });

        return deferred.promise;
    };
});
