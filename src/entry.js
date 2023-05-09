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
        // internet explorer, start with feature detection since it doesn't have String.matchAll()
        let match = navigator.userAgent.toLowerCase().match(/(msie|trident(?=\/))\/?\s*(\d+)/);
        if(match[1] === "msie") {
            browser.isIE = true;
            browser.ie = browser.ieVersion = parseInt(match[2]);
        } else if(match[1] === "trident") {
            browser.isIE = true;
            browser.ie = browser.ieVersion = parseInt(ua.split('rv:')[1]);
        }
    } else {
        let matchAll = navigator.userAgent.toLowerCase().matchAll(/(chrome|crios|firefox|fxios|safari|opera|opr|edge|edg|edga|edgios|brave|samsungbrowser|ucbrowser|yabrowser|qihu|qqbrowser|mqqbrowser|instabridge|vivaldi|coc_coc_browser|whale|puffin|sleipnir|silk|qtwebengine(?=\/))\/?\s*(\d+)/g), 
            match = matchAll.next(), 
            matches = {};
        while(!match.done) {
            browser[match.value[1]] = parseInt(match.value[2]);
            match = matchAll.next();
        }
        // order kinda matters here, start with ultra-specific
        // samsung devices
        if(browser.samsungbrowser) {
            browser.samsung = browser.samsungbrowser;
            delete browser.samsungbrowser;
            browser.isSamsungInternet = true;
        // amazon devices
        } else if(browser.silk) {
            browser.isSilk = true;
        // china
        } else if(browser.ucbrowser) {
            browser.isUCBrowser = true;
        } else if(browser.qihu) {
            browser.qihu = 0;  // not really a version number, just "QIHU 360SE" suffix
            browser.is360SecureBrowser = true;
        } else if(browser.qqbrowser || browser.mqqbrowser) {
            if(!browser.qqbrowser) {
                browser.qqbrowser = browser.mqqbrowser;
                delete browser.mqqbrowser;
            }
            browser.isQQBrowser = true;
        // russia
        } else if(browser.yabrowser) {
            browser.yandex = browser.yabrowser;
            delete browser.yabrowser;
            browser.isYandex = true;
        // vietnam
        } else if(browser.coc_coc_browser) {
            browser.isCocCoc = true;
        // korea
        } else if(browser.whale) {
            browser.isWhale = true;
        // japan
        } else if(browser.sleipnir) {
            browser.isSleipnir = true;
        // odd-balls that have some market-share, albeit tiny
        } else if(browser.instabridge) {
            browser.isInstabridge = true;
        } else if(browser.puffin) {
            browser.isPuffin = true;
        } else if(browser.vivaldi) {
            browser.isVivaldi = true;
        } else if(browser.qtwebengine) {
            browser.isQtWebEngine = true;
        // the new internet explorer
        } else if(browser.safari) {
            browser.isSafari = true;
        // major browsers
        } else if(browser.opera || browser.opr) {
            if(!browser.opera) {
                browser.opera = browser.opr;
                delete browser.opr;
            }
            browser.isOpera = true;
        } else if(browser.edg || browser.edge || browser.edga) {
            if(!browser.edge) {
                browser.edge = browser.edg || browser.edga;
                if(browser.edg) delete browser.edg;
                if(browser.edga) delete browser.edga;
            }
            browser.isEdge = true;
        } else if(browser.firefox) {
            browser.isFirefox = true;
        } else if(browser.brave) {
            browser.isBrave = true;
        } else if(browser.chrome) {
            browser.isChrome = true;
        }
    }
    window.browser = window.browserType = browser;
}

ui.getElementList = common.getElementList;
common.ui = ui;

export default common;