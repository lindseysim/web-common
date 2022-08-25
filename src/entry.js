import polyfills   from "./ie-is-special.js";
import extensions  from "./extensions.js";
import common      from "./common.js";
import ui          from "./common.ui.js";

//****************************************************************************************************
// Misc. Globals
//****************************************************************************************************
if(navigator && window) {
    // note, none of these browser checks are future-proof, periodically update as necessary
    var browser = {};
    if(!String.prototype.matchAll) {
        let match = navigator.userAgent.toLowerCase().match(/(msie|trident(?=\/))\/?\s*(\d+)/);
        if(match[1] === "msie") {
            browser.isIE = true;
            browser.ie = browser.ieVersion = parseInt(match[2]);
        } else if(match[1] === "trident") {
            browser.isIE = true;
            browser.ie = browser.ieVersion = parseInt(ua.split('rv:')[1]);
        }
    } else {
        let matchAll = navigator.userAgent.toLowerCase().matchAll(/(chrome|firefox|safari|opera|opr|edge|edg|brave|samsungbrowser|ucbrowser|yabrowser|qtwebengine(?=\/))\/?\s*(\d+)/g), 
            match = matchAll.next(), 
            matches = {};
        while(!match.done) {
            browser[match.value[1]] = parseInt(match.value[2]);
            match = matchAll.next();
        }
    }
    // order matters here
    if(browser.samsungbrowser) {
        browser.samsung = browser.samsungbrowser;
        delete browser.samsungbrowser;
        browser.isSamsungInternet = true;
    } else if(browser.ucbrowser) {
        browser.isUCBrowser = true;
    } else if(browser.yabrowser) {
        browser.yandex = browser.yabrowser;
        delete browser.yabrowser;
        browser.isYandex = true;
    } else if(browser.qtwebengine) {
        browser.isQtWebEngine = true;
    } else if(browser.opera || browser.opr) {
        if(!browser.opera) {
            browser.opera = browser.opr;
            delete browser.opr;
        }
        browser.isOpera = true;
    } else if(browser.edg || browser.edge) {
        if(!browser.edge) {
            browser.edge = browser.edg;
            delete browser.edg;
        }
        browser.isEdge = true;
    } else if(browser.brave) {
        browser.isBrave = true;
    } else if(browser.chrome) {
        browser.isChrome = true;
    } else if(browser.safari) {
        browser.isSafari = true;
    } else if(browser.firefox) {
        browser.isFirefox = true;
    }
    window.browser = window.browserType = browser;
}

ui.getElementList = common.getElementList;
common.ui = ui;

export default common;