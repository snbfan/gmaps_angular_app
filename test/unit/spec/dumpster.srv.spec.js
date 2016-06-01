'use strict';
describe('Tests for dumpster.srv.js : ', function () {

    var scope, rootScope, q, DumpsterDataSrv, CallBuilderSrv;

    beforeEach(function () {
        module('dumpster', [bsLoadingOverlayStub]);
        inject(function ($q, $rootScope, _DumpsterDataSrv_, _CallBuilderSrv_) {
            q = $q;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            DumpsterDataSrv = _DumpsterDataSrv_;
            CallBuilderSrv = _CallBuilderSrv_;
        });
    });

    afterEach(inject(function($rootScope) {
        rootScope.$apply();
    }));

    describe('when service instantiates', function() {
        it('should initially set some scope values', function () {
            expect(DumpsterDataSrv.callForDumpsters).toBeDefined();
        });

        it('should have self.dumpsterComments undefined', function () {
            expect(DumpsterDataSrv.dumpsterComments).toBeUndefined();
        });
    });

    describe('callForDumpsters() method', function() {
        it('should make a call to CallBuilderSrv.requestBackend()', function() {
            var pos = {lat:1, lng:1};

            spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

            DumpsterDataSrv.callForDumpsters(pos);

            expect(CallBuilderSrv.requestBackend).toHaveBeenCalledWith('radius', pos);
        });

        it('should return Promise', function() {
            var pos = {lat:1, lng:1};

            spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

            var res = DumpsterDataSrv.callForDumpsters(pos);

            expect(typeof res.then).toEqual('function');
            expect(typeof res.finally).toEqual('function');
        });
    });

    describe('callForDumpsterResponses() method', function() {
        it('should make a call to CallBuilderSrv.requestBackend() if self.dumpsterComments is undefined', function() {
            var id = 1234;
            DumpsterDataSrv.dumpsterComments = undefined;

            spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

            DumpsterDataSrv.callForDumpsterResponses(id);

            expect(CallBuilderSrv.requestBackend).toHaveBeenCalledWith('review', id);
        });

        it('should return Promise', function() {
            spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

            var res = DumpsterDataSrv.callForDumpsterResponses();

            expect(typeof res.then).toEqual('function');
            expect(typeof res.finally).toEqual('function');
        });
    });

    describe('leaveReview() method', function() {
         it('should make a call to CallBuilderSrv.requestBackend()', function() {
             var id = 1234, review = '1234';

             spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

             DumpsterDataSrv.leaveReview(id, review);

             expect(CallBuilderSrv.requestBackend).toHaveBeenCalledWith('comment', {id:id, comment:review});

         });

         it('should return Promise', function() {
             spyOn(CallBuilderSrv, 'requestBackend').and.returnValue(PromiseStub(true, null));

             var res = DumpsterDataSrv.leaveReview();

             expect(typeof res.then).toEqual('function');
             expect(typeof res.finally).toEqual('function');
         });
    });

    describe('filterCommentsById() method', function() {
        it('should return empty array when self.dumpsterComments is undefined', function() {
            DumpsterDataSrv.dumpsterComments = undefined;

            var res = DumpsterDataSrv.filterCommentsById(1);

            expect(res).toEqual([]);
        });

        it('should filter self.dumpsterComments object by given id when self.dumpsterComments is defined', function() {
            var comment1 = {location:{objectId:1234}}, comment2 = {location:{objectId:2345}}, id = 1234;
            DumpsterDataSrv.dumpsterComments = [comment1, comment2];

            var res = DumpsterDataSrv.filterCommentsById(id);

            expect(res.length).toEqual(1);
            expect(res[0]).toEqual(comment1);
        });
    });
});
