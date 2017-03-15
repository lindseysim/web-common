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

### Global Additions ###

**window.defaultErrorMessage** : Default error message.

**window.browserType** : Stores information on browser type and version.

**window.commonGlobals** : Variables need for global functionality, do not modify.

**window.commonHelpersDefined** : Marked true once common functionality is instantiated.

### Prototype Modifications ###

**String.prototype.capitalize()** : Will capitalize the each word in the string (using whitespace to delineate words).

**Number.prototype.addCommas(precision)** : Will convert a given number to a string, using the supplied precision, with commas.

### JQuery Modifications ###

**jQuery.fn.center()** : Will center an element on screen using absolute positioning.

**jQuery.fn.addTooltip(tooltipMsg, direction)** : Will add a tooltip to an element using pure css.

**jQuery.fn.appendHelpIcon(tooltipMsg, direction, style)** : Will append a help icon at the end of this element, with a tooltip.

**jQuery.fn.removeHelpIcon()** : Removes any appended help icon.

### Date (UTC) Modifications ###

**window.DateUTC(year, month, day, hour, min, sec)** : Creates a datetime, forced as UTC. Note that month is 1-12 (unlike Date constructor as 0-11).

**Date.prototype.asUTC()** : Converts datetime to UTC.

**Date.prototype.asUTCDate()** : Converts date only to UTC, dropping all time information.

**Date.prototype.toUTCDate()** : See above.

**Date.prototype.addDays(days)** : Returns new date with days added (or removed if negative).

**Date.prototype.daysInMonth()** : Returns number of days in the month for this date.