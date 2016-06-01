angular.module('dumpster').service('DumpsterDataSrv', function($q, CallBuilderSrv) {
    'use strict';

    var self = this;

    /**
     * Main call for dumpsters information
     *
     * @param calltype
     * @param pos
     * @returns {*}
     */
    self.callForDumpsters = function(pos) {
        var deferred = $q.defer();

        CallBuilderSrv.requestBackend('radius', pos).then(function(data) {
            deferred.resolve(data.results);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };


    /**
     * Call for dumpster's reviews by given dumpster id
     *
     * @param id
     */
    self.callForDumpsterResponses = function(id) {
        var deferred = $q.defer();

        if (self.dumpsterComments) {
            deferred.resolve(self.dumpsterComments);
        } else {
            CallBuilderSrv.requestBackend('review', id).then(function(data) {
                self.dumpsterComments = data.results;
                deferred.resolve(data.results);
            }, function(error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };


    /**
     * Send anonymous review for given id
     *
     * @param id
     * @param review
     * @returns {*}
     */
    self.leaveReview = function(id, review) {
        var deferred = $q.defer();

        CallBuilderSrv.requestBackend('comment', {id:id, comment:review}).then(function(data) {
            deferred.resolve(data.results);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise;

    };


    /**
     * Filters comments by dumpsterId
     *
     * @param id
     * @returns {Array}
     */
    self.filterCommentsById = function(id) {
        if (!self.dumpsterComments) {
            return [];
        } else {
            return self.dumpsterComments.filter(function(item, index) {
                return item.location.objectId === id;
            });
        }
    };
});
