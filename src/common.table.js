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
    
    /**
     * Create table element and CommonTable handler.
     * @param {String} [tableId] - Optional table ID.
     * @param {String} [tableClass] - Optional table class.
     * @param {String|jQuery} [container] - Optional container to append table to.
     */
    function CommonTable(tableId, tableClass, container) {
        this.tableData    = null;
        this.hdrGroups    = [];
        this.headerObjs   = [];
        this.headerElems  = [];
        this.tableElement = document.createElement('table');
        this.tbodyElement = document.createElement('tbody');
        
        this.tableElement.append(this.tbodyElement);
        this.tableElement.className = 'cm-table';
        
        if(tableId)    this.tableElement.setAttribute("id", tableId);
        if(tableClass) this.tableElement.classList.add(tableClass);
        if(container)  container.append(this.tableElement);
        return this;
    };
    
    /**
     * Append table to container element.
     * @param {String|jQuery} container - Container select or jQuery DOM element.
     */
    CommonTable.prototype.appendTo = function(container) {
        container.append(this.tableElement);
        return this;
    };
    
    
    /**
     * Prepend table to container element.
     * @param {String|jQuery} container - Container select or jQuery DOM element.
     */
    CommonTable.prototype.prependTo = function(container) {
        container.prepend(this.tableElement);
        return this;
    };
    
    /**
     * Add column. Parameters may either be specified as list of arguments, or formatted into single object 
     * literal with parameter names as below. Title and key are required.
     * @param {String} group - The header group. If not null, used to group two or more headers as subheaders 
     *        under a banner header (via colspan).
     * @param {String} title - The title to display the header as.
     * @param {String} key - The key used to retrieve data from this header.
     * @param {Object] [options]
     * @param {Callback} [options.format] - Format callback.
     * @param {String} [options.dateFormat] - Optional date format to format dates under this header.
     * @param {String} [options.hdrStyles] - Optional styles to apply to the header. Overrides any colStyles 
     *        properties.
     * @param {String} [options.colStyles] - Optional styles to apply to every row in this column (including 
     *        header). If you only want to apply to non-header cells, must override values in hdrStyles.
     * @param {String} [options.onClick] - Optional onClick functionality to add to each cell (excluding 
     *        header). Callback will be given the entire row's data as the parameter.
     * @param {boolean} [options.sortable] - Optional flag to set/disable sortable column on this column. 
     *        By default columns are sortable, so set as false or null to disable.
     */
    CommonTable.prototype.addColumn = function(group, title, key, options) {
        if(group && group.hasOwnProperty("title") && group.hasOwnProperty("key") && !title && !key) {
            // add as object literal
            if(!group.group) {
                group.group = null;
            }
            this.headerObjs.push(group);
        } else {
            // create object from parameters
            if(!group) {
                group = null;
            }
            if(!options) options = {};
            this.headerObjs.push({
                group:      group, 
                title:      title, 
                key:        key, 
                format:     options.format, 
                dateFormat: options.dateFormat, 
                hdrStyles:  options.hdrStyles, 
                colStyles:  options.colStyles, 
                onClick:    options.onClick, 
                sortable:   (options.sortable === undefined || options.sortable)
            });
        }
        return this;
    };
    
    /**
     * [Re]draw table headers.
     * @param {String} [sortOnKey] - Option key to sort on.
     * @param {Boolean} [ascending] - If sorting, whether ascending or descending order.
     */
    CommonTable.prototype.createHeaders = function(sortOnKey, ascending) {
        var self = this;
        this.tbodyElement.innerHTML = "";
        var hdrRows = [];
        for(var i = 0; i < 2; ++i) {
            var el = document.createElement("tr");
            el.setAttribute("cm-table-rowtype", "header-row");
            this.tbodyElement.append(el);
            hdrRows.push(el);
        }
        
        var lastGroupName = null;
        var lastGroupElem = null;
        for(var i = 0; i < this.headerObjs.length; i++) {
            var hdr = this.headerObjs[i];
            // add group header, or extend the colspan, if necessary
            if(hdr.group) {
                if(lastGroupName && hdr.group === lastGroupName) {
                    lastGroupElem.setAttribute("colspan", 1+parseInt(lastGroupElem.attr("colspan")));
                } else {
                    lastGroupName = hdr.group;
                    lastGroupElem = document.createElement("th");
                    lastGroupElem.innerHTML = hdr.group;
                    lastGroupElem.setAttributes({
                        style: "text-align:center;", 
                        colspan: 1, 
                        "cm-table-celltype": "header-group"
                    });
                    hdrRows[0].append(lastGroupElem);
                }
            }
            var hdrElem = document.createElement("th");
            hdrElem.innerHTML = hdr.title;
            hdrElem.setAttribute("cm-table-celltype", "header");
            // add styles -- note that hdrStyles overwrites colStyles
            var styles = {};
            if(hdr.colStyles) {
                for(var s in hdr.colStyles) styles[s] = hdr.colStyles[s];
            }
            if(hdr.hdrStyles) {
                for(var s in hdr.hdrStyles) styles[s] = hdr.hdrStyles[s];
            }
            hdrElem.css(styles);
            // current sort header
            var sortOnThis = sortOnKey && sortOnKey === hdr.key;
            if(sortOnThis) {
                var icon = document.createElement("i");
                icon.className = "icon-" + (ascending ? "ascending" : "descending");
                hdrElem.append(icon);
            }
            // sort functionality
            if(hdr.sortable) {
                hdrElem.css("cursor", "pointer");
                hdrElem.addEventListener('click', 
                    (function(theKey, isAscending) {
                        return function(evt) {
                            evt.stopPropagation();
                            self.populateTable(null, theKey, isAscending);
                        };
                    }(hdr.key, sortOnThis ? !ascending : true))
                );
            }
            // add to row
            if(hdr.group) {
                hdrRows[1].append(hdrElem);
            } else {
                hdrElem.setAttribute("rowspan", 2);
                hdrRows[0].append(hdrElem);
            }
        }
        // if no groups, delete unnecessary row, remove rowspans
        if(!hdrRows[1].hasChildNodes()) {
            hdrRows[1].remove();
            hdrRows[0].querySelectorAll("th").forEach(function(el) {
                el.setAttribute("rowspan", "");
            });
        }
        return this;
    };
    
    /**
     * Populate and [re]draw table.
     * @param {Array} tableData - Array of objects, representing data by row. Data is not stored to object or 
     *        dynamically bound in any way. To update table, must be redrawn, passing the updated data array.
     * @param {String} [sortOnKey] - Option key to sort on.
     * @param {Boolean} [ascending] - If sorting, whether ascending or descending order.
     * @param {Function} [dateFormatter] - Optional date formatting function that takes parameters in the 
     *        order of the date value and the date format. Will only be called if column header has a 
     *        dateFormat value. Attempted in try-catch block, so all values are attempted to be formatted, but
     *        if formatter throws exception, continues as if non-date value.
     */
    CommonTable.prototype.populateTable = function(tableData, sortOnKey, ascending, dateFormatter) {
        // recreate headers, which should also clear all rows
        this.createHeaders(sortOnKey, ascending);
        // get data or use last provided
        if(tableData) this.tableData = tableData;
        // sort data
        var sortedData = this.tableData;
        if(sortOnKey && sortedData.length) {
            var sortedData = this.tableData.slice();
            sortedData.sort(function(a, b) {
                var compared = 0;
                var values = [a[sortOnKey], b[sortOnKey]];
                var isUndefined = [
                    typeof values[0] === "undefined", 
                    typeof values[1] === "undefined"
                ];
                if(isUndefined[0] !== isUndefined[1]) {
                    // only one is undefined
                    compared = isUndefined[0] ? -1 : 1;
                // else if both are not undefined
                } else if(!isUndefined[0]) {
                    if(typeof values[0] === "number" && typeof values[1] === "number") {
                        compared = values[0] - values[1];
                    } else {
                        // try converting to dates
                        var asDates = [Date.parse(values[0]), Date.parse(values[1])];
                        if(!isNaN(asDates[0]) && !isNaN(asDates[0])) {
                            compared = asDates[0] - asDates[1];
                        } else {
                            compared = values[0].localeCompare(values[1]);
                        }
                    }
                }
                return ascending ? compared : -compared;
            });
        }
        // add by rows
        for(var i = 0; i < sortedData.length; i++) {
            var row = document.createElement("tr");
            row.setAttribute("cm-table-rowtype", "data");
            this.tbodyElement.append(row);
            for(var j = 0; j < this.headerObjs.length; j++) {
                var val = sortedData[i][this.headerObjs[j].key];
                if(this.headerObjs[j].format) {
                    val = this.headerObjs[j].format(val);
                } else if(this.headerObjs[j].dateFormat) {
                    try {
                        val = dateFormatter(val, this.headerObjs[j].dateFormat);
                    } catch(e) {
                        // do nothing on error, just don't format date
                    }
                }
                var cell = document.createElement("<td>");
                cell.setAttribute("cm-table-celltype", "data");
                row.append(cell);
                if(this.headerObjs[j].colStyles) {
                    cell.css(this.headerObjs[j].colStyles);
                }
                if(this.headerObjs[j].onClick) {
                    // if click functionality, wrap in anchor
                    var a = document.createElement("a");
                    a.setAttribute("href", "#");
                    a.innerHTML = val;
                    cell.append(a);
                    a.addEventListener("click", (function(callback, onData) {
                            return function(evt) {
                                callback(onData);
                                evt.preventDefault();
                            };
                        }(this.headerObjs[j].onClick, sortedData[i]))
                    );
                } else {
                    cell.innerHTML = val;
                }
            }
        }
        return this;
    };
    
    
    return CommonTable;
    
});