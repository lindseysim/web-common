# Web Common #

Web Common is a collection of polyfills, extensions, and modules I repeatedly found myself reapplying on new projects.

Lawrence Sim © 2022

## License ##

*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*

## Content ##

* [Usage](#usage)
* [Polyfills](#polyfills)
    * [Promises](#promises)
* [Global Browser Variable](#global-browser-variable)
* [Prototype Modifications](#prototype-modifications)
* [Date (UTC) Modifications](#date-utc-modifications)
* [Common](#common-object)
* [Common UI](#common-ui)
    * [Tooltips and Help Icons](#tooltips--help-icons)
    * [Modal Dialogs](#modal-dialogs)
* [CommonTable](#commontable-class)
* [Acknowledgments](#acknowledgments)

## Usage ##

Installation is best handled via NPM:

`npm install @lawrencesim/web-common`

Libraries can be imported with ES6 syntax as follows:

```javascript
import common from '@lawrencesim/web-common';
import '@lawrencesim/web-common/style.css';
import CommonTable from '@lawrencesim/web-common/CommonTable';
```

The first import will bring in the common module, including polyfills/extensions, and the UI submodule. If using the UI submodule or CommonTable module, you will also need to load the styles (second line), but otherwise, this can be left out. Note that depending on build configuration (e.g. Webpack) you may need proper style handlers to load the CSS styles. The final line loads the optional CommonTable class.

If using script imports in HTML, import the paths to 'common.js', 'style.css', and/or 'CommonTable.js' as needed in the main directory. The main module will be added as `common` and CommonTable as `CommonTable` to the global namespace.

&nbsp;

## Polyfills ##

Ensures the below functions exists, many of which are missing in Internet Explorer (pre-Edge).

<a name="common-arrayFrom" href="#common-arrayFrom">#</a>
*Array*.**from**(*arrayLike*[, *mapFn*[, *thisArg*]])

Create array from array-like or iterable.

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

<a name="common-arrayFind" href="#common-arrayFind">#</a>
*Array*.prototype.**find**(*callback*[, *thisArg*])

Find item in an array. 

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

<a name="common-elementRemove" href="#common-elementRemove">#</a>
*Element*.prototype.**remove**()

Remove element. 

See [https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)

<a name="common-elementAppend" href="#common-elementAppend">#</a>
*Element*.prototype.**append**(*nodes*)

Append to element. 

See [https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append)

<a name="common-elementPrepend" href="#common-elementPrepend">#</a>
*Element*.prototype.**prepend**(*nodes*)

Prepend to element. 

See [https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend)

<a name="common-elementMatches" href="#common-elementMatches">#</a>
*Element*.prototype.**matches**(*selectors*)

Check if element matches selector. 

See [https://developer.mozilla.org/en-US/docs/Web/API/Element/matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)

<a name="common-elementCloset" href="#common-elementCloset">#</a>
*Element*.prototype.**closest**(*selectors*)

Find closest element matching selector. 

See [https://developer.mozilla.org/en-US/docs/Web/API/Element/closest](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

<a name="common-elementClassList" href="#common-elementClassList">#</a>
*Element*.**classList** 

Ensures existence of `contains()`, `add()`, `remove()`, `toggle()`, and `replace()` functions in element's `classList` property. 

See [https://developer.mozilla.org/en-US/docs/Web/API/Element/classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)  

Note that IE and Edge cannot support `classList` on SVG elements (no polyfill available).

<a name="common-nodeListForEach" href="#common-nodeListForEach">#</a>
*NodeList*.prototype.**forEach**(*callback*[, *thisArg]*)

Functionally iterate through a `NodeList`. 

See [https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach)

<a name="common-stringStartsWith" href="#common-stringStartsWith">#</a>
*String*.prototype.**startsWith**(*searchString*[, *position*])

Check string starts with sequence. 

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)

<a name="common-stringEndsWith" href="#common-stringEndsWith">#</a>
*String*.prototype.**endsWith**(*searchString*[, *length*])

Check string ends with sequence. 

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

<a name="common-stringRepeat" href="#common-stringRepeat">#</a>
*String*.prototype.**repeat**(*count*)

Repeat string content. 

See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

&nbsp;

### Promises ###

Internally, [taylorhakes/promise-polyfill](https://github.com/taylorhakes/promise-polyfill) is called, if necessary, to polyfill for [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). However, it is only used locally and not added to the global namespace. As it's very lightweight (and I don't want to simply wrap/repackage Taylor's work), I recommend installing his library directly to your projects if you need a polyfill for Promises. Thus, if you think you will need to polyfill for Promises, bring in this library to your dependencies or else a error will occur when using [*common*.**ajax**()](#common-ajax) or [*common*.**animate**()](#common-animate) in a browser without support for Promises.

&nbsp;

## Global Browser Variable ##

Two variables are added to the `window` namespace (if it exists) that stores browser information.

| Param | Description |
| --- | :--- |
| `browser` | Stores information on browser type and version. |
| `browserType` |  Alias for `browser`, left for backwards compatibility. |

Note there are two formats in which data exists as browser information. One is a simple string parse of the UserAgent and version as key name and value. For certain user agents this may return multiple results. However there may exist a secondary 'is' variable, which is heuristically determined, that will give the specific browser.

E.g. for Opera browsers, with an example user agent of `"Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 OPR/74.0.3911.75"`, the `browser` object will show three separate browser versions and an `isOpera` variable:

```javascript
{
  chrome: 88, 
  safari: 537, 
  opera: 74, 
  isOpera: true
}
```

Currently, this checks for the following known browsers: Chrome, Firefox, Edge, IE, Safari, Opera, Brave, Samsung Internet, UCBrowser, Yandex, and QtWebEngine.

Note that this method of parsing the UserAgent string is somewhat brittle and can be unreliable, especially for those lesser-seen browsers (e.g. Android Browser) or those specific to devices (e.g. Kindle Browser). If this is critical, it is generally preferred to use feature detection instead.

&nbsp;

## Prototype Modifications ##

These useful functions are added to common object prototypes.

<a name="common-arrayGetOverlaps" href="#common-arrayGetOverlaps">#</a>
*Array*.**getOverlaps**(*a*, *b*) ⇒ `Array`<br />
<a name="common-arrayGetOverlaps" href="#common-arrayGetOverlaps">#</a>
*Array*.prototype.**getOverlaps**(*arr*) ⇒ `Array`

Get overlapping values with second array. Can be called from array instance or `Array` global. Uses strict equality.

<a name="common-arrayOverlaps" href="#common-arrayOverlaps">#</a>
*Array*.**overlaps**(*a*, *b*) ⇒ `boolean`<br />
*Array*.prototype.**overlaps**(*arr*) ⇒ `boolean`

Check if at least one value overlaps with second array. Can be called from array instance or `Array` global. Uses strict equality.

<a name="common-elementIsVisible" href="#common-elementIsVisible">#</a>
*Element*.prototype.**isVisible**() ⇒ `boolean`

Simple is-visible check using `offsetParent` trick. Note it will have issues with elements in fixed positions.

<a name="common-elementSetAttributes" href="#common-elementSetAttributes">#</a>
*Element*.prototype.**setAttributes**(*attrs*)

Sets multiple attributes (given as dictionary) at once.

<a name="common-elementCss" href="#common-elementCss">#</a>
*Element*.prototype.**css**(*style*[, *value*])

Much like the JQuery css() function, sets inline style, either as style name and value provided as strings, or given a dictionary of style names and values and key-value pairs. 

<a name="common-elementCenter" href="#common-elementCenter">#</a>
*Element*.prototype.**center**()

Will center an element on screen using absolute positioning.

<a name="common-elementAddCommas" href="#common-elementAddCommas">#</a>
*Number*.prototype.**addCommas**(*precision*) ⇒ `string`

Will convert a given number to a string, using the supplied precision, with commas.

<a name="common-elementAddCommasSmart" href="#common-elementAddCommasSmart">#</a>
*Number*.prototype.**addCommasSmart**([*minimum=0.001*]) ⇒ `string`

Basically wraps `Number.prototype.addCommas()` with heuristic guessing on precision to use. As well, the `minimum` parameter rounds any value whose absolute value is less than this to zero. Current heuristics are: evaluation to zero is always written as "0.0", less than 0.01 as exponential with three sig. figures, less than 0.1 as exponential with two sig. figures, less than 0.3 with three decimal places, less than 1.0 with two decimal places, less than 100 with one decimal place, and greater than or equal to 100 with no decimal places.

<a name="common-objectIsObject" href="#common-objectIsObject">#</a>
*Object*.**isObject**(*obj*) ⇒ `boolean`

Check is given object is an object-type. That is, not a primitive, string, or array. This includes any inheritance of the object prototype, except for arrays.

Uses [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) check with extra handling to invalidate array types.

<a name="common-objectIsObjectLiteral" href="#common-objectIsObjectLiteral">#</a>
*Object*.**isObjectLiteral**(*obj*) ⇒ `boolean`

Check is given object is an object literal-type. That is, not a primitive, string, array, or even any inheritance of the Object prototype. Must be a base object create either as an object literal  or via `new Object()`. Useful for when parameters must be ensured is an object-literal/dictionary.

Uses [`Object.getPrototypeOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) check.

<a name="common-stringCapitalize" href="#common-stringCapitalize">#</a>
*String*.prototype.**capitalize**([*breaks*]) ⇒ `string`

Will capitalize the each word in the string (using whitespace to delineate words). Additional break characters can be provided as either an array of characters or a string of all characters in the optional parameter `break`. E.g., to include hyphens, `"up-to-date".capitalize("-")`.

<a name="common-stringHeuristicCompare" href="#common-stringHeuristicCompare">#</a>
*String*.prototype.**heuristicCompare**(*compareString*) ⇒ `number`

Compare strings with numbers such that a "number" is not compared alphabetically by character but as the numeric value. 

Compares character by character such that numbers encountered at the same "place" are compared. If numbers are of different character length but equal numerically, continues reading strings, adjusting "place" for different digit length.

***Does not support negative numbers.** Negative symbols will be read as hyphen character.*

Returns numeric indicating whether `this` string comes before (-1), after (1), or is equal (0) to compared string. As such, can be inserted into most sort functions such as [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) as the compare function.

```javascript
"a01b02".heuristicCompare("a1b2");  // 0
"ab20".heuristicCompare("ab1");     // 1
"ab9".heuristicCompare("ab999");    // -1
"ba20".heuristicCompare("ab1");     // 1
```

&nbsp;

## Date (UTC) Modifications ##

Additional functions for handling basic Date objects are added. Specifically to ensure UTC handling.

<a name="common-DateUTC" href="#common-DateUTC">#</a>
**DateUTC**(*year*, *month*, *day*[, *hour*[, *min*[, *sec*]]]) ⇒ `Date`

Creates a datetime, forced as UTC. **Note that month must be indicated as 1-12** (unlike traditional Date constructor as 0-11).

<a name="common-dateAsUTC" href="#common-dateAsUTC">#</a>
*Date*.prototype.**asUTC**() ⇒ `Date`

Converts datetime to UTC assuming time given (assumed localtime) was actually meant as UTC time. That is to say, the date/time in localtime will be kept as the UTC date/time, only changing timezone.

```javascript
d = new Date(2019, 0, 1, 20);  // Tue Jan 01 2019 20:00:00 GMT-0800 (Pacific Standard Time)
d.asUTC();                     // Tue Jan 01 2019 12:00:00 GMT-0800 (Pacific Standard Time)
// Assumed Jan 1 2019 at 20:00 was meant as UTC
// Converted back to PST is 8 hours earlier, which is what it prints
```

<a name="common-dateToUTC" href="#common-dateToUTC">#</a>
*Date*.prototype.**toUTC**() ⇒ `Date`

Creates new `DateUTC` using the UTC datetime of this object, converted from localtime.

```javascript
d = new Date(2019, 0, 1, 20);  // Tue Jan 01 2019 20:00:00 GMT-0800 (Pacific Standard Time)
d.toUTC();                     // Tue Jan 01 2019 20:00:00 GMT-0800 (Pacific Standard Time)
// No change, as printing is always done in localtime, conversion is mostly symbolic
// This function only left in for clarity, but really doesn't do anything
```

<a name="common-dateAsUTCDate" href="#common-dateAsUTCDate">#</a>
*Date*.prototype.**asUTCDate**() ⇒ `Date`

Converts date dropping any time information and assuming 12:00 AM UTC. Does not convert localtime, assuming it was given incorrectly.

```javascript
d = new Date(2019, 0, 1, 20);  // Tue Jan 01 2019 20:00:00 GMT-0800 (Pacific Standard Time)
d.asUTCDate();                 // Mon Dec 31 2018 16:00:00 GMT-0800 (Pacific Standard Time)
// Assumes Jan 1, 2019 (date-only) in UTC time (though constructed with localtime)
// Drops time information, making it Jan 1, 2019 at 00:00 UTC
// Which is 16:00 PST the previous day in PST, which is what it prints
```

<a name="common-dateToUTCDate" href="#common-dateToUTCDate">#</a>
*Date*.prototype.**toUTCDate**() ⇒ `Date`

Converts date dropping any time information and assuming 12:00 AM UTC. Uses local date of instance converted to UTC.

```javascript
d = new Date(2019, 0, 1, 20);  // Tue Jan 01 2019 20:00:00 GMT-0800 (Pacific Standard Time)
d.toUTCDate();                 // Tue Jan 01 2019 16:00:00 GMT-0800 (Pacific Standard Time)
// Jan 1, 2019 at 20:00 in PST is Jan 2, 2019 at 04:00 in UTC
// UTC date taken as is, time is dropped, leaving it at Jan 2, 2019 at 00:00 in UTC
// Which is 16:00 PST the previous day in PST, which is what it prints
```

<a name="common-dateAddDays" href="#common-dateAddDays">#</a>
*Date*.prototype.**addDays**(*days*) ⇒ `Date`

Returns new date with days added (or removed if negative).

<a name="common-dateMonthOfYear" href="#common-dateMonthOfYear">#</a>
*Date*.prototype.**monthOfYear**() ⇒ `number`

Returns the month of the year as 1-12 number (as opposed to 0-11 for `getMonth()`).

<a name="common-dateDaysInMonth" href="#common-dateDaysInMonth">#</a>
*Date*.prototype.**daysInMonth**() ⇒ `number`

Returns number of days in the month for this date.

&nbsp;

## Common Object ##

Returned as object if instantiated via CommonJS or AMD import. Otherwise appended to root as common (e.g. `window.common`).
 
<a name="common-getElement" href="#common-getElement">#</a>
*common*.**getElement**(*element*) ⇒ `Element`

Given an object, returns an `Element`. If a single `Element` is provided, simply returns it. If an array is provided, returns the first item (or undefined if empty). If a `NodeList`, or other iterable is provided, returns value of `next()` or null if done. If `jQuery` object is provided, returns first result in [`element.get()`](https://api.jquery.com/get/), or null if no results. If string is provided, returns result of `document.querySelector(element)`. If none of the above apply, returns null;

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `jQuery` \| `String` | Object to convert to `Element`. |
 
<a name="common-getElementList" href="#common-getElementList">#</a>
*common*.**getElementList**(*element*) ⇒ `Element[]`

Given any input, converts it into an array (assumedly of Elements). If undefined input, returns an empty array. If a `NodeList`, array, or other iterable is provided, converts to an array via `Array.from()`. If a `jQuery` object is provided, returns array given by calling [`.get()`](https://api.jquery.com/get/) on it. If a string is provided, returns result of `document.querySelectorAll(element)` converted into an array. Otherwise, the default behavior is to simply wrap the input object into an array (such that if provided, e.g. an `Element` instance)

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Object to convert to array or `NodeList`. |

<a name="common-extend" href="#common-extend">#</a>
*common*.**extend**(*obj*, *extend*[, *allowOverwrite*[, *deepCopy*]]) ⇒ `Object`

Copy given object and extended with new values.

If `extend` is null, a copy of `obj` is returned. If `obj` is null, `extend` is simply returned as is. The returned value is simply a passed reference to the input object, unless `deepCopy` is true. 

If both are specified, values in first levels of `obj` and `extend` are copied to a cloned object by simply passing the value. Thus primitive types are copied by value, but objects will be copied by reference, unless `deepCopy` is true.

Deep copy is done via `JSON.parse(JSON.stringify())`, which may result in some data loss (e.g. functions will not get copied properly).

| Param | Type | Description |
| :--- | :---: | :--- |
| obj | `Object` | Base object |
| extend | `Object` | Object of extensions to base object |
| allowOverwrite | `Boolean` | Unless true, items in `extend` matching existing values in `obj` by key are not copied over. |
| deepCopy | `Boolean` | If true, all values are copied via JSON.parse(JSON.stringify()), ensuring a deep copy. |

<a name="common-getUrlGetVars" href="#common-getUrlGetVars">#</a>
*common*.**getUrlGetVars**() ⇒ `Object`

Retrieve GET parameters in current URL as an object literal (dictionary format).

<a name="common-newWindow" href="#common-newWindow">#</a>
*common*.**newWindow**(*url*, *name*, *width*, *height*[, *minimal*]) ⇒ `Window`

Creates a new, centered window, even accounting for dual screen monitors.. The `event` object, if not provided, is grabbed from `window.event`. This is used to screen against middle-mouse clicks and ctrl+left-clicks which should be handled separately to create a new tab. If `minimal` is true, attempts to hide `menubar`, `statusbar`, and `location` -- though many modern browsers may prevent some or all of this.

| Param | Type | Description |
| :--- | :---: | :--- |
| url | `String` | URL for new window or an object literal with all parameters as properties. |
| name | `String` | New window name. |
| width | `Number` | Width in pixels. |
| height | `Number` | Height in pixels. |
| minimal | `Boolean` | If true forces hiding of menubar, statusbar, and location -- although with many modern browsers this has no effect as it is not allowed. |

<a name="common-ajax" href="#common-ajax">#</a>
*common*.**ajax**(*params*) ⇒ `XMLHttpRequest` | `Promise`

Mimics [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/) function call with `XMLHttpRequest`.

However, if the project allows, I'd nowadays recommend using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead (if needed, a [polyfill](https://github.com/github/fetch) is also available as `whatwg-fetch` in NPM).

| Param | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| params.url | `String` |  | The URL of the request. |
| params.async | `Boolean` | `true` | Asynchronous. Defaults to true. |
| params.method | `String` | `"GET"` | Method for passing data. |
| params.data | `Object` |  | Optional dictionary of data to send with request. |
| params.dataType | `String` |  | Type of returned data. See [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType). |
| params.success | `Callback` |  | Callback on success. Passes parameters of `XMLHttpRequest.responseText`, `XMLHttpRequest.statusText`, and the `XMLHttpRequest` instance itself. |
| params.error | `Callback` |  | Callback on error. Passes parameters the `XMLHttpRequest` instance, `XMLHttpRequest.statusText`, and `XMLHttpRequest.responseText`. |
| params.complete | `Callback` |  | Callback on completion (whether success or error). Passes parameters the `XMLHttpRequest` instance and `XMLHttpRequest.statusText`. |
| params.user | `String` |  | Optional username, if necessitated. |
| params.password | `String` |  | Optional password, if necessitated. |
| params.promise | `Boolean` |  | Optionally return as Promise that resolves when the request resolves. |

<a name="common-animate" href="#common-animate">#</a>
*common*.**animate**(*element*, *properties*, *durationMs*[, *easing*[, *complete*]]]) ⇒ `Promise`

Mimics [jQuery.animate()](http://api.jquery.com/jQuery.animate/) function using CSS3 transitions.

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` | The Element to animate. Or an object literal with all parameters are properties. |
| properties | `Object` | CSS properties to animate to. Note not all properties are animatable. See [animatable CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties). |
| durationMs | `Number` | Duration of animation, in milliseconds. |
| timingFunction | `String` | Timing/easing function, defaults to "ease". See: [transition-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). |
| complete | `Callback` | Optional callback to run on completion. |

&nbsp;

## Common UI ##

Packaged with `common` as `common.ui`.

The Common UI modules allow for some simple, commonly-used UI functionality, mostly through CSS. As such, `common.min.css` is required.

For modal dialog usage, ensure your dependency-manager/import-function is caching requires/imports of the `common` object, or that you are passing the object by reference. Calling multiple instances of `common.ui` in the same window can result in odd behavior for modal management.

<a name="common-addGrabCursorFunctionality" href="#common-addGrabCursorFunctionality">#</a>
*common*.*ui*.**addGrabCursorFunctionality**(*element*)

Adds grab cursor functionality to draggable element. Element may be single element, a NodeList/Array of elements, or a jQuery selection.

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to add functionality to. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |

<a name="common-createDropdown" href="#common-createDropdown">#</a>
*common*.*ui*.**createDropdown**(*element*, *menu*)

Create a dropdown menu on an element. *menu* parameter is an array of object literals defining the menu. The parameters 'id', 'class', 'style', and 'text', if they exist, are applied. For functionality, either add 'href' and optionally 'target' parameters or supply a callback to an 'onClick' parameter. To create a submenu, simply add a 'menu' parameter with the same nested structure. 

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to add dropdown to. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |
| menu | `Object[]` | JSON map of menu |

*Example usage:*

```javascript
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
```

<a name="common-clearDropdown" href="#common-clearDropdown">#</a>
*common*.*ui*.**clearDropdown**(*element*)

Remove dropdown menu functionality from an element.

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to remove dropdown from. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |

&nbsp;  

#### Tooltips & help icons ####

The tooltips and help icons functionality can be applied manually as well.

To add a tooltip, simply add a class of `cm-tooltip-left`, `cm-tooltip-top`, `cm-tooltip-right`, or `cm-tooltip-bottom` and the attribute `cm-tooltip-msg` with the tooltip message. To create a help icon, simply create the element `<i>?</i>`, with class `cm-icon`.

<a name="common-addTooltip" href="#common-addTooltip">#</a>
*common*.*ui*.**addTooltip**(*element*, *message*[, *direction*[, *force*]])

Add hover tooltip to element(s).

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to remove dropdown from. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |
| message | `String` | Tooltip message/HTML. |
| direction | `String` | Direction of tooltip (defaults to top). |
| force | `Boolean` | If true, forces tooltip visible. |

<a name="common-removeTooltip" href="#common-removeTooltip">#</a>
*common*.*ui*.**removeTooltip**(*element*)

Remove hover tooltip from element(s).

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to remove dropdown from. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |

<a name="common-appendHelpIcon" href="#common-appendHelpIcon">#</a>
*common*.*ui*.**appendHelpIcon**(*element*, *message*[, *direction*[, *style*[, *force*]]])

Add help icon to element(s) as (?) styled icon with tooltip.

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to remove dropdown from. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |
| message | `String` | Tooltip message/HTML. |
| direction | `String` | Direction of tooltip (defaults to top). |
| style | `Object` | Dictionary of inline style key-values for icon. |
| force | `Boolean` | If true, forces tooltip visible. |
 
<a name="common-removeHelpIcon" href="#common-removeHelpIcon">#</a>
*common*.*ui*.**removeHelpIcon**(*element*)

Remove help icon from element(s).

| Param | Type | Description |
| :--- | :---: | :--- |
| element | `Element` \| `NodeList` \| `jQuery` \| `String` | Element to remove dropdown from. See [`common.getElementList()`](#common-getElementList) for evaluation of this parameter. |

&nbsp;  

#### Modal dialogs ####

For modal dialog usage, ensure your dependency-manager/import-function is caching requires/imports of the `common` object, or that you are passing the object by reference. Calling multiple instances of `common.ui` in the same window can result in odd behavior for modal management.

When a modal function is first called, this library appends a hidden div to `body` to handle modals/dialogs. This includes a container div (`#cm-modal-container`), an outer modal div (`#cm-modal-outer`) with absolute positioning, and an inner div (`.cm-modal-inner`) which represents the actual dialog.

Only one modal may be open at a time. Opening another modal will replace the current one.

<a name="common-isModalOpen" href="#common-isModalOpen">#</a>
*common*.*ui*.**isModalOpen**() ⇒ `boolean`

Check whether modal is open.

<a name="common-setModal" href="#common-setModal">#</a>
*common*.*ui*.**setModal**(*visible*, *content*, *options*]])<br />
<a name="common-setModal" href="#common-setModal">#</a>
*common*.*ui*.**openModal**(*content*[, *options*])

Creates a new modal dialog (or closes, if visible=false). Function `openModal()` is the same with `visible` defaulted to `true`.

| Param | Type | Description |
| :--- | :---: | :--- |
| visible | `Boolean` | Whether to open or close modal |
| content | `String` | Modal content HTML |
| options | `Object` |  |
| options.id | `String` | Id of inner modal dialog element. |
| options.showBackground | `Boolean` | If true, creates a semi-transparent background over window. |
| options.notExitable | `Boolean` | Normally modal closes on clicking anywhere outside modal dialog element. If true, this prevents this functionality. |
| options.hideCloser | `Boolean` | If true, does not apply the automatically placed "X" to close dialog on upper-right. |
| options.onClose | `Callback` | Callback to run on modal being closed.  |

&nbsp; &nbsp; **Returns:** `Element` of modal content div (`.cm-modal-inner`).

<a name="common-setModalAsLoading" href="#common-setModalAsLoading">#</a>
*common*.*ui*.**setModalAsLoading**([*content*[, *options*]])

Creates a new modal dialog with default values prepped for loading. `content` is optional and defaults to `"Loading.."`. In addition to same `options` available for [`common.setModal()`](#common-setModal), extended `options` are:

| Param | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| content | `String` | `"Loading.."` | Modal content HTML |
| options | `Object` |  |
| options.id | `String` | `"modal-loading-dialog"` | Id of inner modal dialog element. |
| options.showBackground | `true` | `Boolean` | If true, creates a semi-transparent background over window. |
| options.notExitable | `Boolean` | `true` | Normally modal closes on clicking anywhere outside modal dialog element. If true, this prevents this functionality. |
| options.hideCloser | `Boolean` | `true` | If true, does not apply the automatically placed "X" to close dialog on upper-right. |
| options.addDetails | `Boolean` | `true` | If true, creates a semi-trans |
| options.addDetailsText | `String` | `"Please wait.."` | If true, creates a semi-trans |

&nbsp; &nbsp; **Returns:** `Element` of modal content div (`.cm-modal-inner`).
 
<a name="common-changeModal" href="#common-changeModal">#</a>
*common*.*ui*.**changeModal**(*content*[, *prepContentCallback*[, *hideCloser*]]) ⇒ `Element` of modal content div (`.cm-modal-inner`)

Change modal dialog content while leaving all other options the same. Keeps the content-size changes from being too jarring when swapping content by adding small CSS animation to fit new size. If there was a custom width/height defined in the modal's style, these will be lost.

| Param | Type | Description |
| :--- | :---: | :--- |
| content | `String` | Modal content HTML |
| prepContentCallback | `Callback` | If some prep work is needed before determining the new dimensions of the modal for size change animation. |
| hideCloser | `Boolean` | Due to HTML refresh, closer will be readded unless this is set to true. |

<a name="common-closeModal" href="#common-closeModal">#</a>
*common*.*ui*.**closeModal**([*suppressOnClose*])<br />
<a name="common-closeModal" href="#common-closeModal">#</a>
*common*.*ui*.**hideModal**([*suppressOnClose*])

Hide any currently visible modal.

| Param | Type | Description |
| :--- | :---: | :--- |
| suppressOnClose | `Boolean` | If true, suppresses `onClose` event callback, if one is attached. |

&nbsp;

## CommonTable Class ##

Table handling object which handles data formatting, grouped column, column sorting, and basic styling.

Must be separately imported. Returned as object if instantiated via CommonJS or AMD import. Otherwise appended to root as CommonTable class. Require base Common module to have been imported, as it depends on some the prototype modifications defined there.

To use, begin by creating instance and adding columns with `addColumn()`. The `key` parameter defines how to assign the data to each column. Other parameters allow various style and formatting methods. Once all columns are added, add data and draw the table with `populateTable()`. The data, sent as an array of object literals/dictionaries, is mapped to the columns automatically with the `key` defined for each column.

And example usage script provided at bottom.  

<a name="CommonTable" href="CommonTable">#</a>
**CommonTable**(*tableId*[, *tableClass*[, *container*]])**

Creates new CommonTable with id and class (if provided, default class is "cm-table") and appends to container (if provided).

| Param | Type | Description |
| :--- | :---: | :--- |
| tableId | `String` | Table ID |
| tableClass | `String` | Table classname |
| container | `Element` | Element to create table in |

<a name="CommonTable-appendTo" href="CommonTable-appendTo">#</a>
*CommonTable*.prototype.**appendTo**(*container*)

Appends table to element.

| Param | Type | Description |
| :--- | :---: | :--- |
| container | `Element` | Element to append table in |

<a name="CommonTable-prependTo" href="CommonTable-prependTo">#</a>
*CommonTable*.prototype.**prependTo**(*container*)

Prepends table to element.

| Param | Type | Description |
| :--- | :---: | :--- |
| container | `Element` | Element to prepend table in |

<a name="CommonTable-addColumn" href="CommonTable-addColumn">#</a>
*CommonTable*.prototype.**addColumn**(*group*, *title*, *key*[, *options*])

Add column. Parameters may either be specified as list of arguments, or formatted into single object literal with parameter names as below. Title and key are required.

| Param | Type | Description |
| :--- | :---: | :--- |
| group | `String` | The header group. If not null, used to group two or more headers as subheaders under a banner header (via colspan). |
| title | `String` | The title to display the header as. |
| key | `String` | The key used to retrieve data from this header. |
| options | `Object` | |
| options.format | `Function` | Optional function such that `format(value)`, returns the formatted value for the table cell. Run in try-catch block, so if it fails, simply continues with raw value. |
| options.hdrStyles | `String` \| `Object` | Optional styles to apply to the header. Overrides any colStyles properties. |
| options.colStyles | `String` \| `Object` | Optional styles to apply to every row in this column (including header). If you only want to apply to non-header cells, must override values in hdrStyles. |
| options.onClick | `Function` | Optional onClick listener to add to each cell (excluding header). Callback will be given the entire row's data as the parameter. |
| options.sortable | `Boolean` | Optional flag to set/disable sortable column on this column. By default columns are sortable, so set as false or null to disable. |

<a name="CommonTable-createHeaders" href="CommonTable-createHeaders">#</a>
*CommonTable*.prototype.**createHeaders**([*sortOnKey*[, *ascending*]])

[Re]draw table. Unlike `populateTable()`, this only redraws the headers (rest of the rows are lost).

| Param | Type | Description |
| :--- | :---: | :--- |
| sortOnKey | `String` | Optional key to sort on. |
| ascending | `Boolean` | If sorting, whether ascending or descending order. |

<a name="CommonTable-populateTable" href="CommonTable-populateTable">#</a>
*CommonTable*.prototype.**populateTable**(*tableData*[, *sortOnKey*[, *ascending*]]])

Populate and [re]draw table.

| Param | Type | Description |
| :--- | :---: | :--- |
| tableData | `Object[]` | Array of objects, representing data by row. Data is not stored to object or dynamically bound in any way. To update table, must be redrawn, passing the updated data array. |
| sortOnKey | `String` | Optional key to sort on. |
| ascending | `Boolean` | If sorting, whether ascending or descending order. |

&nbsp;

----------

*Example usage:*

```javascript
var tbl = new CommonTable("my-table-id", "my-table-class");
tbl.appendTo(document.body);

// first three columns under "Name" header group
tbl.addColumn("Name", "First", "firstName");
tbl.addColumn("Name", "Nickname", "nickName");
tbl.addColumn("Name", "Last", "lastName");
// add generic meta-data (to be used later)
tbl.addColumn(
  null, 
  "Birthday", 
  "birthDate", 
  {
    format: function(val) {
      return (val.getMonth()+1).toString() + "/" + val.getDate().toString() + "/" + val.getFullYear().toString()
    }
  }
);
// other columns
tbl.addColumn(null, "Wins", "winCount");
tbl.addColumn(null, "Losses", "lossCount");
tbl.addColumn(null, "Draws", "drawCount");

var data = [
    {
        firstName: "Tony", 
        nickName: "El Cucuy", 
        lastName: "Ferguson", 
        winCount: 25, 
        lossCount: 8, 
        drawCount: 0, 
        birthDate: new DateUTC(1984, 2, 12)
    }, 
    {
        firstName: "Khabib", 
        nickName: "The Eagle", 
        lastName: "Nurmagomedov", 
        winCount: 29, 
        lossCount: 0, 
        drawCount: 0, 
        birthDate: new DateUTC(1988, 9, 20)
    }, 
    // etc...
];

tbl.populateTable(data, "winCount", false);  // sort by wins descending
```

----------

### Acknowledgments ###

A huge bulk of this library was built on solutions found through the Mozilla Developers Network, StackOverflow, and many other smart folks. I would also like to thank SFEI, Bill Burr, and coffee. 
