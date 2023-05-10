export default (function() {

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
    
    // Element.append() and prepend() https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/
    (function (arr) {
        arr.forEach(function (item) {
            if(item.hasOwnProperty('append')) return;
            Object.defineProperty(item, 'append', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function append() {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();
                argArr.forEach(function(argItem) {
                    docFrag.appendChild(argItem instanceof Node ? argItem : document.createTextNode(String(argItem)));
                });
                this.appendChild(docFrag);
            }
        });
      });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
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
                        docFrag.appendChild(argItem instanceof Node ? argItem : document.createTextNode(String(argItem)));
                    });
                    this.insertBefore(docFrag, this.firstChild);
                }
            });
        });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

    // Element.matches() and Element.closest()
    if(!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if(!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            if(!document.documentElement.contains(el)) return null;
            do {
                if(el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while(el !== null && el.nodeType === 1); 
            return null;
        };
    }
    
    // classList functions (courtesy of https://github.com/eligrey/classList.js)
    if("document" in self) {
        if(
            !("classList" in document.createElement("_")) 
            || document.createElementNS 
            && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
        ) {
            (function (view) {
                "use strict";
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
                            if(i in this && this[i] === item) return i;
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
                    } while(++i < l);
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
                    } while(++i < l);
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
            "use strict";
            var testElement = document.createElement("_");
            testElement.classList.add("c1", "c2");
            if(!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];
                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;
                        for(i = 0; i < len; i++) {
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
    
    // NodeList.forEach
    if(window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    
    // String repeat (modified from MDN)
    if(!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            "use strict";
            if(this === null || this === undefined) {
                throw new TypeError("can\"t convert " + this + " to object");
            }
            count = +count;
            if(count !== count) return "";
            count = Math.floor(count);
            if(count === 0) return "";
            if(count <= 0) throw new RangeError("repeat count must be non-negative");
            if(count === Infinity) throw new RangeError("repeat count must be less than infinity");
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
    
    // String startsWith and endsWith
    if(!String.prototype.startsWith) {
        Object.defineProperty(String.prototype, 'startsWith', {
            value: function(search, pos) {
                pos = !pos || pos < 0 ? 0 : +pos;
                return this.substring(pos, pos + search.length) === search;
            }
        });
    }
    if(!String.prototype.endsWith) {
        Object.defineProperty(String.prototype, 'endsWith', {
            value: function(search, this_len) {
                if (this_len === undefined || this_len > this.length) {
                    this_len = this.length;
                }
                return this.substring(this_len - search.length, this_len) === search;
            }
        });
    }
    
    // Array.find and findLast https://tc39.github.io/ecma262/#sec-array.prototype.find
    if(!Array.prototype.find || !Array.prototype.findIndex) {
        var arrayFind = function(predicate, thisArg, asIndex) {
            if(thisArg === undefined) thisArg = this;
            if(thisArg == null) throw new TypeError('"this" is null or not defined');
            if(typeof predicate !== 'function') throw new TypeError('predicate must be a function');
            var o = Object(thisArg), 
                len = o.length >>> 0, 
                k = 0;
            while(k < len) {
                if(predicate.call(thisArg, o[k], k, o)) {
                    return asIndex ? k : o[k];
                }
                ++k;
            }
            return asIndex ? -1 : undefined;
        }
        if(!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function(callbackFn, thisArg) {
                    return arrayFind(callbackFn, thisArg, false);
                },
                configurable: true,
                writable: true
          });
        }
        if(!Array.prototype.findIndex) {
            Object.defineProperty(Array.prototype, 'findIndex', {
                value: function(callbackFn, thisArg) {
                    return arrayFind(callbackFn, thisArg, true);
                },
                configurable: true,
                writable: true
          });
        }
    }
    if(!Array.prototype.findLast || !Array.prototype.findLastIndex) {
        var arrayFindLast = function(predicate, thisArg, asIndex) {
            if(thisArg === undefined) thisArg = this;
            if(thisArg == null) throw new TypeError('"this" is null or not defined');
            if(typeof predicate !== 'function') throw new TypeError('predicate must be a function');
            var o = Object(thisArg), 
                len = o.length >>> 0, 
                k = len - 1;
            while(k >= 0) {
                if(predicate.call(thisArg, o[k], k, o)) {
                    return asIndex ? k : o[k];
                }
                --k;
            }
            return asIndex ? -1 : undefined;
        }
        if(!Array.prototype.findLast) {
            Object.defineProperty(Array.prototype, 'findLast', {
                value: function(callbackFn, thisArg) {
                    return arrayFindLast(callbackFn, thisArg, false);
                },
                configurable: true,
                writable: true
          });
        }
        if(!Array.prototype.findLastIndex) {
            Object.defineProperty(Array.prototype, 'findLastIndex', {
                value: function(callbackFn, thisArg) {
                    return arrayFindLast(callbackFn, thisArg, true);
                },
                configurable: true,
                writable: true
          });
        }
    }

    // Array.includes()
    if(!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function(searchElement, fromIndex) {
                if(fromIndex < 0) {
                    fromIndex += this.length;
                    if(fromIndex < 0) fromIndex = 0;
                } else if(!fromIndex && fromIndex !== 0) {
                    fromIndex = 0;
                } else if(fromIndex >= this.length) {
                    return false;
                }
                var o = Object(this), 
                    len = o.length >>> 0, 
                    i = fromIndex;
                while(i < len) {
                    if(o[i] === searchElement) return true;
                    ++i;
                }
                return false;
            },
            configurable: true,
            writable: true
      });
    }

    // Array.flat()
    if(!Array.prototype.flat || !Array.prototype.flatMap) {
        var flattern = function(depthLeft) {
            if(--depthLeft < 0 || !this || !Array.isArray(this)) return this;
            var o = Object(this);
            return o.filter((o,i) => i in o)
                    .map(i => flatten(this, depthLeft));
        };
        Object.defineProperty(Array.prototype, 'flat', {
            value: function(depth) {
                if(depth <= 0) depth = 1;
                return flatten(this, depth > 0 ? depth : 1);
            },
            configurable: true,
            writable: true
      });
    }

    // Array.from()
    if(!Array.from) {
        Array.from = (function() {
            var symbolIterator;
            try {
                symbolIterator = Symbol.iterator ? Symbol.iterator : 'Symbol(Symbol.iterator)';
            } catch(e) {
                symbolIterator = 'Symbol(Symbol.iterator)';
            }
            var toStr = Object.prototype.toString, 
                isCallable = fn => typeof fn === 'function' || toStr.call(fn) === '[object Function]';
                toNumber = value => {
                    var number = Number(value);
                    return isNaN(number) || !isFinite(number) ? 0 : Math.floor(Math.abs(number));
                }, 
                setGetItemHandler = (isIterator, items) => {
                    var iterator = isIterator && items[symbolIterator]();
                    return k => isIterator ? iterator.next() : items[k];
                }, 
                getArray = (T, A, len, getItem, isIterator, mapFn) => {
                    var k = 0;
                    while(k < len || isIterator) {
                        var item = getItem(k), 
                            kValue = isIterator ? item.value : item;
                        if(isIterator && item.done) {
                            return A;
                        } else if(mapFn) {
                            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                        } else {
                            A[k] = kValue;
                        }
                        k += 1;
                    }
                    if(isIterator) throw new TypeError('Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1');
                    A.length = len;
                    return A;
                };
            return function(arrayLikeOrIterator /*, mapFn, thisArg */) {
                var C = this, 
                    items = Object(arrayLikeOrIterator), 
                    isIterator = isCallable(items[symbolIterator]);
                if(arrayLikeOrIterator == null && !isIterator) {
                    throw new TypeError('Array.from requires an array-like object or iterator - not null or undefined');
                }
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined, 
                    T;
                if(typeof mapFn !== 'undefined') {
                    if(!isCallable(mapFn)) throw new TypeError('Array.from: when provided, the second argument must be a function');
                    if(arguments.length > 2) T = arguments[2];
                }
                var len = toNumber(items.length), 
                    A = isCallable(C) ? Object(new C(len)) : new Array(len);
                return getArray(T, A, len, setGetItemHandler(isIterator, items), isIterator, mapFn);
            };
        })();
    }

    return true;

})();