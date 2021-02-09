import polyfills   from "./ie-is-special.js";
import extensions  from "./extensions.js";
import common      from "./common.js";
import ui          from "./common.ui.js";

//****************************************************************************************************
// Misc. Globals
//****************************************************************************************************
if(navigator) {
    // note, none of these browser checks are future-proof, periodically update as necessary
    var browser = {};
    if(!String.prototype.matchAll) {
        let match = navigator.userAgent.toLowerCase().match(/(msie|trident(?=\/))\/?\s*(\d+)/);
        if(match[1] === "msie") {
            browser.isIE = true;
            browser.ieVersion = parseInt(match[2]);
            browser.ie = browser.ieVersion;
        } else if(match[1] === "trident") {
            browser.isIE = true;
            browser.ieVersion = parseInt(ua.split('rv:')[1]);
            browser.ie = browser.ieVersion;
        }
    } else {
        let matchAll = navigator.userAgent.toLowerCase().matchAll(/(opera|chrome|safari|firefox|msie|trident|edge|edg(?=\/))\/?\s*(\d+)/g), 
            match = matchAll.next(), 
            matches = {};
        while(!match.done) {
            browser[match.value[1]] = parseInt(match.value[2]);
            match = matchAll.next();
        }
    }
    if(browser.opera || browser.opr) {
        if(!browser.opera) browser.opera = browser.opr;
        delete browser.opr;
        browser.isOpera = true;
    } else if(browser.edg || browser.edge) {
        if(!browser.edge) browser.edge = browser.edg;
        delete browser.edg;
        browser.isEdge = true;
    } else if(browser.chrome) {
        browser.isChrome = true;
    } else if(browser.safari) {
        browser.isSafari = true;
    } else if(browser.firefox) {
        browser.isFirefox = true;
    }
    if(window) window.browser = window.browserType = browser;
}

ui.getElementList = common.getElementList;
common.ui = ui;

export default common;