angular.module('dumpster').controller('DumpsterController', function($scope, $rootScope, DumpsterDataSrv, GooglemapsSrv, bsLoadingOverlayService) {
    'use strict';

    var self = this;

    $scope.error = false;
    $scope.comments = false;
    $scope.viewMessages = {
        jammer: 'Yammer!',
        visitlater: '. Please visit us later',
        leaveresponse: 'Please leave your response for',
        commentslocation: 'Comments on this location:',
        nocomments: 'No comments for this location',
        thanks: 'Thanks for you comment!'
    };

    /**
     * Start point
     */
    self.start = function() {
        self.showOverlay();

        GooglemapsSrv.askForLocation().then(function(pos) {
            self.setPinsOnMap(pos);
            DumpsterDataSrv.callForDumpsterResponses('dumpsters');
        }, function(error) {
            $scope.showError(error);
        }).finally(function() {
            self.hideOverlay();
        });
    };


    /**
     * Fetches dumpster locations, set pins on map, generate description blocks
     *
     * @param {Object} pos
     */
    self.setPinsOnMap = function(pos) {
        DumpsterDataSrv.callForDumpsters(pos).then(function(dumpsters) {
            GooglemapsSrv.addPinsAndDescriptions(dumpsters);
        }, function(error) {
            $scope.showError(error);
        });
    };


    /**
     * Initiates comment form
     *
     * @param data
     */
    self.leaveResponse = function(data) {
        $scope.thanks = false;
        $scope.currentDumpster = data;
        $scope.reviewText = '';
        $scope.reviewRequest = true;
        $scope.$apply();
    };


    /**
     * Overlay+spinner show
     */
    self.showOverlay = function() {
        bsLoadingOverlayService.start({ referenceId: 'main' });
    };


    /**
     * Overlay+spinner hide
     */
    self.hideOverlay = function () {
        bsLoadingOverlayService.stop({ referenceId: 'main' });
    };


    /**
     * Sends comment
     *
     * @param reviewText
     */
    $scope.sendReview = function(reviewText) {
        DumpsterDataSrv.leaveReview($scope.currentDumpster.objectId, reviewText).then(function() {
            $scope.reviewRequest = false;
            $scope.thanks = $scope.viewMessages.thanks;
            $scope.reviewText = '';
        }, function(error) {
            $scope.showError(error);
        });
    };


    /**
     * Cancels the form
     */
    $scope.cancelReview = function() {
        $scope.reviewRequest = false;
        $scope.comments = false;
    };


    /**
     * Shows error modal
     *
     * @param error
     */
    $scope.showError = function(error) {
        $scope.error = error;
    };


    /**
     * Hides error modal
     */
    $scope.hideError = function() {
        $scope.error = false;
    };


    // triggered when infoWindow is opened
    $scope.$on('filter_comments', function(event, data) {
        $scope.cancelReview();
        $scope.comments = DumpsterDataSrv.filterCommentsById(data);
        $scope.thanks = false;
        $scope.$apply();
    });

    // triggered when infoWindow is opened
    $scope.$on('hide_comments', function(event, data) {
        $scope.comments = false;
        $scope.thanks = false;
        $scope.$apply();
    });

    // listens to map dragging
    $scope.$on('map_dragged', function(event, data) {
        self.setPinsOnMap(data);
    });

    // listener for "Comment" button click
    $scope.$on('comment_request', function(event, data) {
        self.leaveResponse(data);
    });


    self.start();
});
