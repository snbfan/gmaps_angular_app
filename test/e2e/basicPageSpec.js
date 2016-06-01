describe('Dumpster App: after overlay', function() {

    var spinnerOverlaySelector = 'div[bs-loading-overlay-reference-id]',
        // this is where Webstorm opens my page
        localhostUrl = 'http://localhost:63342/dumpster/index.html';

    beforeEach(function () {
        browser.get(localhostUrl);
    });

    describe('Before overlay is hidden', function() {
        it('should have a spinner overlay displayed', function() {
            var spinnerOverlay = element(by.css(spinnerOverlaySelector));
            expect(spinnerOverlay.isDisplayed()).toBe(true);
        });
    });

    describe('After overlay is hidden', function() {
        beforeEach(function () {
            browser.sleep(4000);
        });

        it('should have a spinner overlay hidden', function() {
            var spinnerOverlay = element(by.css(spinnerOverlaySelector));
            expect(spinnerOverlay.isDisplayed()).toBe(false);
        });

        it('should have a map displayed', function() {
            var mapNode = element(by.className('gm-style')),
                mapWrapper = element(by.id('map'));

            expect(mapNode.isDisplayed()).toBe(true);

            mapWrapper.getSize().then(function(res) {
                expect(res).toEqual(jasmine.objectContaining({
                    width: 700,
                    height: 500
                }));
            });
        });

        it('should have an error overlay and modal hidden', function() {
            var overlay = element(by.className('overlay')),
                modal = element(by.className('modal'));

            expect(overlay.isDisplayed()).toBe(false);
            expect(modal.isDisplayed()).toBe(false);
        });

        it('should have comments section hidden', function() {
            var comments = element(by.className('comments'));
            expect(comments.isDisplayed()).toBe(false);
        });

        it('should have review form hidden', function() {
            var form = element(by.css('form'));
            expect(form.isDisplayed()).toBe(false);
        });
    });
});


