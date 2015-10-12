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
 * create:      04 Sep 2015
 * edit:        09 Oct 2015 sergio@arduino.org
 *
 */


/*global define, $, Mustache */

/*
 * Panel showing the log Console for Compile/Upload operations. more in general for log messages.
 */
define(function (require, exports, module) {
    "use strict";

    var //EventDispatcher       = require("utils/EventDispatcher"),
        WorkspaceManager      = require("view/WorkspaceManager"),
        PreferencesManager    = require("preferences/PreferencesManager"),
        Console               = require("arduino/Console"),

        _consolePanelTemplate  = require("text!htmlContent/console-panel.html");

    var  _panelHtml, _panel, _$panel, _$logger;

    function init(panelName) {
        _panelHtml  = Mustache.render(_consolePanelTemplate, {});
        _panel      = WorkspaceManager.createBottomPanel(panelName, $(_panelHtml));
        _$panel     = _panel.$panel;
        _$logger    = _$panel.find("#logger");
    }

    /**
     * Dispose the Console panel.
     */
    function dispose() {
        if(_panel){
            _$panel.remove();
        }
    }

    /**
     * Shows the Console panel.
     */
    function show() {
        if(_panel && !_panel.isVisible()){
            _panel.show();
        }
    }

    /**
     * Hides the Console Panel.
     */
    function hide() {
        if (_panel && _panel.isVisible()) {
            _panel.hide();
        }
    }

    /**
     * Says if the Console Panel is visible.
     * @return {boolean}
     */
    function isVisible() {
        if (_panel && _panel.isVisible()) {
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Changes status visible/not-visible of the Console Panel.
     */
    function toggle() {
        if (_panel && _panel.isVisible()) {
            hide();
        }
        else{
            show();
        }
    }

    /**
     * Clears the Console Log panel.
     */
    function clear() {
        if (_panel && _$logger) {
            _$logger.empty();
        }
    }

    /**
     * Appends Info log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    //function logInfo(message) {
    //    if (this._panel && this._$logger) {
    //        this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: black;'>" + message + "</span><br />");
    //    }
    //}

    /**
     * Appends Error log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    //function logError(message) {
    //    if (this._panel && this._$logger) {
    //        this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: darkred;'>" + message + "</span><br />");
    //    }
    //}

    /**
     * Appends Success/OK log messages into the Console.
     *
     * @param {string} message The message to log on Console.
     */
    // function logSuccess(message) {
    //    if (this._panel && this._$logger) {
    //        this._$logger.append("[" + new Date().toLocaleString() + "] - <span style='color: darkgreen;'>" + message + "</span><br />");
    //    }
    //}

    /**
     * Appends Success/OK log messages into the Console.
     *
     * @param {logMessage} msg The msg to log on Console.
     */
    function log(msg) {
        if (_panel && _$logger && msg) {
            switch (msg.type){
            case Console.LOG_TYPE.INFO:
                _$logger.append("[" + msg.timestamp + "] - <span style='color: black;'>" + msg.message + "</span><br />");
                break;
            case Console.LOG_TYPE.ERROR:
                _$logger.append("[" + msg.timestamp + "] - <span style='color: darkred;'>" + msg.message + "</span><br />");
                break;
            case Console.LOG_TYPE.SUCCESS:
                _$logger.append("[" + msg.timestamp + "] - <span style='color: darkgreen;'>" + msg.message + "</span><br />");
                break;
            }
        }
    }

    // Public API
    module.exports.show = show;
    module.exports.hide = hide;
    module.exports.isVisible = isVisible;
    module.exports.toogle = toggle;
    module.exports.log = log;
    module.exports.clear = clear;
    module.exports.dispose = dispose;
    module.exports.init = init;

});
