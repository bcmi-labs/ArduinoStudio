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
 *
 */


/*global define, $, Mustache */

/*
 * Panel showing the log Console for Compile/Upload operations. more in general for log messages.
 */
define(function (require, exports, module) {
    "use strict";

    var EventDispatcher       = require("utils/EventDispatcher"),
        WorkspaceManager      = require("view/WorkspaceManager"),
        PreferencesManager    = require("preferences/PreferencesManager"),
        Console               = require("arduino/Console"),

        consolePanelTemplate  = require("text!htmlContent/console-panel.html");

    var prefs = PreferencesManager.getExtensionPrefs("arduino");

    /**
     * @const
     * Name of preferences to use in PreferencesManager.
     * @type {String}
     */
    var CONSOLE_SHOW = "consoleShow";

    /**
     * @constructor
     * Handles the Console panel.
     *
     * @param {string} panelName The name to use for the panel, as passed to PanelManager.createBottomPanel().
     */
    function ConsoleView(panelName) {
        var panelHtml  = Mustache.render(consolePanelTemplate, {});

        this._panel    = WorkspaceManager.createBottomPanel(panelName, $(panelHtml));
        this._$logger  = this._panel.$panel.find("#logger");


        if(!prefs.get(CONSOLE_SHOW)) {
            this.hide();
        }
        else {
            this.show();
        }

        //_changeBackground();

    }

    /*ThemeManager.on("themeChange", function(evt){
        var theme = evt.target; //Theme Object
        _changeBackground();
    });*/

    EventDispatcher.makeEventDispatcher(ConsoleView.prototype);

    /** @type {ConsoleModel} The Console model we're viewing. */
    //ConsoleView.prototype._model = null;

    /** @type {Panel} Bottom panel holding the Console */
    ConsoleView.prototype._panel = null;

    /** @type {$.Element} The element where the console log is placed */
    ConsoleView.prototype._$logger = null;

    /**
     * Shows the Console panel.
     */
    ConsoleView.prototype.show = function () {
        if(this._panel && !this._panel.isVisible()){
            this._panel.show();
            prefs.set(CONSOLE_SHOW, true);
            this.trigger("show");
        }
    };

    /**
     * Hides the Console Panel.
     */
    ConsoleView.prototype.hide = function () {
        if (this._panel && this._panel.isVisible()) {
            this._panel.hide();
            prefs.set(CONSOLE_SHOW, false);
            this.trigger("hide");
        }
    };

    /**
     * Says if the Console Panel is visible.
     * @return {boolean}
     */
    ConsoleView.prototype.isVisible = function () {
        if (this._panel && this._panel.isVisible()) {
            return true;
        }
        else{
            return false;
        }
    };

    /**
     * Changes status visible/not-visible of the Console Panel.
     */
    ConsoleView.prototype.toggle = function () {
        if (this._panel && this._panel.isVisible()) {
            this.hide();
        }
        else{
            this.show();
        }
    };


    /**
     * Clears the Console Log panel.
     */
    ConsoleView.prototype.clear = function () {
        if (this._panel && this._$logger) {
            this._$logger.empty();
            this.trigger("clear");
        }
    };

    /**
     * Appends Info log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    ConsoleView.prototype.logInfo = function (message) {
        if (this._panel && this._$logger) {
            this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: black;'>" + message + "</span><br />");
        }
    };

    /**
     * Appends Error log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    ConsoleView.prototype.logError = function (message) {
        if (this._panel && this._$logger) {
            this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: darkred;'>" + message + "</span><br />");
        }
    };

    /**
     * Appends Success/OK log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    ConsoleView.prototype.logSuccess = function (message) {
        if (this._panel && this._$logger) {
            this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: darkgreen;'>" + message + "</span><br />");
        }
    };

    /**
     * Update the background color of the Console, matching Editor background color.
     */
    /*function _changeBackground(){
        //var rgbJQBGColor =  $(".modal-body").css("background-color") ;
        //var hexBGColor = ColorUtils.rgbToHex(rgbJQBGColor);
        //$("#logger").css("background-color", hexBGColor);
    }*/

    /**
     * Appends Success/OK log messages into the Console.
     *
     * @param {logMessage} msg The msg to log on Console.
     */
    ConsoleView.prototype.log = function (msg) {
        if (this._panel && this._$logger && msg) {
            switch (msg.type){
            case Console.LOG_TYPE.INFO:
                this._$logger.append("[" + msg.timestamp + "] - <span style='color: black;'>" + msg.message + "</span><br />");
                break;
            case Console.LOG_TYPE.ERROR:
                this._$logger.append("[" + msg.timestamp + "] - <span style='color: darkred;'>" + msg.message + "</span><br />");
                break;
            case Console.LOG_TYPE.SUCCESS:
                this._$logger.append("[" + msg.timestamp + "] - <span style='color: darkgreen;'>" + msg.message + "</span><br />");
                break;
            }
            this.trigger("log", msg);
        }
    };



    //TODO: add register command for console panel

    // Public API
    exports.ConsoleView = ConsoleView;
});
