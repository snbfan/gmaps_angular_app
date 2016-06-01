'use strict';
describe('Tests for dumpster.ctrl.js : ', function () {

    var scope, q, controller, dumpsterCtrl, GooglemapsSrv, DumpsterDataSrv, bsLoadingOverlayService = bsLoadingOverlayStub()().bsLoadingOverlayService;

    beforeEach(function () {
        module('dumpster', [bsLoadingOverlayStub]);
        inject(function ($q, $rootScope, $httpBackend, $controller, _GooglemapsSrv_, _DumpsterDataSrv_) {

            scope = $rootScope.$new();
            controller = $controller;
            q = $q;

            $httpBackend.when('GET',/.*api.parse.com.*/).respond(200, '{}');

            DumpsterDataSrv = _DumpsterDataSrv_;
            GooglemapsSrv = _GooglemapsSrv_;

            dumpsterCtrl = $controller('DumpsterController', {
                '$scope': scope,
                'DumpsterDataSrv': DumpsterDataSrv,
                'GooglemapsSrv': GooglemapsSrv,
                'bsLoadingOverlayService': bsLoadingOverlayService
            });
        });
    });

    describe('when controller instantiates', function() {
        it('should initially set some scope values', function () {
            expect(scope.error).toBe(false);
            expect(scope.comments).toBe(false);
            expect(typeof scope.viewMessages).toEqual('object');
            expect(Object.keys(scope.viewMessages).length).toBeGreaterThan(0);
        });
    });

    describe('start() method: ', function() {
        it('should make a call to showOverlay()', function() {
            spyOn(dumpsterCtrl, 'showOverlay');
            dumpsterCtrl.start();
            expect(dumpsterCtrl.showOverlay).toHaveBeenCalled();
        });

        it('should make a call to GooglemapsSrv.askForLocation', function() {
            spyOn(GooglemapsSrv, 'askForLocation').and.returnValue(PromiseStub({lat:1, lng:1}, null));
            dumpsterCtrl.start();
            expect(GooglemapsSrv.askForLocation).toHaveBeenCalled();
        });

        it('should make a call to setPinsOnMap() if GooglemapsSrv.askForLocation is resolved', function() {
            spyOn(dumpsterCtrl, 'setPinsOnMap');
            spyOn(GooglemapsSrv, 'askForLocation').and.returnValue(PromiseStub({lat:1, lng:1}, null));

            dumpsterCtrl.start();

            expect(dumpsterCtrl.setPinsOnMap).toHaveBeenCalled();
        });

        it('should make a call to showError() after GooglemapsSrv.askForLocation is rejected', function() {
            var errorMessage = 'error1';

            spyOn(scope, 'showError');
            spyOn(dumpsterCtrl, 'setPinsOnMap');
            spyOn(GooglemapsSrv, 'askForLocation').and.returnValue(PromiseStub(null, errorMessage));

            dumpsterCtrl.start();

            expect(dumpsterCtrl.setPinsOnMap).not.toHaveBeenCalled();
            expect(scope.showError).toHaveBeenCalledWith(errorMessage);
        });

        it('should make a call to hideOverlay() after GooglemapsSrv.askForLocation is finished', function() {
            spyOn(dumpsterCtrl, 'hideOverlay');
            spyOn(GooglemapsSrv, 'askForLocation').and.returnValue(PromiseStub(null, null));

            dumpsterCtrl.start();

            expect(dumpsterCtrl.hideOverlay).toHaveBeenCalled();
        });
    });

    describe('setPinsOnMap() method: ', function() {
        it('should make a call to DumpsterDataSrv.callForDumpsters()', function() {
            spyOn(DumpsterDataSrv, 'callForDumpsters').and.returnValue(PromiseStub({}, null));

            dumpsterCtrl.setPinsOnMap();

            expect(DumpsterDataSrv.callForDumpsters).toHaveBeenCalled();
        });

        it('should make a call to GooglemapsSrv.addPinsAndDescriptions() if DumpsterDataSrv.callForDumpsters() is resolved', function() {
            spyOn(scope, 'showError');
            spyOn(GooglemapsSrv, 'addPinsAndDescriptions');
            spyOn(DumpsterDataSrv, 'callForDumpsters').and.returnValue(PromiseStub({}, null));

            dumpsterCtrl.setPinsOnMap();

            expect(GooglemapsSrv.addPinsAndDescriptions).toHaveBeenCalled();
            expect(scope.showError).not.toHaveBeenCalled();

        });

        it('should make a call to $scope.showError() if DumpsterDataSrv.callForDumpsters() is rejected', function() {
            var errorMessage = 'error2';

            spyOn(scope, 'showError');
            spyOn(GooglemapsSrv, 'addPinsAndDescriptions');
            spyOn(DumpsterDataSrv, 'callForDumpsters').and.returnValue(PromiseStub(null, errorMessage));

            dumpsterCtrl.setPinsOnMap();

            expect(GooglemapsSrv.addPinsAndDescriptions).not.toHaveBeenCalled();
            expect(scope.showError).toHaveBeenCalledWith(errorMessage);

        });
    });

    describe('leaveResponse() method', function() {
        it('should make a call to $scope.$apply()', function() {
            spyOn(scope, '$apply');
            dumpsterCtrl.leaveResponse();
            expect(scope.$apply).toHaveBeenCalled();
        });

        it('should set scope variables', function() {
            var data = 1234;

            dumpsterCtrl.leaveResponse(data);

            expect(scope.thanks).toEqual(false);
            expect(scope.currentDumpster).toEqual(data);
            expect(scope.reviewText).toEqual('');
            expect(scope.reviewRequest).toEqual(true);
        });
    });

    describe('showOverlay() method', function() {
        it('should make a call to bsLoadingOverlayService.start()', function() {
            spyOn(bsLoadingOverlayService, 'start');
            dumpsterCtrl.showOverlay();
            expect(bsLoadingOverlayService.start).toHaveBeenCalled();
        });
    });

    describe('hideOverlay() method', function() {
        it('should make a call to bsLoadingOverlayService.stop()', function() {
            spyOn(bsLoadingOverlayService, 'stop');
            dumpsterCtrl.hideOverlay();
            expect(bsLoadingOverlayService.stop).toHaveBeenCalled();
        });
    });

    describe('sendReview() method', function() {
        beforeEach(function() {
            scope.currentDumpster = {objectId:1};
        });

        it('should make a call to DumpsterDataSrv.leaveReview()', function() {
            var reviewText = '1234';

            spyOn(DumpsterDataSrv, 'leaveReview').and.returnValue(PromiseStub(scope.currentDumpster, null));

            scope.sendReview(reviewText);

            expect(DumpsterDataSrv.leaveReview).toHaveBeenCalledWith(scope.currentDumpster.objectId, reviewText);
        });

        it('should set scope variables if DumpsterDataSrv.leaveReview() is resolved', function() {
            var thanksText = 'Thanks for you comment!';

            spyOn(DumpsterDataSrv, 'leaveReview').and.returnValue(PromiseStub(scope.currentDumpster, null));

            scope.sendReview();

            expect(scope.thanks).toEqual(thanksText);
            expect(scope.reviewText).toEqual('');
            expect(scope.reviewRequest).toEqual(false);
        });

        it('should make a call to $scope.showError() if DumpsterDataSrv.leaveReview() is rejected', function() {
            var error = 'error3';

            spyOn(scope, 'showError');
            spyOn(DumpsterDataSrv, 'leaveReview').and.returnValue(PromiseStub(null, error));

            scope.sendReview();

            expect(scope.showError).toHaveBeenCalledWith(error);
        });
    });

    describe('cancelReview() method', function() {
        it('should set scope variables', function() {
            scope.cancelReview();

            expect(scope.comments).toEqual(false);
            expect(scope.reviewRequest).toEqual(false);
        });
    });

    describe('showError() method', function() {
        it('should set scope variables', function() {
            var errorText = 'error4';

            scope.showError(errorText);


            expect(scope.error).toEqual(errorText);
        });
    });

    describe('hideError() method', function() {
        it('should set scope variables', function() {
            scope.hideError();
            expect(scope.error).toEqual(false);
        });
    });

    describe('events', function() {
        it('"filter_comments" should call methods and set scope values', function() {
            var data = [];

            spyOn(scope, 'cancelReview');
            spyOn(scope, '$apply');
            spyOn(DumpsterDataSrv, 'filterCommentsById');

            scope.$emit('filter_comments', data);

            expect(scope.cancelReview).toHaveBeenCalled();
            expect(scope.thanks).toBe(false);
            expect(DumpsterDataSrv.filterCommentsById).toHaveBeenCalledWith(data);
            expect(scope.$apply).toHaveBeenCalled();
        });

        it('"hide_comments" should call methods and set scope values', function(){
            spyOn(scope, '$apply');

            scope.$emit('hide_comments', {});

            expect(scope.comments).toBe(false);
            expect(scope.thanks).toBe(false);
            expect(scope.$apply).toHaveBeenCalled();
        });

        it('"map_dragged" should call methods', function() {
            var data = {};
            spyOn(dumpsterCtrl, 'setPinsOnMap');

            scope.$emit('map_dragged', data);

            expect(dumpsterCtrl.setPinsOnMap).toHaveBeenCalledWith(data);
        });

        it('"comment_request" should call methods', function() {
            var data = {};
            spyOn(dumpsterCtrl, 'leaveResponse');

            scope.$emit('comment_request', data);

            expect(dumpsterCtrl.leaveResponse).toHaveBeenCalledWith(data);
        });
    });
});
