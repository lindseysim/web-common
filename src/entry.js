import polyfills  from "./ie-is-special.js";
import extensions from "./extensions.js";
import common     from "./common.js";
import commonUI   from "./common.ui.js";

//****************************************************************************************************
// Misc. Globals
//****************************************************************************************************
// note, none of these browser checks are future-proof, periodically update as necessary
window.browser = window.browserType = {};
window.browser.isOpera   = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
window.browser.isFirefox = typeof InstallTrigger !== 'undefined';
window.browser.isSafari  = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
window.browser.isChrome  = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
window.browser.isIE      = /*@cc_on!@*/false || !!document.documentMode;
window.browser.isEdge    = !window.browser.isIE && !!window.StyleMedia;
var ua = navigator.userAgent.toLowerCase();
if(window.browser.isIE) {
    if(ua.indexOf('msie') >= 0) {
        window.browser.ieVersion = parseInt(ua.split('msie')[1]);
    } else if(ua.indexOf('trident/') >= 0) {
        window.browser.ieVersion = parseInt(ua.split('rv:')[1]);
    } else {
        window.browser.ieVersion = 9999;
    }
} else if(window.browser.isEdge) {
    var match = ua.match(/edge\/([0-9]+)\./);
    window.browser.edgeVersion = match ? parseInt(match[1]) : 9999;
} else if(window.browser.isChrome) {
    var match = ua.match(/chrom(e|ium)\/([0-9]+)\./);
    window.browser.chromeVersion = match ? parseInt(match[2]) : 9999;
} else if(window.browser.isFirefox) {
    var match = ua.match(/firefox\/([0-9]+)\./);
    window.browser.firefoxVersion = match ? parseInt(match[1]) : 9999;
} else if(window.browser.isSafari) {
    var match = ua.match(/safari\/([0-9]+)\./);
    window.browser.safariVersion = match ? parseInt(match[1]) : 9999;
} else if(window.browser.isOpera) {
    var match = ua.match(/opera|opr\/([0-9]+)\./);
    window.browser.operaVersion = match ? parseInt(match[1]) : 9999;
}

commonUI.getElementList = common.getElementList;
common.ui = commonUI;

export default common;