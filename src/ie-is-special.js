!function(root, factory) {
    // CommonJS-based (e.g. NodeJS) API
    if(typeof module === "object" && module.exports) {
        module.exports = factory();
    // AMD-based (e.g. RequireJS) API
    } else if(typeof define === "function" && define.amd) {
        define(factory);
    // Regular instantiation 
    } else {
        root.CommonTable = factory();
    }
}(this, function() {
    "use strict";
    
    // Element.remove()
    if(!Element.prototype.remove) {
        Element.prototype.remove = function() {
            if(this.parentNode) {
                this.parentNode.removeChild(this);
            } else {
                this.removeNode();
            }
        };
    }
    
    // Element.prepend() https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
    (function(arr) {
        arr.forEach(function(item) {
            if(item.hasOwnProperty('prepend')) return;
            Object.defineProperty(item, 'prepend', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function prepend() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();
                    argArr.forEach(function(argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });
                    this.insertBefore(docFrag, this.firstChild);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
    
    // classList functions (courtesy of https://github.com/eligrey/classList.js)
    if("document" in self) {
        if(
            !("classList" in document.createElement("_")) 
            || document.createElementNS 
            && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
        ) {
            (function (view) {
                if(!('Element' in view)) return;
                var classListProp = "classList", 
                    protoProp = "prototype", 
                    elemCtrProto = view.Element[protoProp], 
                    objCtr = Object, 
                    strTrim = String[protoProp].trim || function () {
                        return this.replace(/^\s+|\s+$/g, "");
                    }, 
                    arrIndexOf = Array[protoProp].indexOf || function (item) {
                        var i = 0, len = this.length;
                        for(; i < len; i++) {
                            if(i in this && this[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }, 
                    DOMEx = function(type, message) {
                        this.name = type;
                        this.code = DOMException[type];
                        this.message = message;
                    }, 
                    checkTokenAndGetIndex = function(classList, token) {
                        if(token === "") {
                            throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
                        }
                        if(/\s/.test(token)) {
                            throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
                        }
                        return arrIndexOf.call(classList, token);
                    }, 
                    ClassList = function(elem) {
                        var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""), 
                            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [], 
                            i = 0, 
                            len = classes.length;
                        for(; i < len; i++) this.push(classes[i]);
                        this._updateClassName = function (){
                            elem.setAttribute("class", this.toString());
                        };
                    }, 
                    classListProto = ClassList[protoProp] = [], 
                    classListGetter = function () { return new ClassList(this); };
                DOMEx[protoProp] = Error[protoProp];
                classListProto.item = function(i) {
                    return this[i] || null;
                };
                classListProto.contains = function(token) {
                    return ~checkTokenAndGetIndex(this, token + "");
                };
                classListProto.add = function() {
                    var tokens = arguments, 
                        i = 0, 
                        l = tokens.length, 
                        token, 
                        updated = false;
                    do {
                        token = tokens[i] + "";
                        if(!~checkTokenAndGetIndex(this, token)) {
                            this.push(token);
                            updated = true;
                        }
                    }
                    while(++i < l);
                    if(updated) this._updateClassName();
                };
                classListProto.remove = function() {
                    var tokens = arguments, 
                        i = 0, 
                        l = tokens.length, 
                        token, 
                        updated = false, 
                        index;
                    do {
                        token = tokens[i] + "";
                        index = checkTokenAndGetIndex(this, token);
                        while(~index) {
                            this.splice(index, 1);
                            updated = true;
                            index = checkTokenAndGetIndex(this, token);
                        }
                    }
                    while(++i < l);
                    if(updated) this._updateClassName();
                };
                classListProto.toggle = function(token, force) {
                    var result = this.contains(token), 
                        method = result ? force !== true && "remove" : force !== false && "add";
                    if(method) this[method](token);
                    return (force === true || force === false) ? force : !result;
                };
                classListProto.replace = function(token, replacement_token) {
                    var index = checkTokenAndGetIndex(token + "");
                    if(~index) {
                        this.splice(index, 1, replacement_token);
                        this._updateClassName();
                    }
                };
                classListProto.toString = function() {
                    return this.join(" ");
                };
                if(objCtr.defineProperty) {
                    var classListPropDesc = {
                        get: classListGetter, 
                        enumerable: true, 
                        configurable: true
                    };
                    try {
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    } catch(ex) {
                        if(ex.number === undefined || ex.number === -0x7FF5EC54) {
                            classListPropDesc.enumerable = false;
                            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                        }
                    }
                } else if(objCtr[protoProp].__defineGetter__) {
                    elemCtrProto.__defineGetter__(classListProp, classListGetter);
                }
            }(self));
        }
        (function () {
            var testElement = document.createElement("_");
            testElement.classList.add("c1", "c2");
            if(!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];
                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;
                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }
            testElement.classList.toggle("c3", false);
            if(testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;
                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };
            }
            if(!("replace" in document.createElement("_").classList)) {
                DOMTokenList.prototype.replace = function(token, replacement_token) {
                    var tokens = this.toString().split(" "), 
                        index = tokens.indexOf(token + "");
                    if(~index) {
                        tokens = tokens.slice(index);
                        this.remove.apply(this, tokens);
                        this.add(replacement_token);
                        this.add.apply(this, tokens.slice(1));
                    }
                };
            }
            testElement = null;
        }());
    }
    
    // String repeat (modified from MDN)
    if(!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            if(this === null || this === undefined) {
                throw new TypeError("can\"t convert " + this + " to object");
            }
            count = +count;
            if(count !== count) return "";
            count = Math.floor(count);
            if(count === 0) return "";
            if(count <= 0) {
                throw new RangeError("repeat count must be non-negative");
            }
            if(count === Infinity) {
                throw new RangeError("repeat count must be less than infinity");
            }
            var str = "" + this;
            if(str.length === 0) return "";
            if(str.length * count >= 1 << 28) {
                throw new RangeError("repeat count must not overflow maximum string size");
            }
            var rpt = "";
            for(var i = 0; i < count; i++) rpt += str;
            return rpt;
        };
    }
    
    // String startsWith and endsWiths. All credit due to Mathias Bynens <https://mathiasbynens.be/>
    if(!String.prototype.startsWith) {
        (function() {
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {}, 
                        $defineProperty = Object.defineProperty, 
                        result = $defineProperty(object, object, object) && $defineProperty;
                } catch(error) {}
                return result;
            }());
            var toString = {}.toString;
            var startsWith = function(search) {
                if(this == null) {
                    throw TypeError();
                }
                var string = String(this);
                if(search && toString.call(search) == '[object RegExp]') {
                    throw TypeError();
                }
                var stringLength = string.length, 
                    searchString = String(search), 
                    searchLength = searchString.length, 
                    position = arguments.length > 1 ? arguments[1] : undefined;
                // `ToInteger`
                var pos = position ? Number(position) : 0;
                if(pos != pos) { // better `isNaN`
                    pos = 0;
                }
                var start = Math.min(Math.max(pos, 0), stringLength);
                // Avoid the `indexOf` call if no match is possible
                if(searchLength + start > stringLength) {
                    return false;
                }
                var index = -1;
                while(++index < searchLength) {
                    if(string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                        return false;
                    }
                }
                return true;
            };
            if(defineProperty) {
                defineProperty(String.prototype, 'startsWith', {
                    'value': startsWith,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.prototype.startsWith = startsWith;
            }
        }());
    }
    if(!String.prototype.endsWith) {
        (function() {
            var defineProperty = (function() {
                // IE 8 only supports `Object.defineProperty` on DOM elements
                try {
                    var object = {}, 
                        $defineProperty = Object.defineProperty, 
                        result = $defineProperty(object, object, object) && $defineProperty;
                } catch(error) {}
                return result;
            }());
            var toString = {}.toString;
            var endsWith = function(search) {
                if(this == null) {
                    throw TypeError();
                }
                var string = String(this);
                if(search && toString.call(search) == '[object RegExp]') {
                    throw TypeError();
                }
                var stringLength = string.length, 
                    searchString = String(search), 
                    searchLength = searchString.length, 
                    pos = stringLength;
                if(arguments.length > 1) {
                    var position = arguments[1];
                    if(position !== undefined) {
                        // `ToInteger`
                        pos = position ? Number(position) : 0;
                        if (pos != pos) { // better `isNaN`
                            pos = 0;
                        }
                    }
                }
                var end = Math.min(Math.max(pos, 0), stringLength), 
                    start = end - searchLength;
                if(start < 0) {
                    return false;
                }
                var index = -1;
                while(++index < searchLength) {
                    if(string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                        return false;
                    }
                }
                return true;
            };
            if(defineProperty) {
                defineProperty(String.prototype, 'endsWith', {
                    'value': endsWith,
                    'configurable': true,
                    'writable': true
                });
            } else {
                String.prototype.endsWith = endsWith;
            }
        }());
    }
    
    // Technically polyfills but useful additions
    if(!Element.prototype.setAttributes) {
        Element.prototype.setAttributes = function(attrs) {
            for(var key in attrs) {
                this.setAttribute(key, attrs[key]);
            }
        };
    }
    
    if(!Element.prototype.css) {
        Element.prototype.css = function(styles, value) {
            if(style instanceof String && value instanceof String) {
                this.style[style] = value;
            } else {
                for(var key in styles) {
                    this.style[key] = styles[key];
                }
            }
        };
    }
    
});