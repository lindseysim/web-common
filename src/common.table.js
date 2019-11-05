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

CommonTable.prototype.appendTo = function(container) {
    container.append(this.tableElement);
    return this;
};

CommonTable.prototype.prependTo = function(container) {
    container.prepend(this.tableElement);
    return this;
};

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
            hdrStyles:  options.hdrStyles, 
            colStyles:  options.colStyles, 
            onClick:    options.onClick, 
            sortable:   (options.sortable === undefined || options.sortable)
        });
    }
    return this;
};

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
    var lastGroupName = null, 
        lastGroupElem = null;
    this.headerObjs.forEach(function(hdr) {
        // add group header, or extend the colspan, if necessary
        if(hdr.group) {
            if(lastGroupName && hdr.group === lastGroupName) {
                lastGroupElem.setAttribute("colspan", 1+parseInt(lastGroupElem.getAttribute("colspan")));
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
    });
    // if no groups, delete unnecessary row, remove rowspans
    if(!hdrRows[1].hasChildNodes()) {
        hdrRows[1].remove();
        hdrRows[0].querySelectorAll("th").forEach(function(el) {
            el.setAttribute("rowspan", "");
        });
    }
    return this;
};

CommonTable.prototype.populateTable = function(tableData, sortOnKey, ascending) {
    // recreate headers, which should also clear all rows
    this.createHeaders(sortOnKey, ascending);
    // get data or use last provided
    if(tableData) this.tableData = tableData;
    // sort data
    var sortedData = this.tableData;
    if(sortOnKey && sortedData.length) {
        var sortedData = this.tableData.slice();
        sortedData.sort(function(a, b) {
            var compared = 0, 
                values = [a[sortOnKey], b[sortOnKey]], 
                isUndefined = [
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
    var self = this;
    sortedData.forEach(function(d) {
        var row = document.createElement("tr");
        row.setAttribute("cm-table-rowtype", "data");
        self.headerObjs.forEach(function(hdr) {
            var val = d[hdr.key];
            if(hdr.format) {
                try {
                    val = hdr.format(val);
                } catch(e) {
                    // do nothing, continue with raw value
                }
            }
            var cell = document.createElement("td");
            cell.setAttribute("cm-table-celltype", "data");
            row.append(cell);
            if(hdr.colStyles) cell.css(hdr.colStyles);
            if(hdr.onClick) {
                // if click functionality, wrap in anchor
                var a = document.createElement("a");
                a.setAttribute("href", "#");
                a.innerHTML = val;
                cell.append(a);
                a.addEventListener(
                    "click", 
                    // function constructed this way to maintain scope
                    (function(callback, onData) {
                        return function(evt) {
                            callback(onData);
                            evt.preventDefault();
                        };
                    }(hdr.onClick, d))
                );
            } else {
                cell.innerHTML = val;
            }
        });
        self.tbodyElement.append(row);
    });
    return this;
};

export default CommonTable;