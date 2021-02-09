export default {

    getElement: function(element) {
        if(!element) return null;
        if(typeof element === "string") {
            return document.querySelector(element);
        }
        if(typeof jQuery !== "undefined" && element instanceof jQuery) {
            var get = element.get();
            return get.length ? get[0] : null;
        }
        if(element[Symbol.iterator] === "function") {
            var next = element.next();
            return next.done ? null : next.value;
        }
        return element;
    }, 

    getElementList: function(element) {
        if(!element) return [];
        if(typeof element === "string") {
            return document.querySelectorAll(element);
        }
        if(typeof jQuery !== "undefined" && element instanceof jQuery) {
            return element.get();
        }
        if(element[Symbol.iterator] === "function") {
            return Array.from(element);
        }
        return [element];
    }, 

    extend: function(obj, extend, allowOverwrite, deepCopy) {
        if(!extend) return !deepCopy ? obj : JSON.parse(JSON.stringify(obj));
        if(!obj) return !deepCopy ? extend : JSON.parse(JSON.stringify(extend));
        var clone = {};
        for(var key in obj) {
            clone[key] = !deepCopy ? obj[key] : JSON.parse(JSON.stringify(obj[key]));
        }
        for(var key in extend) {
            if(allowOverwrite || !(key in clone)) {
                clone[key] = !deepCopy ? extend[key] : JSON.parse(JSON.stringify(extend[key]));
            }
        }
        return clone;
    }, 
    
    getUrlGetVars: function() {
        var vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }, 

    newWindow: function(url, name, width, height, minimal) {
        // center window, from http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
        // Fixes dual-screen position                          Most browsers       Firefox
        let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left, 
            dualScreenTop  = window.screenTop  !== undefined ? window.screenTop  : screen.top, 
            winWidth  = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width, 
            winHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height, 
            left = dualScreenLeft + 0.5*(winWidth - width), 
            top  = dualScreenTop  + 0.5*(winHeight - height), 
            options = "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top;
        if(minimal) options += ", toolbar=no, menubar=no, status=no, location=no";
        var newWin = window.open(url, '', options);
        if(!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            alert("Could not open new window, to view '" + name + "' allow an exception for this domain in your pop-up blocker's settings.");
        } else {
            if(newWin) newWin.focus();
            return newWin;
        }
    }, 

    ajax: function(params) {
        if(!params)          params = {};
        if(!params.url)      throw "No URL provided";
        if(!params.method)   params.method = "GET";
        if(!params.dataType) params.dataType = "";
        if(!params.async)    params.async = true;
        if(!params.success)  params.success = () => {};
        if(!params.error)    params.error = () => {};

        var complete = function(resolve, xhr, statusText) {
            try {
                if(params.complete) params.complete(xhr, statusText);
            } finally {
                if(resolve) resolve();
            }
        };

        let reqParams = "", 
            methodIsPost = params.method.toUpperCase() === "POST";
        if(params.data) {
            let first = true;
            if(!params.url.endsWith("?")) reqParams += "?";
            for(let key in params.data) {
                if(first) {
                    reqParams += "&";
                } else {
                    first = false;
                }
                reqParams += encodeURI(key + '=' + params.data[key]);
            }
            params.url += reqParams;
        }

        var xhr = new XMLHttpRequest();
        // json response type not supported in IE, Edge, or Opera
        var responseType = params.dataType.toLowerCase();
        if(responseType !== "json") xhr.responseType = params.dataType;
        var onReadyStateChange = resolve => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    var res = xhr.responseText;
                    if(responseType === "json") {
                        try {
                            params.success(JSON.parse(res), xhr.statusText, xhr);
                        } catch(e) {
                            params.error(xhr, xhr.statusText, xhr.responseText);
                        }
                    } else {
                        params.success(res, xhr.statusText, xhr);
                    }
                } else {
                    params.error(xhr, xhr.statusText, xhr.responseText);
                }
                complete(resolve, xhr, xhr.statusText);
            }
        };
        if(params.promise) {
            return new (Promise || require('promise-polyfill').default)(resolve => {
                xhr.onreadystatechange = onReadyStateChange.bind(resolve);
                xhr.open(
                    params.method, 
                    params.url, 
                    params.async, 
                    params.user, 
                    params.password
                );
                if(methodIsPost) {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.send(reqParams);
                } else {
                    xhr.send();
                }
            });
        } else {
            xhr.onreadystatechange = onReadyStateChange.bind(null);
            xhr.open(
                params.method, 
                params.url, 
                params.async, 
                params.user, 
                params.password
            );
            if(methodIsPost) {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.send(reqParams);
            } else {
                xhr.send();
            }
            return xhr;
        }
    }, 

    animate: function(element, properties, durationMs, timingFunction, complete) {
        if(typeof durationMs !== "number") throw "Duration must be specified as numeric type in milliseconds.";
        let durationSecs = durationMs*0.001 + "s", 
            transition = "";
        for(let key in properties) {
            if(transition) transition += ", ";
            transition += key + " " + durationSecs + " " + (timingFunction || "ease");
        }
        element.css({
            '-webkit-transition': transition, 
            '-moz-transition': transition, 
            'transition': transition
        });
        var PO = Promise || require('promise-polyfill').default, 
            delayMs = 5;
        return new PO(resolve => {
            window.setTimeout(() => {
                element.css(properties);
                resolve();
            }, delayMs);
        }).then(() => {
            return new PO(resolve => {
                window.setTimeout(() => {
                    element.css({
                        '-webkit-transition': "", 
                        '-moz-transition': "", 
                        'transition': ""
                    });
                    if(complete) complete();
                    resolve();
                }, durationMs+delayMs);
            });
        });
    }
    
};
