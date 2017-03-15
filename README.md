# Web Common #

Lawrence Sim
Copyright 2017

## License ##

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Use ##

Import common.js and common.css for the base commons modules. Import common.table.js to add the table module.

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

JQuery is required for some functions to work.

## Global Additions ##

**window.defaultErrorMessage** : Default error message.

**window.browserType** : Stores information on browser type and version.

**window.commonGlobals** : Variables need for global functionality, do not modify.

**window.commonHelpersDefined** : Marked true once common functionality is instantiated.

## Prototype Modifications ##

**String.prototype.capitalize()** : Will capitalize the each word in the string (using whitespace to delineate words).

**Number.prototype.addCommas(precision)** : Will convert a given number to a string, using the supplied precision, with commas.

### JQuery Modifications ###

**jQuery.fn.center()** : Will center an element on screen using absolute positioning.

**jQuery.fn.addTooltip(tooltipMsg, direction)** : Will add a tooltip to an element using pure css. Direction may be "left", "right", "top", or "bottom" (defaults to "right").

**jQuery.fn.appendHelpIcon(tooltipMsg, direction, style)** : Will append a help icon at the end of this element, with a tooltip. Direction may be "left", "right", "top", or "bottom" (defaults to "right"). Style is optional styles object as keys-values which will be applied to the help icon.

**jQuery.fn.removeHelpIcon()** : Removes any appended help icon.

## Date (UTC) Modifications ##

**window.DateUTC(year, month, day, hour, min, sec)** : Creates a datetime, forced as UTC. Note that month is 1-12 (unlike Date constructor as 0-11).

**Date.prototype.asUTC()** : Converts datetime to UTC.

**Date.prototype.asUTCDate()** : Converts date only to UTC, dropping all time information.

**Date.prototype.toUTCDate()** : See above.

**Date.prototype.addDays(days)** : Returns new date with days added (or removed if negative).

**Date.prototype.daysInMonth()** : Returns number of days in the month for this date.

## Common Object ##

Returned as object if instantiated via CommonJS or AMD import. Otherwise appended to root as common (e.g. window.common).

**common.addGrabCursorFunctionality(element)** : Adds grab cursor functionality to draggable element.

**common.newWindow(e, url, name, width, height, minimal)** : Creates a new, centered window, even accounting for dual screen monitors.. The event object, if not provided, is grabbed from window.event. This is used to screen against middle-mouse clicks and ctrl+left-clicks which should be handled separately to create a new tab. If minimal is true, attempts to hide menubar, statusbar, and location -- though many modern browsers may prevent some or all of this.

### Modal Dialogs ###

**common.setModal(visible, content, options)** : Creates a new modal dialog (or closes, if visible=false). Content is the HTML content of the inner dialog element. Options may be provided with:

* id : Id of inner modal dialog element.
* showBackground : If true, creates a semi-transparent background over window.
* notExitable : Normally modal closes on clicking anywhere outside modal dialog element. If true, this prevents this functionality.
* hideCloser : If true, does not apply the automatically placed "X" to close dialog on upper-right.

**common.setModalAsLoading(visible, content, options)** : Creates a new modal dialog with default values prepped for loading, including options of: id=cm-"modal-loading-dialog"; addDetails=true; showBackground=true; notExitable=true; hideCloser=true; imgUrl="images/loader.gif".

## CommonTable Class ##

Requires common.table module.

** CommonTable(tableId, tableClass, container) ** : Creates new CommonTable with id and class (if provided, default class is "cm-table") and appends to container (if provided).

** CommonTable.prototype.appendTo(container) ** : Appends table to element.

** CommonTable.prototype.prependTo(container) ** : Prepends table to element.

** CommonTable.prototype.addColumn(group, title, key, dateFormat, hdrStyles, colStyles, onClick) ** : Add column. Parameters may either be specified as list of arguments, or formatted into single object literal with parameter names as below. Title and key are required.

* @param {String} group - The header group. If not null, used to group two or more headers as subheaders under a banner header (via colspan).
* @param {String} title - The title to display the header as.
* @param {String} key - The key used to retrieve data from this header.
* @param {String} [dateFormat] - Optional date format to format dates under this header.
* @param {String} [hdrStyles] - Optional styles to apply to the header. Overrides any colStyles properties.
* @param {String} [colStyles] - Optional styles to apply to every row in this column (including header). If you only want to apply to non-header cells, must override values in hdrStyles.
* @param {String} [onClick] - Optional onClick functionality to add to each cell (excluding header). Callback will be given the entire row's data as the parameter.