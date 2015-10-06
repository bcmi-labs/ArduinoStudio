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


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */

define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var NodeDomain          = require("utils/NodeDomain"),
        FileUtils           = require("file/FileUtils");
        //EventDispatcher     = require("utils/EventDispatcher");


    var domainPath = FileUtils.getNativeBracketsDirectoryPath() + "/" + FileUtils.getNativeModuleDirectoryPath(module) + "/node/DiscoveryDomain";
    var discoveryDomain = new NodeDomain("arduino-discovery-domain", domainPath);

    //EventDispatcher.makeEventDispatcher(exports);

    //TODO: verify the name of the boards by vid and pid (serial) and other mechanism (network)

    /**
     * Gets all the detected serial ports
     * @param {jQuery.Promise} resolve with an array of the detected serial ports
     */
    var getSerialPorts = function(){
        var $deferred = $.Deferred();
        discoveryDomain.exec("serialDiscover")
            .done( function(list){
                $deferred.resolve(list);
            })
            .fail(function(error) {
                $deferred.reject(error);
            });
        return $deferred.promise();
    };

    /**
     * Gets all the detected boards over the network
     * @param {jQuery.Promise} resolve with an array of the detected boards
     */
    var getNetworkPorts = function(){
        var $deferred = $.Deferred();
        discoveryDomain.exec("netoworkDiscover")
            .done( function(list){
                $deferred.resolve(list);
            })
            .fail(function(error) {
                $deferred.reject(error);
            });
        return $deferred.promise();
    };

    // Define public API
    exports.getSerialPorts = getSerialPorts;
    exports.getNetworkPorts = getNetworkPorts;
});
