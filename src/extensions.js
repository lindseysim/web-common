//****************************************************************************************************
// Misc prototype extensions
//****************************************************************************************************
/**
 * Remove all instances of a value from an array.
 * @param value - Value to remove
 * @param {number} index - Starting index (defaults to 0), negatives allowed
 * @param {number} limit - Limit on number of removals (0 or negative for unlimited)
 * @returns {Array} Copy of array with values removed
 */
if(!Array.prototype.remove) {
    Object.defineProperty(Array.prototype, 'remove', {
        value(value, index, limit) {
            if(!index && index !== 0) {
                index = 0;
            } else if(index < 0) {
                // negative indexing (only once)
                index = this.length + index;
                if(index < 0) return this.slice(0,);
            } else if(index >= this.length) {
                // greater than is no search
                return this.slice(0,)
            }
            limit = limit || this.length;
            let arr = this.slice(0,),  // ensures always copy, even if usually unnecessary
                removed = 0;
            index = arr.indexOf(value, index);
            while(~index) {
                if(index+1 === arr.length) return arr.slice(0, index);
                arr = arr.slice(0, index).concat(arr.slice(index+1));
                if(++removed >= limit) break;
                index = arr.indexOf(value, index);
            }
            return arr;
        }
    });
}

/**
 * Get overlapping values with second array. Uses strict equality.
 * @param {Array} arr
 * @returns {Array} Array of overlapping values.
 */
if(!Array.prototype.getOverlaps) {
    Object.defineProperty(Array.prototype, 'getOverlaps', {
        value(arr) {
            return this.filter(v => ~arr.indexOf(v));
        }
    });
}
if(!Array.getOverlaps) {
    Object.defineProperty(Array, 'getOverlaps', {
        value: (a, b) => a.getOverlaps(b)
    });
}

/**
 * Check if at least one value overlaps with second array. Uses strict equality.
 * @param {Array} arr
 * @returns {Boolean} True if overlaps.
 */
if(!Array.prototype.overlaps) {
    Object.defineProperty(Array.prototype, 'overlaps', {
        value(arr) {
            return typeof this.find(v => ~arr.indexOf(v)) !== 'undefined';
        }
    });
}
if(!Array.overlaps) {
    Object.defineProperty(Array, 'overlaps', {
        value: (a, b) => a.overlaps(b)
    });
}

/** Check is given object is an object-type. That is, not a primitive, string, or array. This includes 
 * any inheritance of the object prototype, except for arrays. 
 * 
 * Uses `typeof` check with extra handling to invalidate array types.
 * @param {anything} obj - The variable to be checked.
 */
if(!Object.isObject) {
    Object.defineProperty(Object, 'isObject', {
        value: obj => obj && typeof obj === "object" && !Array.isArray(obj)
    });
}

/** Check is given object is an object literal-type. That is, not a primitive, string, array, or even 
 * any inheritance of the Object prototype. Must be a base object create either as an object literal 
 * or via `new Object()`. Useful for when parameters must be ensured is an object-literal/dictionary.
 * 
 * Uses `Object.getPrototypeOf()` check.
 * @param {anything} obj - The variable to be checked.
 */
if(!Object.isObjectLiteral) {
    Object.defineProperty(Object, 'isObjectLiteral', {
        value: obj => obj && Object.getPrototypeOf(obj) === Object.prototype
    });
}

/**
 * Capitalize the first letter of every word. (A word is determined by any string preceded by 
 * whitespace, as such ignores second word in hyphenated compound words).
 * @param {String} breaks
 * @returns {String} Capitalized version of this string.
 */
if(!String.prototype.capitalize) {
    Object.defineProperty(String.prototype, 'capitalize', {
        value(breaks) {
            if(breaks) {
                breaks = Array.from(breaks)
                    .filter(c => c && c !== " ")
                    .map(c => {
                        let code = c.charCodeAt(0), 
                            alphanumeric = (
                                (code > 47 && code < 58) ||  // numeric (0-9)
                                (code > 64 && code < 91) ||  // upper alpha (A-Z)
                                (code > 96 && code < 123)    // lower alpha (a-z)
                            );
                        return alphanumeric ? c : "\\"+c;
                    });
            } else {
                breaks = [];
            }
            let re = new RegExp(`(?:^|[${breaks.join('')}\\s])\\S`, "g");
            return this.replace(re, a => a.toUpperCase());
            //let capped = this.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
        }
    });
}

/**
 * Compare strings semantically, such that numbers within the string are not compared alphabetically 
 * by character but as the full numeric value. By default, only handles positive integers.
 * @param {String} compareString
 * @param {Object} options
 * @param {Boolean} options.handleNegative
 * @param {Boolean} options.handleDecimal
 * @returns {Number} -1 if before, 0 if equal, 1 if after.
 */
if(!String.prototype.semanticCompare || !String.prototype.heuristicCompare) {
    var compareFunc = function(compareString, options) {
        options = options || {};
        let matchRegex;
        if(options.handleDecimal && options.handleNegative) {
            matchRegex = /(\-?\d+\.?\d+)|(\-?\.\d+)|(\-?\d+)/g;
        } else if(options.handleDecimal) {
            matchRegex = /(\d+\.?\d+)|(\.\d+)|(\d+)/g;
        } else if(options.handleNegative) {
            matchRegex = /\-?\d+/g
        } else {
            matchRegex = /\d+/g;
        }
        let A = {str: this}, 
            B = {str: compareString}, 
            both = [A, B], 
            compare;
        both.forEach(o => {
            o.matches = o.str.matchAll(matchRegex);
            o.match   = o.matches.next();
            o.chunk   = "";
            o.index   = 0;
            o.isnum   = false;
            o.done    = false;
        });
        while(!A.done || !B.done) {
            both.forEach(o => {
                if(o.done) return;
                if(o.match.done) {
                    o.done = true;
                    o.isnum = false;
                    o.chunk = o.str.slice(o.index);
                    o.index = o.str.length;
                } else if(o.match.value.index > o.index) {
                    // grab preceding string first
                    o.isnum = false;
                    o.chunk = o.str.slice(o.index, o.match.value.index);
                    o.index = o.match.value.index;
                } else {
                    o.isnum = true;
                    o.chunk = o.match.value[0];
                    o.index = o.match.value.index + o.chunk.length;
                    o.match = o.matches.next();
                }
            });
            if(A.isnum && B.isnum) {
                compare = parseFloat(A.chunk) - parseFloat(B.chunk);
                compare = !compare ? 0 : (compare < 0 ? -1 : 1);
            } else {
                compare = A.chunk.localeCompare(B.chunk);
            }
            if(compare) return compare;
            if(A.done !== B.done) return A.done ? -1 : 1;
        }
        return 0;
    };
    if(!String.prototype.semanticCompare) {
        Object.defineProperty(String.prototype, 'semanticCompare', {value: compareFunc});
    }
    if(!String.prototype.heuristicCompare) {
        Object.defineProperty(String.prototype, 'heuristicCompare', {value: compareFunc});
    }
}

/**
 * Return string value of this number with commas added.
 * @param {Number} precision - Decimal precision.
 * @returns {String}
 */
if(!Number.prototype.addCommas) {
    Object.defineProperty(Number.prototype, 'addCommas', {
        value(precision) {
            precision = isNaN(precision = Math.abs(precision)) ? 0 : precision;
            let n = Math.abs(+this || 0), 
                number = parseInt(n.toFixed(precision)) + "";
            return (
                (n < 0 ? "-" : "")
                + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                + (precision ? "." + Math.abs(n - number).toFixed(precision).slice(2) : "")
            );
        }
    });
}

/**
 * Return string value of this number with commas added. Precision is handled dynamically based on my
 * abitrary rules but generally maintains at least two significant digits. Values less than 0.1 are 
 * presented in scientific notation.
 * @param {Number} [minimum=0.001] - Minimum number (absolute value), on which anything less than 
 *        becomes zero.
 * @param {String} [zeroFormat="0.0"] - Format to print values evaluating to zero.
 * @returns {String}
 */
if(!Number.prototype.stringFormat || !Number.prototype.addCommasSmart) {
    var numberFormat(minimum, zeroFormat) {
        if(!zeroFormat && zeroFormat !== 0) zeroFormat = "0.0";
        if(this === 0.0) return zeroFormat;
        let n = Math.abs(this);
        minimum = minimum || 0.001;
        if(n < minimum) {
            return zeroFormat;
        } else if(n < 0.01) {
            return this.toExponential(3);
        } else if(n < 0.1) {
            return this.toExponential(2);
        } else if(n < 0.3) {
            return this.addCommas(3);
        } else if(n < 1.0) {
            return this.addCommas(2);
        } else if(n < 100.0) {
            return this.addCommas(1);
        }
        return this.addCommas(0);
    }
    if(!Number.prototype.stringFormat) {
        Object.defineProperty(Number.prototype, 'stringFormat', {value: stringFormat});
    }
    if(!Number.prototype.addCommasSmart) {
        Object.defineProperty(Number.prototype, 'addCommasSmart', {value: stringFormat});
    }
}

/**
 * Simple is-visible check using offsetParent trick. Note it will have issues with elements in fixed 
 * positions;
 * @returns {Boolean} True if visible.
 */
if(!Element.prototype.isVisible) {
    Object.defineProperty(Element.prototype, 'isVisible', {
        value() {
            if(this.style.visibility && this.style.visibility.toLowerCase() !== "hidden") return false;
            if(this.style.display && this.style.display.toLowerCase() !== "none") return false;
            var rect = this.getBoundingClientRect();
            return (
                rect.top >= 0 && rect.left >= 0
                && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 
                && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    });
}

/**
 * Quickly set multiple attributes at once.
 * @param {Object} attrs - Literal of key-value attribute pairs.
 */
if(!Element.prototype.setAttributes) {
    Object.defineProperty(Element.prototype, 'setAttributes', {
        value(attrs) {
            for(let key in attrs) this.setAttribute(key, attrs[key]);
        }
    });
}

/**
 * Shortcut for setting CSS styles.
 * @param {Object|String} style - Either a string for style name (paired with 2nd attribute value), or
 *        an object literal of multiple styles as key-value pairs.
 * @param {String} [value] - If style is key/string, the value for said CSS style.
 */
if(!Element.prototype.css) {
    Object.defineProperty(Element.prototype, 'css', {
        value(style, value) {
            if(style && style.constructor === Object) {
                for(let key in style) this.style[key] = style[key];
            } else {
                this.style[style] = value;
            }
        }
    });
}

/**
 * Center itself in the window with absolute positioning.
 */
if(!Element.prototype.center) {
    Object.defineProperty(Element.prototype, 'center', {
        value() {
            this.css({
                position: "absolute", 
                top:  Math.max(0, ((window.innerHeight - this.offsetHeight) / 2) + (window.scrollY || window.pageYOffset)),
                left: Math.max(0, ((window.innerWidth  - this.offsetWidth)  / 2) + (window.scrollX || window.pageXOffset))
            });
        }
    });
}

//****************************************************************************************************
// Date prototype extensions
//****************************************************************************************************
window.DateUTC = function(year, month, day, hour, min, sec) {
    //if(!month && !day && !hour && !min && !sec) return new Date(parseInt(year));
    return new Date(Date.UTC(
        parseInt(year), 
        month ? parseInt(month)-1 : 0, 
        day   ? parseInt(day)     : 1, 
        hour  ? parseInt(hour)    : 0, 
        min   ? parseInt(min)     : 0, 
        sec   ? parseInt(sec)     : 0
    ));
};

if(!Date.prototype.asUTC) {
    Object.defineProperty(Date.prototype, 'asUTC', {
        value() {
            return new Date(Date.UTC(
                this.getFullYear(), 
                this.getMonth(), 
                this.getDate(), 
                this.getHours(), 
                this.getMinutes(), 
                this.getSeconds()
            ));
        }
    });
}

if(!Date.prototype.toUTC) {
    Object.defineProperty(Date.prototype, 'toUTC', {
        value() {
            return new Date(Date.UTC(
                this.getUTCFullYear(), 
                this.getUTCMonth(), 
                this.getUTCDate(), 
                this.getUTCHours(), 
                this.getUTCMinutes(), 
                this.getUTCSeconds()
            ));
        }
    });
}

if(!Date.prototype.asUTCDate) {
    Object.defineProperty(Date.prototype, 'asUTCDate', {
        value() {
            return new Date(Date.UTC(
                this.getFullYear(), 
                this.getMonth(), 
                this.getDate()
            ));
        }
    });
}

if(!Date.prototype.toUTCDate) {
    Object.defineProperty(Date.prototype, 'toUTCDate', {
        value() {
            return new Date(Date.UTC(
                this.getUTCFullYear(), 
                this.getUTCMonth(), 
                this.getUTCDate()
            ));
        }
    });
}

if(!Date.prototype.addDays) {
    Object.defineProperty(Date.prototype, 'addDays', {
        value(days) {
            return new Date(this.getTime() + days*86400000);
        }
    });
}

if(!Date.prototype.monthOfYear) {
    Object.defineProperty(Date.prototype, 'monthOfYear', {
        value() {
            return this.getMonth()+1;
        }
    });
}

if(!Date.prototype.daysInMonth) {
    Object.defineProperty(Date.prototype, 'daysInMonth', {
        value() {
            return (new Date(this.getFullYear(), this.getMonth(), 0)).getDate();
        }
    });
}

export default true;