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
 * date:        29 Sep 2015
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
(function () {
    "use strict";

    var Serial  = require('serialport');

    var domainName = "arduino-serial-domain",
        dManager;

    var serialPorts = [];

    function create(port, rate) {
        var opts = {
            parser: Serial.parsers.readline("\n"),
            baudRate: rate
        };

        if(!serialPorts[port] || serialPorts[port] === undefined ){
            //TODO: check in list if port passed exists, if not exists do not push sp into SerialPorts Array. Use serialport functions to list serial ports.
            //Serial.list(function (err, ports) {
            //    ports.forEach(function(port) {
                    //if( port.comName == args.port ) {
            serialPorts[port] = new Serial.SerialPort(port, opts, false);
                    //}
                //});
            //});
        }
    }

    function open(port, callback) {
        if(!!serialPorts[port]) {
            if (!serialPorts[port].isOpen()) {
                serialPorts[port].open(function (error) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        serialPorts[port].on('data', function (data) {
                            dManager.emitEvent(domainName, "data", [port, data]);
                            serialPorts[port].flush(function (err, results) {
                            });
                        });
                        callback(null, true/*SerialPorts[port].path + " opened."*/);
                    }
                });
            }
            else{
                callback(null, true); //already opened
            }
        }
        else{
            callback("Cannot open " + port + ". Try to create it before open.");
        }
    }

    function close(port, callback) {
        if (!!serialPorts[port]) {
            serialPorts[port].close(function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, true/*SerialPorts[port].path + " closed."*/);
                }
            });
        }
        else {
            callback("Cannot close " + port + ". Try to create it before close.");
        }
    }

    function write(port, buffer, callback){
        if (!!serialPorts[port]) {
            if (serialPorts[port].isOpen()) {
                serialPorts[port].write(buffer, function (error) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        serialPorts[port].drain(callback(null, true));
                    }
                });
            }
            else {
                callback("Cannot write to " + port + ". Try to open it before write.");
            }
        }
        else {
            callback("Cannot write to " + port + ". Try to create and open it before write.");
        }
    }

    function isOpen(port) {
        if (!!serialPorts[port]) {
            if (serialPorts[port]) {
                return serialPorts[port].isOpen();
            }
            else {
                return false;
            }
        }
        else {
            //callback("Cannot check " + port + ". Try to create it before check.");
            return false;
        }
    }

    function init(domainManager) {
        if (!domainManager.hasDomain(domainName)) {
            domainManager.registerDomain(domainName, {major: 0, minor: 1});
        }
        dManager = domainManager;
        /**
         * Create: Creates a Serial Port instance
         */
        dManager.registerCommand(
            domainName,
            "create",
            create,
            false,
            "Create serial port instance",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            },
             {	name:"rate",
                type:"int",
                description:"Baud rate"
            }]
        );

        /**
         * Open: Opens Serial Port connection
         */
        dManager.registerCommand(
            domainName,
            "open",
            open,
            true,
            "Open serial communication",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            }]
        );

        /**
         * Close: Closes Serial Port connection
         */
        dManager.registerCommand(
            domainName,
            "close",
            close,
            true,
            "Close serial communication",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            }]
        );

        /**
         * Write: Writes data to Serial Port connection
         */
        dManager.registerCommand(
            domainName,
            "write",
            write,
            true,
            "Write data to serial port",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            },
            {
                name:"buffer",
                type:"string",
                description:"data buffer to transmit"
            }]
        );

        /**
         * isOpen: check if Serial Port connection is opened or closed
         */
        dManager.registerCommand(
            domainName,
            "isOpen",
            isOpen,
            false,
            "Check if Serial Port connection is opened or closed",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            }],
            [{
                name:"status",
                type:"boolean",
                description:"Status of Serial Port"
            }]
        );

        /**
         * Event Data: this event is used to bring back to AS, data from the serial port
         */
        dManager.registerEvent(
            domainName,
            "data",
            [{	name:"port",
                type:"string",
                description:"Number of port"
            },{	name:"data",
                type:"string",
                description:"Data from board serial port"
            }]
        );
    }

    exports.init = init;

}());

