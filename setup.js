module.exports = function() {

	var getHook = function(Hook) {
		return function (func) {
			Hook.call(this, function (callback) {
				var that = this;
				this.sync(function () {
					func.call(that);
					callback();
				});
			});
		};
	};

	var getStep = function(Step) {
		return function (expression, func) {
			Step.call(this, expression, function () {
				var that = this;
				var matches = Array.prototype.slice.call(arguments);
				var callback = matches.pop();

				this.sync(function () {
					try {
						func.apply(that, matches);
						callback();
					} catch (e) {
						callback.fail(e.message);
					}
				});
			});
		};
	};

	this.Before = getHook(this.Before);
	this.After = getHook(this.After);

	this.Given = getStep(this.Given);
	this.When = getStep(this.When);
	this.Then = getStep(this.Then);


	this.Before(function () {
		this.browser.init(this.desiredCapabilities);
	});

	this.After(function () {
		this.browser.quit();
	});
};
