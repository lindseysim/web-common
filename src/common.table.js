!function(root, factory) {
    // CommonJS-based (e.g. NodeJS) API
    if(typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    // AMD-based (e.g. RequireJS) API
    } else if(typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    // Regular instantiation 
    } else {
        root.CommonTable = factory(root.$);
    }
}(this, function($) {
    
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
        this.tableElement = $("<table>", {'class': 'cm-table'});
        this.tbodyElement = $("<tbody>").appendTo(this.tableElement);
        if(container)  { this.tableElement.appendTo(container); }
        if(tableId)    { this.tableElement.attr("id", tableId); }
        if(tableClass) { this.tableElement.attr("class", tableClass); }
        return this;
    };
    
    /**
     * Append table to container element.
     * @param {String|jQuery} container - Container select or jQuery DOM element.
     */
    CommonTable.prototype.appendTo = function(container) {
        this.tableElement.appendTo(container);
        return this;
    };
    
    
    /**
     * Prepend table to container element.
     * @param {String|jQuery} container - Container select or jQuery DOM element.
     */
    CommonTable.prototype.prependTo = function(container) {
        this.tableElement.prependTo(container);
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
        this.tbodyElement.html("");
        var hdrRows = [
            $("<tr>", {"cm-table-rowtype": "header-row"}).appendTo(this.tbodyElement), 
            $("<tr>", {"cm-table-rowtype": "header-row"}).appendTo(this.tbodyElement)
        ];
        
        var lastGroupName = null;
        var lastGroupElem = null;
        for(var i = 0; i < this.headerObjs.length; i++) {
            var hdr = this.headerObjs[i];
            // add group header, or extend the colspan, if necessary
            if(hdr.group) {
                if(lastGroupName && hdr.group === lastGroupName) {
                    lastGroupElem.attr("colspan", 1+parseInt(lastGroupElem.attr("colspan")));
                } else {
                    lastGroupName = hdr.group;
                    lastGroupElem = $("<th>", {
                        html: hdr.group, 
                        style: "text-align:center;", 
                        colspan: 1, 
                        "cm-table-celltype": "header-group"
                    }).appendTo(hdrRows[0]);
                }
            }
            var hdrElem = $("<th>", {html: hdr.title, "cm-table-celltype": "header"});
            // add styles -- note that hdrStyles overwrites colStyles
            var styles = {};
            if(hdr.colStyles) {
                for(var s in hdr.colStyles) {
                    styles[s] = hdr.colStyles[s];
                }
            }
            if(hdr.hdrStyles) {
                for(var s in hdr.hdrStyles) {
                    styles[s] = hdr.hdrStyles[s];
                }
            }
            hdrElem.css(styles);
            // current sort header
            var sortOnThis = sortOnKey && sortOnKey === hdr.key;
            if(sortOnThis) {
                hdrElem.append(
                    $("<i>", {
                        "class" : "icon-" + (ascending ? "ascending" : "descending")
                    })
                );
            }
            // sort functionality
            if(hdr.sortable) {
                hdrElem.css("cursor", "pointer").on('click', function(theKey, isAscending) {
                        return function(evt) {
                            evt.stopPropagation();
                            self.populateTable(null, theKey, isAscending);
                        };
                    }(hdr.key, sortOnThis ? !ascending : true)
                );
            }
            // add to row
            if(hdr.group) {
                hdrRows[1].append(hdrElem);
            } else {
                hdrElem.attr("rowspan", 2);
                hdrRows[0].append(hdrElem);
            }
        }
        // if no groups, delete unnecessary row, remove rowspans
        if(!hdrRows[1][0].hasChildNodes()) {
            hdrRows[1].remove();
            hdrRows[0].find("th").attr("rowspan", 1);
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
            var row = $("<tr>", {"cm-table-rowtype": "data"}).appendTo(this.tbodyElement);
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
                var cell = $("<td>", {"cm-table-celltype": "data"}).appendTo(row);
                if(this.headerObjs[j].colStyles) {
                    cell.css(this.headerObjs[j].colStyles);
                }
                if(this.headerObjs[j].onClick) {
                    // if click functionality, wrap in anchor
                    $("<a>", {href: "#", html: val}).appendTo(cell)
                        .on("click", function(callback, onData) {
                            return function(evt) {
                                callback(onData);
                                evt.preventDefault();
                            };
                        }(this.headerObjs[j].onClick, sortedData[i]));
                } else {
                    cell.html(val);
                }
            }
        }
        return this;
    };
    
    
    return CommonTable;
    
});