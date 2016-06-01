var bsLoadingOverlayStub = function() {
    return function() {
        return {
            bsLoadingOverlayService: {
                start: function() {return true;},
                stop: function() {return true;}
            }
        }
    }
};