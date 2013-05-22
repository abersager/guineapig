module.exports = function (options) {

  options.verbose = options.verbose || false;
  options.baseUrl = options.baseUrl || "http://localhost";

  require('expectations');

  var webdriver = require('wd-sync');

  var webdriverArgs = [
    options.driverUrl,
    options.driverPort,
    options.driverUser,
    options.driverKey
  ];

  var desiredCapabilities = {
    browserName: options.browserName,
    version: options.browserVersion,
    platform: options.browserPlatform
  };

  var client = webdriver.remote.apply(this, webdriverArgs);
  var browser = client.browser;
  var sync = client.sync;

  return function WorldConstructor(callback) {

    this.sync = sync;
    this.desiredCapabilities = desiredCapabilities;
    this.browser = browser;

    if (options.verbose) {
      browser.on('status', function(info){
        console.log('\x1b[36m%s\x1b[0m', info);
      });

      browser.on('command', function(meth, path){
        console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
      });
    }

    this.get = function(url) {
      browser.get(options.baseUrl + url);
    };

    this.remote = function (remoteFunction, args) {
      var remoteString = 'return (' + remoteFunction.toString() + ').apply(this, arguments)';
      return browser.execute(remoteString, args);
    };

    sync(function () {
      callback();
    });
  };
};
