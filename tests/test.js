const Application = require("spectron").Application;
const path = require('path');
const chai = require('chai');
const should = chai.should();
const chaiAsPromised = require('chai-as-promised');
const testPage = require('./test.page.js');

var page = new testPage();

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

if (process.platform === 'win32') {
    electronPath += '.cmd';
}

// Path to your application
var appPath = path.join(__dirname, '..');

var app = new Application({
            path: electronPath,
            args: [appPath]
        });

global.before(function () {
    //chai.should();
    chai.use(chaiAsPromised);
    page.setApp(app);
});

describe('Test Example', function () {
    beforeEach(function () {
        return app.start();
    });

    afterEach(function () {
        return app.stop();
    });

    it('should fail, yes == no ', function () {
        chai.expect("yes").to.equal("no");
    });

    it('should succeed, yes == yes', function () {
        chai.expect("yes").to.equal("yes");
    });

    it('should fail, yes != no', function () {
        function fn() {
            var yes = 'yes';
            yes.should.equal('no');
        }
        fn();
    });

    it('should fail, pass in text', function () {
        function fn(txt) {
            var yes = 'yes';
            yes.should.equal(txt);
        }
        fn("no");
    });

    it('should fail, waitUntilWindowLoaded, yes != no', function () {
        app.client.waitUntilWindowLoaded().getTitle().then(
            function (txt) {
                console.log('txt = ' + txt);
                var yes = 'yes';
                yes.should.equal('no');
            }
        );
    });

    it('should succeed, tests the not NOT title', function () {
        return app.client.waitUntilWindowLoaded().getTitle().then(function (txt) { chai.expect(txt).to.not.equal("NOT" + page.pageTitle); });
    });

    it('should fail, tests the NOT title', function () {
        return app.client.waitUntilWindowLoaded().getTitle().then(function (txt) { chai.expect(txt).to.equal("NOT" + page.pageTitle); });
    });

    it('should succeed, tests the page title', function () {
        return page.getApplicationTitle().should.eventually.equal(page.pageTitle);
    });

    it('should fail, tests the NOT page title', function () {
        return page.getApplicationTitle().should.eventually.not.equal("NOT" + page.pageTitle);
    });

    it('should fail, tests the NOT page title', function () {
        return page.getApplicationTitle().should.eventually.equal("NOT" + page.pageTitle);
    });

    it('should succeed, tests window open count', function () {
        app.client.debug();
        return page.getWindowCount().should.eventually.equal(page.windowCount);
    });

    it('should fail, tests window open count', function () {
        app.client.debug();
        return page.getWindowCount().should.eventually.equal(page.windowCount + 1);
    });

    it('should succeed, clicks the button', function () {
        return page.clickButtonAndGetText().should.eventually.equal(page.helloText);
    });

    it('should fail, clicks the button', function () {
        return page.clickButtonAndGetText().should.eventually.equal("NOT" + page.helloText);
    });
});
