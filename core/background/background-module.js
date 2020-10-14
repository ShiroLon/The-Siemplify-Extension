"use strict"

class BackgroundModule {
    constructor(host, name) {
        this.host = host;
        this.name = name;
        // Fetch module config
        this.config = ConfigurationManager.getFinalConfig(this.host, this.name)
        .then(config => {
            this.config = config;
            // Enable module if needed
            if (this.config.enabled) {
                this.enable();
            }
        })
        ConfigurationManager.onGlobalConfigChanged.addListener(name, this._configChanged.bind(this));
        ConfigurationManager.onHostConfigChanged.addListener(host, name, this._configChanged.bind(this));
    }
    /**
     * Notify module of changes to config values
     */
    async _configChanged() {
        let newConfig = await ConfigurationManager.getFinalConfig(this.host, this.name);
        let oldConfig = this.config;
        this.config = newConfig;
        // Notify module of config change
        if (this.configChanged) {
            this.configChanged(oldConfig, newConfig);
        }
        
        // Enable/disable module if needed
        if (newConfig.enabled != oldConfig.enabled) {
            if (newConfig.enabled === true) {
                this.enable();
            }
            else {
                this.disable();
            }
        }
        
    }

    enable() {

    }

    disable() {

    }

    configChanged(oldConfig, newConfig) {

    }

}