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
        ConsoleView         = require("arduino/ConsoleView").ConsoleView;

    // make sure the global brackets variable is loaded
    require("utils/Global");

    PreferencesManager.definePreference("arduino.consoleShow", "boolean", true);

    EventDispatcher.makeEventDispatcher(exports);

    var LOG_TYPE = {
        ERROR:      "logType.Error",
        INFO:       "logType.Info",
        SUCESS:     "logType.Success"
    };

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

    /** @type {ConsoleView} The console view. Initialized in htmlReady() */
    var _consoleView = null;

    /**
     * Hides the Console Panel
     */
    function hide() {
        _consoleView.hide();
    }

    /**
     * Shows the Console Panel
     */
    function show() {
        _consoleView.show();
    }

    /**
     * Says if the Console Panel is visible
     */
    function isVisible() {
        return _consoleView.isVisible();
    }

    /**
     * Says if the Console Panel is visible
     */
    function toggle() {
        _consoleView.toggle();
    }

    /**
     * Clears the Console Panel
     */
    function clear() {
        _consoleView.clear();
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
        }
    }

    AppInit.htmlReady(function () {
        _consoleView = new ConsoleView("arduino-console");
        _consoleView.on("hide", function(){
            exports.trigger("hide");
        });
        _consoleView.on("show", function(){
            exports.trigger("show");
        });
        _consoleView.on("clear", function(){
            exports.trigger("clear");
        });
        _consoleView.on("log", function(evt, msg){
            exports.trigger("log", msg);
        });
    });

    CommandManager.register(Strings.CMD_CONSOLE, Commands.TOOLS_CONSOLE_TOOGLE, toggle);


/*    AppInit.appReady(function () {
        $("#toolbar-console-btn").click( toggle );
    });*/

    // Define public API
    exports.show = show;
    exports.hide = hide;
    exports.isVisible = isVisible;
    exports.toggle = toggle;
    exports.clear = clear;
    exports.logInfo = logInfo;
    exports.logError = logError;
    exports.logSuccess = logSuccess;
    exports.LOG_TYPE = LOG_TYPE;
});
