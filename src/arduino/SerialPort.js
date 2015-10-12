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
    var NodeDomain          = require("utils/NodeDomain"),
        FileUtils           = require("file/FileUtils"),
        EventDispatcher     = require("utils/EventDispatcher");


    var domainPath = FileUtils.getNativeBracketsDirectoryPath() + "/" + FileUtils.getNativeModuleDirectoryPath(module) + "/node/SerialDomain";
    var serialDomain      = new NodeDomain("arduino-serial-domain", domainPath);

    //var EOL = {
    //    NL:     "\n",
    //    CR:     "\r",
    //    BOTH:   "\r\n"
    //};

    /**
     * @constructor
     * Create a SerialPort object.
     *
     * @param {String} address Identification of serial port (e.g. COM1, /dev/tty0)
     * @param {Number} Baud Rate Baud rate for serial connection
     */
    function SerialPort(address, baudRate) {
        this.address = address;
        this.baudRate = baudRate || 9600;

        var that = this;
        //TODO manage the promise callback - done and fail
        serialDomain.exec("create", this.address, parseInt(this.baudRate, 10));

        this._handleSerialData = function($evt, port, data){
            if(that.address.localeCompare(port) === 0 ) {
                that.trigger("data", data);
            }
        };

        serialDomain.on('data', this._handleSerialData);

        //function _handleSerialData($evt, port, data){
        //    if(that.address.localeCompare(port) == 0 ) {
        //        that.trigger("data", data);
        //    }
        //}
    }

    EventDispatcher.makeEventDispatcher(SerialPort.prototype);

    /**
     * Opens the connection to serial port, only if connection is not already opened
     *
     * @return {jQuery.Promise} this promise resolve true when the serial port is opened or reject an error.
     */
    SerialPort.prototype.open = function(){
        var $deferred = $.Deferred(),
            that = this;

        serialDomain.exec("isOpen", that.address)
            .done( function(status){
                if(status){
                    $deferred.resolve(status);
                }
                else{
                    serialDomain.exec("open", that.address)
                        .done( function(result){
                            $deferred.resolve(true);
                        })
                        .fail(function(error) {
                            $deferred.reject(error);
                        });
                }
            })
            .fail(function(error) {
                $deferred.reject(error);
            });

        return $deferred.promise();
    };

    /**
     * Closes the connection to the serial port
     *
     * @return {promise}
     */
    SerialPort.prototype.close = function(){
        var $deferred = $.Deferred();
        serialDomain.exec("close", this.address)
            .done( function(result){
                $deferred.resolve(result);
            })
            .fail(function(error) {
                $deferred.reject(error);
            });

        serialDomain.off("data");       //remove listener between this and node domain
        this.off("data");               //remove listeners between this and user space
        return $deferred.promise();
    };

    /**
     * Sends message trough the serial connection
     *
     * @param {String} message The message to transmit via serial connection
     */
    SerialPort.prototype.write = function(message){
        var $deferred = $.Deferred();
        if(message) {
            serialDomain.exec("write", this.address, message)
                .done( function(result){
                    $deferred.resolve(result);
                })
                .fail(function(error) {
                    $deferred.reject(error);
                });
        }
        else{
            //TODO locate this message
            $deferred.reject("Empty message");
        }
        return $deferred.promise();
    };

    /**
     * Says if the connection is open
     *
     * @return {promise}
     */
    SerialPort.prototype.isOpen = function(){
        var $deferred = $.Deferred();
        serialDomain.exec("isOpen", this.address)
            .done( function(status){
                $deferred.resolve(status);
            })
            .fail(function(err) {
                $deferred.reject(err);
            });
        return $deferred.promise();
    };

    // Public API
    exports.SerialPort = SerialPort;
});
