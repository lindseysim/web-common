function _copy_(obj, extend, overwrite, fcopy) {
    for(let key in extend) {
        if(!(key in obj)) {
            obj[key] = fcopy(extend[key]);
        } else if(Object.isObjectLiteral(obj[key]) && Object.isObjectLiteral(extend[key])) {
            _copy_(obj[key], extend[key], overwrite, fcopy);
        } else if(overwrite) {
            obj[key] = fcopy(extend[key]);
        }
    }
    return obj;
}

export default {

    getElement(element) {
        if(!element) return undefined;
        if(typeof element === "string") {
            return document.querySelector(element);
        }
        if(typeof jQuery !== "undefined" && element instanceof jQuery) {
            let get = element.get();
            return get.length ? get[0] : undefined;
        }
        if(element[Symbol.iterator] === "function") {
            if(Array.isArray(element)) {
                return element.find(i => i instanceof Element);
            }
            let next = element.next();
            while(!next.done) {
                if(next.value instanceof Element) return next.value;
                next = element.next();
            }
            return next.done ? undefined : next.value;
        }
        return element instanceof Element ? element : null;
    }, 

    getElementList(input) {
        if(!input) return [];
        if(typeof input === "string") {
            return Array.from(document.querySelectorAll(input));
        }
        if(input[Symbol.iterator] === "function") {
            return (Array.isArray(input) ? input : Array.from(input))
                filter(o => o instanceof Element);
        }
        if(typeof jQuery !== "undefined" && input instanceof jQuery) {
            return input.get();
        }
        return input instanceof Element ? [input] : [];
    }, 

    extend(obj, extend, overwrite, deep, modify) {
        if(Object.isObjectLiteral(overwrite)) {
            if(typeof deep === "undefined") deep = overwrite.deep || overwrite.deepCopy;
            if(typeof modify === "undefined") modify = overwrite.modify || overwrite.modifyObj;
            overwrite = overwrite.overwrite || overwrite.allowOverwrite;
        }
        let fcopy;
        if(!deep) {
            fcopy = input => input;
        } else if(structuredClone && typeof structuredClone === "function") {
            fcopy = structuredClone;
        } else {
            fcopy = input => JSON.parse(JSON.stringify(input));
        }
        if(!extend) return modify ? obj : fcopy(obj);
        if(!obj) return fcopy(extend);
        let clone = modify ? obj : _copy_({}, obj, true, fcopy);
        return _copy_(modify, extend, overwrite, fcopy);
    }, 
    
    getUrlGetVars() {
        var vars = {};
        window.location.href.replace(
            /[?&]+([^=&]+)=([^&]*)/gi, 
            (m,key,value) => { vars[key] = value; }
        );
        return vars;
    }, 

    newWindow(url, options) {
        if(!options || !Object.isObject(options)) {
            throw "Invalid parameters. May be using deprecated version of this function. See https://github.com/lawrencesim/web-common#common-newWindow";
        }
        // defaults
        options.width  = options.width || 600;
        options.height = options.height || 400;
        options.name   = options.name || "NewWindow";
        // center window, from http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
        // Fixes dual-screen position                          Most browsers       Firefox
        let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left, 
            dualScreenTop  = window.screenTop  !== undefined ? window.screenTop  : screen.top, 
            winWidth  = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width, 
            winHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height, 
            left = dualScreenLeft + 0.5*(winWidth - options.width), 
            top  = dualScreenTop  + 0.5*(winHeight - options.height), 
            winoptions = {width: options.width, height: options.height, left: left, top: top};
        if(minimal) winoptions.popup = 1;
        winoptions =  options.options && this.extend(winoptions, options.options, {overwrite: true, modify: true});
        let winoptionsArr = [];
        for(let key in winoptions) {
            winoptionsArr.push(`${key}=${winoptions[key]}`);
        }
        var newWin = window.open(
            url, 
            String(options.name).replace(/\s/g,''), 
            winoptionsArr.join(", ")
        );
        if(!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            options.error && typeof options.error === "function" && options.error(newWin);
        } else {
            newWin && newWin.focus();
        }
        return newWin;
    }, 

    // note, we could update this to use fetch() API, but at that point, easier to just use fetch API
    ajax(params) {
        if(!params)          params = {};
        if(!params.url)      throw "No URL provided";
        if(!params.method)   params.method = "GET";
        if(!params.dataType) params.dataType = "";
        if(!params.async)    params.async = true;
        if(!params.success)  params.success = () => {};
        if(!params.error)    params.error = () => {};

        var complete = (resolve, xhr, statusText) => {
            try {
                if(params.complete) params.complete(xhr, statusText);
            } finally {
                if(resolve) resolve();
            }
        };

        let reqParams = null;
        if(params.data) {
            if(!params.url.endsWith("?")) params.url += "?";
            let strParams = [];
            for(let key in params.data) {
                strParams.push(encodeURI(key + '=' + params.data[key]));
            }
            reqParams = strParams.join("&");
        }
        let methodIsPost = params.method.toUpperCase() === "POST";
        if(!methodIsPost && reqParams) {
            if(!params.url.endsWith("?")) params.url += "?";
            params.url += reqParams;
        }

        var xhr = new XMLHttpRequest(), 
            responseType = params.dataType.toLowerCase();
        // NOTE: json response type not supported in IE, Edge, or Opera
        if(responseType !== "json") xhr.responseType = params.dataType;
        var onReadyStateChange = resolve => {
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200) {
                var res = xhr.responseText;
                if(responseType === "json") {
                    try {
                        res = JSON.parse(res);
                    } catch(e) {
                        params.error(xhr, xhr.statusText, xhr.responseText);
                    }
                    params.success(res, xhr.statusText, xhr);
                } else {
                    params.success(res, xhr.statusText, xhr);
                }
            } else {
                params.error(xhr, xhr.statusText, xhr.responseText);
            }
            complete(resolve, xhr, xhr.statusText);
        };
        var finishXHR = resolve => {
            xhr.onreadystatechange = evt => onReadyStateChange(resolve);
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
        };
        if(params.promise) {
            return new (Promise || require('promise-polyfill').default)(finishXHR);
        }
        finishXHR();
        return xhr;
    }, 

    animate(element, properties, duration, options) {
        let el = this.getElement(element);
        if(el) {
            element = el;
            if(options && Object.isObject(options)) {
                // f(element, properties, duration, options)
                options.duration = duration;
            } else if(duration && Object.isObject(duration)) {
                // f(element, properties, options)
                options = duration;
            } else if(typeof duration === "number") {
                // f(element, properties, duration)
                options = {duration: duration};
            } else if(Object.isObject(properties) && properties.properties) {
                // f(element, options)
                options = properties;
                properties = options.properties;
            } else if(!options && !duration) {
                // f(element, properties)
                options = {};
            } else {
                throw "Invalid parameters. May be using deprecated version of this function. See https://github.com/lawrencesim/web-common#common-animate";
            }
        } else if(Object.isObject(element) && element.element) {
            // f(options)
            options = element;
            properties = options.properties;
            element = this.getElement(options.element);
            if(!element) return;
        }
        if(!Object.isObject(properties)) {
            throw "Invalid parameters. May be using deprecated version of this function. See https://github.com/lawrencesim/web-common#common-animate";
        }
        let timingFunction = options.timing || options.timingFunction || "ease", 
            durationMs = options.duration;
        if(!durationMs && durationMs !== 0) durationMs = options.durationMs;
        if(!durationMs) durationMs = 0;
        if(typeof durationMs !== "number") throw "Duration must be specified as numeric type in milliseconds.";
        let durationSecs = durationMs*0.001 + "s", 
            transition = "";
        for(let key in properties) {
            if(transition) transition += ", ";
            transition += `${key} ${durationMs*0.001}s ${timingFunction}`;
        }
        element.css({
            '-webkit-transition': transition, 
            '-moz-transition': transition, 
            transition: transition
        });
        let start = () => element.css(properties), 
            finish = () => {
                element.css({
                    '-webkit-transition': "", 
                    '-moz-transition': "", 
                    transition: ""
                });
                options.complete && options.complete();
            }, 
            delayMs = 5,  // to allow animation threads to async run
            PO;
        try {
            PO = Promise || require('promise-polyfill').default;
        } catch { /* nothing */ }
        if(!PO) {
            window.setTimeout(
                () => start() && window.setTimeout(finish, durationMs+delayMs), 
                delayMs
            );
        }
        return new PO(resolve => {
                window.setTimeout(
                    () => start() && resolve(), 
                    delayMs
                );
            })
            .then(() => {
                return new PO(resolve => {
                    window.setTimeout(
                        () => finish() && resolve(), 
                        durationMs+delayMs
                    );
                });
            });
    }
    
};
