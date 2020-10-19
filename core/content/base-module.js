"use strict";

// Respond to check if base modules/files are running
browser.runtime.onMessage.addListener((request, sender, response) => {
	if (request?.basemodules === "running") {
		return true;
	}
});

/*
var Module = (function() {
	
	var enable = function (url) {

	};
	
	var disable = function () {

	};

	// Called when the module's config has changed.
	var configChanged = function (oldConfig, newConfig) {

	}
	
	return {
		enable: enable,
		disable: disable,
		configChanged: configChanged
	};
	
}());
*/

var BaseModule = (function () {
	/**
	 * Initial module setup.
	 * @param {*} module Module object
	 * @param {*} moduleName Name of the module. Must match name specified in background script.
	 */
	var initModule = async function(module, moduleName) {
		
		// Fetch module config
		module.config = await ConfigurationManager.getFinalConfig(location.hostname, moduleName);

		// Enable module if needed
		if (module.config.enabled) {
			module.enable.call(module);
		}
		
		// Respond to checks to see if module is alive
		browser.runtime.onMessage.addListener((request, sender, response) => {
			if (request?.modulename === moduleName) {
				return true;
			}
		});

		/**
		 * Notify module of changes to config values
		 */
		browser.storage.onChanged.addListener(async (changes, areaName) => {
			let newConfig = await ConfigurationManager.getFinalConfig(location.hostname, moduleName);
			let oldConfig = module.config;
			module.config = newConfig;
			// Notify module of config change
			if (oldConfig.enabled && module.configChanged) {
				module.configChanged.call(module, oldConfig, newConfig);	
			}

			// Enable/disable module if needed
			if (newConfig.enabled != oldConfig.enabled) {
				if (newConfig.enabled === true) {
					module.enable.call(module);
				}
				else {
					module.disable.call(module);
				}
			}			
		});
	};
	
	return {
		initModule: initModule
	};
	
}());
