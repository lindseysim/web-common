function CommonTable(tableId, tableClass, container) {
    this.tableData    = null;
    this.hdrGroups    = [];
    this.headerObjs   = [];
    this.headerElems  = [];
    this.tableElement = document.createElement('table');
    this.tbodyElement = document.createElement('tbody');
    
    this.tableElement.append(this.tbodyElement);
    this.tableElement.className = 'cm-table';
    
    tableId && this.tableElement.setAttribute("id", tableId);
    if(tableClass) {
        if(Array.isArray(tableClass)) {
            tableClass.forEach(cname => this.tableElement.classList.add(cname))
        } else {
            this.tableElement.classList.add(tableClass);
        }
    }
    container && container.append(this.tableElement);
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
    if(Object.isObjectLiteral(group)) {
        title   = group.title;
        key     = group.key;
        options = group;
        group   = group.group;
    }
    if(!group) group = null;
    if(!options) options = {};
    // create object from parameters
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
    return this;
};

CommonTable.prototype.createHeaders = function(sortOnKey, ascending) {
    if(Object.isObjectLiteral(sortOnKey)) {
        ascending = options.ascending;
        sortOnKey = options.sortOnKey;
    }
    this.tbodyElement.innerHTML = "";
    let hdrRows = [];
    for(let i = 0; i < 2; ++i) {
        let el = document.createElement("tr");
        el.setAttribute("cm-table-rowtype", "header-row");
        this.tbodyElement.append(el);
        hdrRows.push(el);
    }
    let lastGroupName = null, 
        lastGroupElem = null;
    this.headerObjs.forEach(hdr => {
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
        let hdrElem = document.createElement("th");
        hdrElem.innerHTML = hdr.title;
        hdrElem.setAttribute("cm-table-celltype", "header");
        // add styles -- note that hdrStyles overwrites colStyles
        let styles = {};
        if(hdr.colStyles) {
            for(let s in hdr.colStyles) styles[s] = hdr.colStyles[s];
        }
        if(hdr.hdrStyles) {
            for(let s in hdr.hdrStyles) styles[s] = hdr.hdrStyles[s];
        }
        hdrElem.css(styles);
        // current sort header
        let sortOnThis = sortOnKey && sortOnKey === hdr.key;
        if(sortOnThis) {
            let icon = document.createElement("i");
            icon.className = "icon-" + (ascending ? "ascending" : "descending");
            hdrElem.append(icon);
        }
        // sort functionality
        if(hdr.sortable) {
            hdrElem.css("cursor", "pointer");
            hdrElem.addEventListener('click', 
                ((theKey, isAscending) => (evt => {
                    evt.stopPropagation();
                    this.populateTable(null, theKey, isAscending);
                }))(hdr.key, sortOnThis ? !ascending : true)
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
        hdrRows[0].querySelectorAll("th").forEach(el => el.setAttribute("rowspan", ""));
    }
    return this;
};

CommonTable.prototype.populateTable = function(tableData, sortOnKey, ascending) {
    if(Object.isObjectLiteral(tableData)) {
        sortOnKey = tableData.sortOnKey;
        ascending = tableData.ascending;
        tableData = tableData.tableData;
    }
    // recreate headers, which should also clear all rows
    this.createHeaders(sortOnKey, ascending);
    // get data or use last provided
    if(tableData) this.tableData = tableData;
    // sort data
    let sortedData = this.tableData;
    if(sortOnKey && sortedData.length) {
        sortedData = this.tableData.slice();
        sortedData.sort((a, b) => {
            let compared = 0, 
                values = [a[sortOnKey], b[sortOnKey]], 
                isUndefined = [
                    typeof values[0] === "undefined", 
                    typeof values[1] === "undefined"
                ];
            if(isUndefined[0] !== isUndefined[1]) {
                // only one is undefined
                compared = isUndefined[0] ? -1 : 1;
            } else if(!isUndefined[0]) {
                // else if both are defined
                if(typeof values[0] === "number" && typeof values[1] === "number") {
                    // compare numbers
                    compared = values[0] - values[1];
                } else {
                    // try converting to dates
                    let asDates = [Date.parse(values[0]), Date.parse(values[1])];
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
    sortedData.forEach(d => {
        let row = document.createElement("tr");
        row.setAttribute("cm-table-rowtype", "data");
        this.headerObjs.forEach(hdr => {
            let val = d[hdr.key];
            if(hdr.format) {
                try {
                    val = hdr.format(val);
                } catch(e) {
                    // do nothing, continue with raw value
                }
            }
            let cell = document.createElement("td");
            cell.setAttribute("cm-table-celltype", "data");
            row.append(cell);
            if(hdr.colStyles) cell.css(hdr.colStyles);
            if(hdr.onClick) {
                // if click functionality, wrap in anchor
                let a = document.createElement("a");
                a.setAttribute("href", "#");
                a.innerHTML = val;
                cell.append(a);
                a.addEventListener(
                    "click", 
                    // function constructed this way to maintain scope
                    ((callback, onData) => (evt => {
                        callback(onData);
                        evt.preventDefault();
                    }))(hdr.onClick, d)
                );
            } else {
                cell.innerHTML = val;
            }
        });
        this.tbodyElement.append(row);
    });
    return this;
};

export default CommonTable;