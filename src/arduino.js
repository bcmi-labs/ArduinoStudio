/*
 * This file is part of Arduino
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"]), to deal
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
 * Copyright 2015 Arduino Srl (http://www.arduino.org/)
 *
 * authors: arduino.org team - support@arduino.org
 *
 */
define(function (require, exports, module) {
    "use strict";

    var AppInit = require("utils/AppInit"),
    	Console = require("arduino/Console"),
    	PreferencesManager = require("preferences/PreferencesManager");
	
    AppInit.appReady(function () {    	
    	$('.toolbar-btn').click(function(evt){
			evt.preventDefault();
			toolbarHandler(this.id);
		});
    });

    

	function toolbarHandler(btnid){
        switch(btnid) {
            /*
            case 'toolbar-verify-btn':
                CommandManager.execute(Commands.FILE_SAVE);
                Dispatcher.trigger("arduino-event-console-clear");
                Dispatcher.trigger('arduino-event-build');
                break;
            case 'toolbar-upload-btn':
                CommandManager.execute(Commands.FILE_SAVE);
                Dispatcher.trigger("arduino-event-console-clear");
                Dispatcher.trigger('arduino-event-upload');
                break;
            case 'toolbar-new-btn':
                CommandManager.execute(Commands.FILE_NEW);
                break;
            case 'toolbar-open-btn':
                CommandManager.execute(Commands.FILE_OPEN);
                break;
            case 'toolbar-save-btn':
                CommandManager.execute(Commands.FILE_SAVE);
                break;
            case 'toolbar-serial-btn':
                Dispatcher.trigger('arduino-event-serialmonitor');
                break;
            */
            case 'toolbar-console-btn':
                Console.toggle();
                console.log(Console.isDisplay());
                break;
            case 'toolbar-toggle-btn':
                if($('#sidebar').is(':visible')){
                    $('#sidebar').hide();
                    $('.main-view .content').css('right', '0px');
                }
                else{
                    $('.main-view .content').css('right', '200px');
                    $('#sidebar').show();
                }
                break;
            default:
                //console.log(btnid+' clicked');
        }
    }
});