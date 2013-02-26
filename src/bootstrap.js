/**
 * Copyright 2013 Jorge Villalobos
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;

function install(aData, aReason) {}

function uninstall(aData, aReason) {}

function startup(aData, aReason) {
  RestoreBookmarkKey.init();
}

function shutdown(aData, aReason) {
  RestoreBookmarkKey.uninit();
}

let RestoreBookmarkKey = {
  windowListener :
    {
      setKey : function(aWindow) {
        aWindow.document.getElementById("addBookmarkAsKb").setAttribute("key", "b");
      },

      resetKey : function(aWindow) {
        aWindow.document.getElementById("addBookmarkAsKb").setAttribute("key", "d");
      },

      onOpenWindow : function(xulWindow) {
        // A new window has opened.
        let that = this;
        let domWindow =
          xulWindow.QueryInterface(Ci.nsIInterfaceRequestor).
          getInterface(Ci.nsIDOMWindow);

        // Wait for it to finish loading
        domWindow.addEventListener(
          "load",
          function listener() {
            domWindow.removeEventListener("load", listener, false);
            // If this is a browser window then setup its UI
            if (domWindow.document.documentElement.getAttribute("windowtype") ==
                "navigator:browser") {
              that.setKey(domWindow);
            }
        }, false);
      },
      onCloseWindow : function(xulwindow) {},
      onWindowTitleChange: function(xulWindow, newTitle) {}
    },

  init : function() {
    let wm =
      Cc["@mozilla.org/appshell/window-mediator;1"].
        getService(Ci.nsIWindowMediator);
    let enumerator = wm.getEnumerator("navigator:browser");

    while (enumerator.hasMoreElements()) {
      this.windowListener.setKey(enumerator.getNext());
    }

    wm.addListener(this.windowListener);
  },

  uninit : function() {
    let wm =
      Cc["@mozilla.org/appshell/window-mediator;1"].
        getService(Ci.nsIWindowMediator);
    let enumerator = wm.getEnumerator("navigator:browser");

    wm.removeListener(this.windowListener);

    while (enumerator.hasMoreElements()) {
      this.windowListener.resetKey(enumerator.getNext());
    }
  }
};
