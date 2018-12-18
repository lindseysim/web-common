# Web Common #

Web Common is a collection of polyfills, extentions, and modules I repeatedly found myself reapplying on new projects.

Lawrence Sim  
Copyright © 2018

## License ##

*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*

## Use ##

Import `common.min.js` and `common.min.css` for the base commons modules. Import `common.table.min.js` to add the table module.

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

JQuery helper functions are optional, but should be initialized automatically if JQuery is detected. To ensure these helpers are initialized though (if libraries are loaded asynchronously, the automatic detection of JQuery may fail due to race condition), force initialization though the call `window.cmLibGlobals.initJQueryHelpers()`.

## Polyfills ##

Ensures the below functions exists, many of which are missing in (surprise, surprise) Internet Explorer and Edge.

**``Array.prototype.find(callback)`` :** [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

**``Element.prototype.remove()`` :** [https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

**``Element.prototype.append(nodes)`` :** [https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append)

**``Element.prototype.prepend(nodes)`` :** [https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend)

**``Element.prototype.closest()`` :** [https://developer.mozilla.org/en-US/docs/Web/API/Element/closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

**``Element.classList`` :** Ensures existence of `contains()`, `add()`, `remove()`, `toggle()`, and `replace()` functions. [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

**``NodeList.prototype.forEach`` :** [https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach)

**``String.prototype.startsWith(searchString)`` :** [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)

**``String.prototype.endsWith(searchString)`` :** [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

**``String.prototype.repeat(count)`` :** [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

## Global Additions ##

The values/objects are added to the global namespace (under `window`).

**``window.defaultErrorMessage`` :** Default error message.

**``window.browser`` :** Stores information on browser type and version.

**``window.browserType`` :** Alias for *window.browser*, left for backwards compatibility.

**``window.cmLibGlobals`` :** Variables need for global functionality, do not modify.

## Prototype Modifications ##

These useful functions are added to common object prototypes.

**``Object.isObject(obj)`` :** Check is given object is an object-type. That is, not a primitive, string, or array. Useful for when parameters must be ensured is an object-literal/dictionary.

**``String.prototype.capitalize()`` :** Will capitalize the each word in the string (using whitespace to delineate words).

**``Number.prototype.addCommas(precision)`` :** Will convert a given number to a string, using the supplied precision, with commas.

**``Element.prototype.isVisible()`` :** Simple is-visible check using `offsetParent` trick. Note it will have issues with elements in fixed positions.

**``Element.prototype.setAttributes(attrs)`` :** Sets multiple attributes (given as dictionary) at once.

**``Element.prototype.css(style, [value])`` :** Much like the JQuery css() function, sets inline style, either as style name and value provided as strings, or given a dictionary of style names and values and key-value pairs. 

**``Element.prototype.center()`` :** Will center an element on screen using absolute positioning.

## Date (UTC) Modifications ##

Additional functions for handling basic Date objects are added. Specifically to ensure UTC handling.

**``DateUTC(year, month, day[, hour[, min[, sec]]])`` :** Creates a datetime, forced as UTC. Note that month is 1-12 (unlike Date constructor as 0-11).

**``Date.prototype.asUTC()`` :** Converts datetime to UTC.

**``Date.prototype.asUTCDate()`` :** Converts date only to UTC, dropping all time information.

**``Date.prototype.toUTCDate()`` :** See above.

**``Date.prototype.addDays(days)`` :** Returns new date with days added (or removed if negative).

**``Date.prototype.daysInMonth()`` :** Returns number of days in the month for this date.

## jQuery Modifications ##

The following JQuery functionality is added. See note on ensuring this is enabled under "Use" section.

**``jQuery.fn.center()`` :** Will center an element on screen using absolute positioning.

**``jQuery.fn.addTooltip(tooltipMsg[, direction])`` :** Will add a tooltip to an element using pure css. Direction may be "left", "right", "top", or "bottom" (defaults to "right").

**``jQuery.fn.appendHelpIcon(tooltipMsg[, direction[, style]])`` :** Will append a help icon at the end of this element, with a tooltip. Direction may be "left", "right", "top", or "bottom" (defaults to "right"). Style is optional styles object as keys-values which will be applied to the help icon.

**``jQuery.fn.removeHelpIcon()`` :** Removes any appended help-icon.

## Tooltips and Help Icons ##

The tooltips and help icons functionality (described above on the jQuery modifications) can be applied manually as well.

To add a tooltip, simply add a class of `cm-tooltip-left`, `cm-tooltip-top`, `cm-tooltip-right`, or `cm-tooltip-bottom` and an attribute of `cm-tooltip-msg` with the tooltip message.

To create a help icon, simply create the element `<i>?</i>`, with class `cm-icon`.

## Common Object ##

Returned as object if instantiated via CommonJS or AMD import. Otherwise appended to root as common (e.g. *window.common*).

**``common.extend(obj, extend[, allowOverwrite[, deepCopy]])`` :** Copy given object and extended with new values. Unless specified otherwise by `deepCopy` parameter behavior varies as follows:

* If `extend` is null, `obj` is simply returned as is (no copy, original passed value).
* If `obj` is null, `extend` is simply returned as is.
* Values in first level of `obj` are passed to a clone. Thus primitive types are copied by value, but objects will be copied by reference. 

Deep copy is done via `JSON.parse(JSON.stringify())`.

**``common.getUrlGetVars()`` :** Retrieve GET parameters in current URL as object literal (dictionary format).

**``common.newWindow(event, url, name, width, height[, minimal])`` :** Creates a new, centered window, even accounting for dual screen monitors.. The `event` object, if not provided, is grabbed from window.event. This is used to screen against middle-mouse clicks and ctrl+left-clicks which should be handled separately to create a new tab. If `minimal` is true, attempts to hide menubar, statusbar, and location -- though many modern browsers may prevent some or all of this.

**``common.addGrabCursorFunctionality(element)`` :** Adds grab cursor functionality to draggable element. Element may be single element, a NodeList/Array of elements, or a jQuery selection.

**``common.createDropdown(element, menu)`` :** Create a dropdown menu on an element. *menu* parameter is an array of object literals defining the menu. The parameters 'id', 'class', 'style', and 'text', if they exist, are applied. For functionality, either add 'href' and optionally 'target' parameters or supply a callback to an 'onClick' parameter. To create a submenu, simply add a 'menu' parameter with the same nested structure. 

Element may be single element, a NodeList/Array of elements, or a jQuery selection.

Example given below:

    common.createDropdown("#menu", 
		[
			{
				id: "menu-btn-1", 
				text: "Homepage", 
				href: "index.html", 
				style: {"font-weight": "bold"}, 
				onClick: function() { console.log("menu item 1 clicked"); }
			}, 
			{
				id: "submenu", 
				text: "Totally Work Related", 
				style: {"font-style": "italic"}, 
				menu: [
					{text: "Business Stuff", href: "https://facebook.com"},
					{text: "Web Dev. Stuff", href: "https://reddit.com"} 
				]
			}
		]
    );

**``common.clearDropdown(element)`` :** Remove dropdown menu functionality from an element. Element may be single element, a NodeList/Array of elements, or a jQuery selection.

### Modal Dialogs ###

When a modal function is first called, this library appends a hidden div to the body to handle modals. The below functionality handles this built-in modal. Modal functionality is quite simple, opening a centered modal dialog in the window. Various options are provided, but by default there is a closer 'x' in the upper-right corner and clicking outside the modal box will also close the dialog. Only one modal may be open at a time. Opening another modal will override the current one.

**``common.isModalOpen()`` :** Check whether modal is open.

**``common.setModal(visible[, content[, options]])`` :** Creates a new modal dialog (or closes, if visible=false).* Content* is the HTML content of the inner dialog element. *Options* may be provided with:

* `id` - Id of inner modal dialog element.
* `showBackground` - If true, creates a semi-transparent background over window.
* `notExitable` - Normally modal closes on clicking anywhere outside modal dialog element. If true, this prevents this functionality.
* `hideCloser` - If true, does not apply the automatically placed "X" to close dialog on upper-right.
* `onClose` - Callback to run on modal being closed. 

**``common.openModal(content[, options])`` :** Same as *common.setModal()* but with *visible* parameter defaulted to true.

**``common.setModalAsLoading(visible[, content[, options]])`` :** Creates a new modal dialog with default values prepped for loading. *Content* is optional and defaults to "Loading..". In addition to same *options* available for *common.setModal*, extended *options* available are:

* `id` - Id of inner modal dialog element. Defaults to "cm-modal-loading-dialog".
* `addDetails` - If true, adds paragraph element with class *cm-modal-loading-details*.
* `addDetailsText` - If *addDetails* is true, set the detail text (defaults to "Please wait..").
* `imgUrl` - If true adds a loading image with this as the source. Defaults to "images/loader.gif".

**``common.changeModal(content[, prepContentCallback[, hideCloser]])`` :**  Change modal dialog content while leaving all other options the same. Added benefit of measures to keep the content-size changes from being too jarring when swapping content. However, if there is an inline width/height defined in the style, these will be lost.

**``common.closeModal([suppressOnClose])`` :** Hide any currently visible modal. If *suppressOnClose* is true, suppresses any on-close event attached to last modal.

**``common.hideModal([suppressOnClose])`` :** Same as closeModal().

### jQuery-like Functions ###

**``common.ajax(params)`` :** Mimics [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/) function call.

* `url` - The URL of the request.
* `async` - Asynchronous. Defaults to true.
* `method` - Defaults to "GET".
* `data` - Optional dictionary of data to send with request.
* `dataType` - Type of returned data. See [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType).
* `success` - Callback on success. Passes parameters of `XMLHttpRequest.responseText`, `XMLHttpRequest.statusText`, and the `XMLHttpRequest` instance itself.
* `error` - Callback on error. Passes parameters the `XMLHttpRequest` instance, `XMLHttpRequest.statusText`, and `XMLHttpRequest.responseText`.
* `complete` - Callback on completion (whether success or error). Passes parameters the `XMLHttpRequest` instance and `XMLHttpRequest.statusText`.
* `user` - Optional username, if necessitated.
* `password` - Optional password, if necessitated.

**``common.animate(element, properties, duration[, easing[, complete]]])`` :** Mimics [jQuery.animate()](http://api.jquery.com/jQuery.animate/) function using CSS3 transitions.

* `element` - The Element to animate.
* `properties` - CSS properties to animate to. Note not all properties are animatable. See [animatable CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties).
* `duration` - Duration of animation, in milliseconds.
* `timingFunction` - Timing/easing function, defaults to "ease". See: [transition-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function).
* `complete` - Optional callback to run on completion.

## CommonTable Class ##

Requires common.table module. Table handling object which handles data formatting, grouped column, column sorting, and basic styling.

After initializing object and attaching to document, begin by adding columns with `addColumn()`. The `key` is important in defining how to assign the data to said column. Other parameters allow various style and formatting methods. Once all columns are added, add data and draw the table with `populateTable()`. The data, sent as an array of object literals/dictionaries, is mapped to the columns automatically with the `key` defined for each column.

And example usage script provided at bottom.	

**``CommonTable(tableId[, tableClass[, container]])`` :** Creates new CommonTable with id and class (if provided, default class is "cm-table") and appends to container (if provided).

**``CommonTable.prototype.appendTo(container)`` :** Appends table to element.

**``CommonTable.prototype.prependTo(container)`` :** Prepends table to element.

**``CommonTable.prototype.addColumn(group, title, key[, dateFormat[, hdrStyles[, colStyles[, onClick]]]])``** : Add column. Parameters may either be specified as list of arguments, or formatted into single object literal with parameter names as below. Title and key are required.

* `group` (string) - The header group. If not null, used to group two or more headers as subheaders under a banner header (via colspan).
* `title` (string) - The title to display the header as.
* `key` (string) - The key used to retrieve data from this header.
* `dateFormat` (string) - Optional date format to format dates under this header.
* `hdrStyles` (string|object) - Optional styles to apply to the header. Overrides any colStyles properties.
* `colStyles` (string|object) - Optional styles to apply to every row in this column (including header). If you only want to apply to non-header cells, must override values in hdrStyles.
* `onClick` (function) - Optional onClick functionality to add to each cell (excluding header). Callback will be given the entire row's data as the parameter.

**``CommonTable.prototype.createHeaders([sortOnKey[, ascending]])`` :** [Re]draw table. Unlike `populateTable()`, this only redraws the headers (rest of the row are lost).

* `sortOnKey` (string) - Optional key to sort on.
* `ascending` (boolean) - If sorting, whether ascending or descending order.

**``CommonTable.prototype.populateTable(tableData[, sortOnKey[, ascending[, dateFormatter]]])`` :** Populate and [re]draw table.

* `tableData` (array) - Array of objects, representing data by row. Data is not stored to object or dynamically bound in any way. To update table, must be redrawn, passing the updated data array.
* `sortOnKey` (string) - Optional key to sort on.
* `ascending` (boolean) - If sorting, whether ascending or descending order.
* `dateFormatter` (function) - Optional date formatting function that takes parameters in the order of the date value and the date format. Will only be called if column header has a dateFormat value. Attempted in try-catch block, so all values are attempted to be formatted, but if formatter throws exception, continues as if non-date value.

----------

*Example usage:*

    var tbl = new CommonTable("my-table-id", "my-table-class");
	tbl.appendTo("#table-container");
	
	// first three columns under "Name" group
	tbl.addColumn("Name", "First", "firstName");
	tbl.addColumn("Name", "Nickname", "nickName");
	tbl.addColumn("Name", "Last", "lastName");
	tbl.addColumn(null, "Birthday", "birthDate", "UTC:yyyy-mm-dd");
	tbl.addColumn(null, "Wins", "winCount");
	tbl.addColumn(null, "Losses", "lossCount");
	tbl.addColumn(null, "Draws", "drawCount");

	var data = [
		{
			firstName: "Tony", 
			nickName: "El Cucuy", 
			lastName: "Ferguson", 
			winCount: 23, 
			lossCount: 3, 
			drawCount: 0, 
			birthDate: new Date(1984, 2, 12)
		}, 
		// etc...
	];

	tbl.populateTable(
		data, 
		"winCount",  // sort by wins descending
		false, 
		// pass dateFormat function to use on birthdate, a good one to use is Steven Levithan's
		// http://blog.stevenlevithan.com/archives/date-time-format
		function(value, format) {
			return dateFormat(value, format);
		}
	);

----------

### Acknowledgments ###

A huge bulk of this library was built on solutions found through the Mozilla Developers Network, StackOverflow, and many other smart folks. I would also like to thank SFEI, Bill Burr, and coffee. 
