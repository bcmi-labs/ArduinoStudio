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
 * date:        11 Sep 2015
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var //AppInit             = require("utils/AppInit"),
        NodeDomain          = require("utils/NodeDomain"),
        FileUtils           = require("file/FileUtils,");

    var domainPath = FileUtils.getNativeBracketsDirectoryPath() + "/" + FileUtils.getNativeModuleDirectoryPath(module) + "/node/serialport";
    //var NodeSerialPort      = new NodeDomain("nodeSerialPort", domainPath);

    //PreferencesManager.definePreference("arduino.serialMonitorAutoScroll", "boolean", true);
    //PreferencesManager.definePreference("arduino.serialM", "boolean", true);

    /**
     * @constructor
     * Create a SerialPort object.
     *
     * @param {String} address Identification of serial port (e.g. COM1, tty0)
     * @param {Number} Baud Rate Baud rate for serial connection
     * @param {String} eol End Of Line char
     */
    function SerialPort(address, baudRate, eol) {

        this.address = address;
        this.baudRate = baudRate || 9600;
        this.eol = eol || "NL";
    }

    /**
     * Closes the connection to the serial port
     */
    SerialPort.prototype.close = function(){
        //TODO
    };

    /**
     * Opens the connection to serial port
     */
    SerialPort.prototype.open = function(){
        //TODO
    };

    /**
     * Says if the connection is open
     */
    SerialPort.prototype.isOpen = function(){
        //TODO
    };

    /**
     * Sends message trough the serial connection
     */
    SerialPort.prototype.send = function(){
        //TODO
    };

    //AppInit.htmlReady(function () {
    //
    //});

    // Public API
    exports.SerialPort = SerialPort;
});
