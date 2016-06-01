var GooglemapsStub = function() {
    return {
        maps: {
            Map: function() {
                return {
                    setCenter: function() {},
                    addListener: function() {}
                };
            },
            InfoWindow: function() {
                return {
                    addListener: function() {},
                    open: function() {},
                    close: function() {}
                }
            },
            Marker: function() {
                return {
                    addListener: function() {}
                }
            }
        }
    }
};