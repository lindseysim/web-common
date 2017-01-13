
// START IIFE (Immediately-Invoked Function Expression) Constructor
!function(root, factory) {
	// CommonJS-based (e.g. NodeJS) API
	if(typeof module === "object" && module.exports) {
		// jquery required -- check if this is loaded outside of dependency managers
		module.exports = factory(require("jquery"));
	// AMD-based (e.g. RequireJS) API
	} else if(typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	// Regular instantiation 
	} else {
		root.CommonTable = factory(root.$);
	}
}(this, function($) {
	
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
	
	
	CommonTable.prototype.appendTo = function(container) {
		this.tableElement.appendTo(container);
		return this;
	};
	
	
	CommonTable.prototype.addColumn = function(group, title, key, dateFormat, hdrStyles, colStyles, onClick) {
		if(group.hasOwnProperty("title") && group.hasOwnProperty("key") && !title && !key) {
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
			this.headerObjs.push({
				group:      group, 
				title:      title, 
				key:        key, 
				dateFormat: dateFormat, 
				hdrStyles:  hdrStyles, 
				colStyles:  colStyles, 
				onClick:    onClick
			});
		}
		return this;
	};
	
	
	CommonTable.prototype.createHeaders = function(sortOnKey, ascending) {
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
					lastGroupElem.attr("colspan", 1+lastGroupElem.attr("colspan"));
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
			var self = this;
			hdrElem.css("cursor", "pointer").on('click', function(theKey, isAscending) {
					return function(evt) {
						evt.stopPropagation();
						self.populateTable(null, theKey, isAscending);
					};
				}(hdr.key, sortOnThis ? !ascending : true)
			);
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
	
	
	CommonTable.prototype.populateTable = function(tableData, sortOnKey, ascending, dateFormatter) {
		// recreate headers, which should also clear all rows
		this.createHeaders(sortOnKey, ascending);
		// get data or use last provided
		if(tableData) {
			this.tableData = tableData;
		}
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
				if(this.headerObjs[j].dateFormat) {
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