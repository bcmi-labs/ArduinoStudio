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
 * date:        05 Oct 2015
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, node: true */
(function () {
    "use strict";

    var DiscoverySerial = require("./DiscoverySerial");

    var domainName = "arduino-discovery-domain",
        dManager;

    //The boardport object.... should be improve as a 'class' with encapusalation
    //	{
    //		address : "/dev/tty.usbmodem1421",   (or "192.168.1.100")	//comunication info
    //		name    : "Arduino Magic Board",							//name of the board
    //		vid     : "0x2a03",											//vendor id
    //		pid     : "0x1234",											//product id
    //		label   : "/dev/tty.usbmodem1421 - Arduino Magic Board",	//presentation name
    //		protocol: "serial" (or network)								//communication protocol
    //		manufacturer : "Arduino Srl"								//manufacturer name
    //	}


    /**
     * get the list of board connected by usb
     * @param  {Function} callback [description]
     */
    function serialDiscover(callback){
        DiscoverySerial.list(function(err, list){
            callback(err, list);
        });
    }

    /**
     * get the list of board connected over the network
     * @param  {Function} callback [description]
     */
    function networkDiscover(callback){
        //TODO
        var networkPortList = [];
        callback(null, networkPortList);
    }


    function init(domainManager){
        if(!domainManager.hasDomain( domainName )){
            domainManager.registerDomain( domainName, {major: 0, minor: 1});
        }
        dManager = domainManager;

        dManager.registerCommand(
            domainName,
            "serialDiscover",
            serialDiscover,
            true,
            "Get all the 'serial' ports"
        );

        dManager.registerCommand(
            domainName,
            "networkDiscover",
            networkDiscover,
            true,
            "Get all the 'netowrked' boards"
        );
    }

    exports.init = init;
}());