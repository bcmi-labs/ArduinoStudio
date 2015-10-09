/*
 * This file is part of Arduino Studio
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Copyright 2015 Arduino Srl (http://www.arduino.org/) support@arduino.org
 *
 * authors:     sergio@arduino.org
 * date:        04 Sep 2015
 */


/**
 * questo modulo é una sorta di interfaccia per le api core della console, utilizzabile nei moduli di AS o nelle estensioni utente da un lato,
 * mentre dall'altro e la
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var AppInit             = require("utils/AppInit"),
        EventDispatcher     = require("utils/EventDispatcher"),
        PreferencesManager  = require("preferences/PreferencesManager"),
        Commands            = require("command/Commands"),
        CommandManager      = require("command/CommandManager"),
        Strings             = require("strings"),
        FileSystem          = require("filesystem/FileSystem"),
        FileUtils           = require("file/FileUtils");


    // make sure the global brackets variable is loaded
    // require("utils/Global");

    /**
     * @type {string} _consoleDefaultModule is the path of the default Console Module
     * @private
     */
    var _consoleDefaultModule = FileUtils.getNativeBracketsDirectoryPath() + "/" + FileUtils.getNativeModuleDirectoryPath(module) + "/ConsoleView.js";

    /**
     *
     * @type {Object} LOG_TYPE Contains key/value informations to determinate the logging type.
     */
    var LOG_TYPE = {
            ERROR:      "logType.Error",
            INFO:       "logType.Info",
            SUCCESS:     "logType.Success",
            WARNING:    "logType.Warning"
    };

    /**
     * @type {PrefixedPreferencesSystem} _prefs
     * @private
     */
    var _prefs = PreferencesManager.getExtensionPrefs("arduino.panel.console");

    /** @type {ConsoleView} The console view. Initialized in htmlReady() */
    var _consoleView = null;

    PreferencesManager.definePreference("arduino.panel.console.show", "boolean", true);
    PreferencesManager.definePreference("arduino.panel.console.module.default", "string", _consoleDefaultModule);

    EventDispatcher.makeEventDispatcher(exports);

    /**
     * @constructor
     * logMessage is the object used to rapresents log into the console, it's also triggered trough core api .
     *
     * @param {string} message Message to log.
     * @param {LOG_TYPE} type Log type: info, success, error
     */
    function Message(message, type){
        this.message = message;
        this.type = type || LOG_TYPE.INFO;
        this.timestamp = new Date().toLocaleString();
    }

    /**
     * Hides the Console Panel
     */
    function hide() {
        _consoleView.hide();
        _prefs.set("show", false);
        exports.trigger("hide");
    }

    /**
     * Shows the Console Panel
     */
    function show() {
        _consoleView.show();
        _prefs.set("show", true);
        exports.trigger("show");
    }

    /**
     * Says if the Console Panel is visible
     */
    function isVisible() {
        return _consoleView.isVisible();
    }

    /**
     * Shows if is invisible or hides if visible
     */
    function toggle() {
        if(isVisible()){
            hide();
        }
        else{
            show();
        }
        exports.trigger("toggle");
    }

    /**
     * Clears the Console Panel
     */
    function clear() {
        _consoleView.clear();
        exports.trigger("clear");
    }

    /**
     * Log an Info message on the Console Panel
     *
     * @param {Object} data The message to log on the Console.
     */
    function logInfo(data) {
        if(data) {
            var msg = new Message(data, LOG_TYPE.INFO);
            _consoleView.log(msg);
            exports.trigger("log-info", msg);
        }
    }

    /**
     * Log an Error message on the Console Panel
     *
     * @param {Object} data The message to log on the Console.
     */
    function logError(data) {
        if(data) {
            var msg = new Message(data, LOG_TYPE.ERROR);
            _consoleView.log(msg);
            exports.trigger("log-error", msg);

        }
    }

    /**
     * Log a Success/OK message to the Console Panel
     *
     * @param {Object} data The message to log on the Console.
     */
    function logSuccess(data) {
        if(data) {
            var msg = new Message(data, LOG_TYPE.SUCCESS);
            _consoleView.log(msg);
            exports.trigger("log-success", msg);
        }
    }

    /**
     * Log a warning message to the Console Panel
     *
     * @param {Object} data The message to log on the Console.
     */
    function logWarning(data) {
        if(data) {
            var msg = new Message(data, LOG_TYPE.WARNING);
            _consoleView.log(msg);
            exports.trigger("log-warning", msg);
        }
    }

    /**
     * Load Console Module and return a promise
     * @param {String} moduleName The module name used to get the module and load it.
     * @returns {JQuery.Promise} the promise resolves if the module is loaded and fails if there's errors
     */
    function loadModule(moduleName){
        var $deferred = new $.Deferred();
        var moduleFilePath = _prefs.get("module." + moduleName),
            moduleDefaultFilePath = _prefs.get("module.default");
        if(moduleFilePath !== undefined) {

            //TODO: se carico un modulo, che é gia caricato, non caricarlo.

            var file = FileSystem.getFileForPath(moduleFilePath);
            file.exists(function (err, status) {
                if (status) {
                    _load(moduleFilePath, function(error){
                        if(error){
                            $deferred.fail(error);
                        }
                        else{
                            $deferred.resolve();
                        }
                    });
                }
                else {
                    _load(moduleDefaultFilePath, function(error){
                        if(error){
                            $deferred.fail(error);
                        }
                        else{
                            $deferred.resolve();
                        }
                    });
                }
            });
        }
        else{
            _load(moduleDefaultFilePath, function(error){
                if(error){
                    $deferred.fail(error);
                }
                else{
                    $deferred.resolve();
                }
            });
        }

        return $deferred.promise();
    }

    //TODO: implementare un meccanismo che permetta di capire se il modulo rispetta le interfacce.
    //TODO: implementare un meccanismo che permetta la registrazione di altri moduli, che vengono caricati come estensione
    //TODO: quando si fa il load e l'unload del modulo, si dovrebbe prevedere che venga fatto dentro la cornice,
    // e non rimuovere tutto, ma solo quello contenuto dentro.

    //function registerModule(moduleName, modulePath){
    //
    //}

    /**
     * Loads the specified module
     * @param {String} modulePath the path to javascript module
     * @param {Function} callback - call backs only errors
     * @private
     */
    function _load(modulePath, callback){
        _unload(function(error){
            if(!error) {
                require([modulePath], function (res) {
                    _consoleView = res;
                    _consoleView.init("");
                    if( !!_prefs.get("show") ) {
                        show();
                    }
                    else {
                        hide();
                    }
                    callback(null);
                });
            }
            else{
                callback(error)
            }
        });
    }

    /**
     * Unloads the current module
     * @private
     */
    function _unload(callback){
        try {
            if (_consoleView) {
                _consoleView.dispose();
                _consoleView = null;
            }
            callback(null);
        }
        catch(error){
            callback(error);
        }
    }

    AppInit.htmlReady(function () {
        loadModule("default").done(function(){
            if( !!_prefs.get("show") ) {
                show();
            }
            else {
                hide();
            }
        })
        .fail(function(err){

        });
    });

    CommandManager.register(Strings.CMD_CONSOLE, Commands.TOOLS_CONSOLE_TOOGLE, toggle);

    // Define public API
    exports.show = show;
    exports.hide = hide;
    exports.isVisible = isVisible;
    exports.toggle = toggle;
    exports.clear = clear;
    exports.logInfo = logInfo;
    exports.logError = logError;
    exports.logSuccess = logSuccess;
    exports.logWarning = logWarning;
    exports.loadModule = loadModule;
    //exports.registerModule = registerModule;
    exports.LOG_TYPE = LOG_TYPE;
});
