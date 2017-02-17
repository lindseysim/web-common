!function(root, factory) {
	// CommonJS-based (e.g. NodeJS) API
	if(typeof module === "object" && module.exports) {
		module.exports = factory(require("jquery"));
	// AMD-based (e.g. RequireJS) API
	} else if(typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	// Regular instantiation 
	} else {
		root.common = factory(root.$);
	}
}(this, function($) {
	
	if(!window.commonHelpersDefined) {
		//****************************************************************************************************
		// Misc prototype extensions
		//****************************************************************************************************
		/**
		 * Capitalize the first letter of every word. (A word is determined by any string preceded by 
		 * whitespace, as such ignores second word in hyphenated compound words).
		 * @returns {string} Capitalized version of this string.
		 */
		String.prototype.capitalize = function() {
			return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		};
		
		/**
		 * Return string value of this number with commas added.
		 * @param {number} precision - Decimal precision.
		 * @returns {String}
		 */
		Number.prototype.addCommas = function(precision){
			var n = this, 
				precision = isNaN(precision = Math.abs(precision)) ? 0 : precision, 
				sign = n < 0 ? "-" : "", 
				number = parseInt(n = Math.abs(+n || 0).toFixed(precision)) + "", 
				digits = (digits = number.length) > 3 ? digits % 3 : 0;
			return sign + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (precision ? "." + Math.abs(n - number).toFixed(precision).slice(2) : "");
		};
		
		/**
		 * Center itself in the window with absolute positioning.
		 * @returns {jQuery} Itself.
		 */
		jQuery.fn.center = function() {
			this.css({
				position: "absolute", 
				top:  Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()),
				left: Math.max(0, (($(window).width()  - $(this).outerWidth())  / 2) + $(window).scrollLeft())
			});
			return this;
		};
		
		/**
		 * Add tooltip.
		 * @param {string} tooltipMsg - The tooltip content.
		 * @param {string} [direction="right"] - Side in which tooltip should appear.
		 * @returns {jQuery} Itself.
		 */
		jQuery.fn.addTooltip = function(tooltipMsg, direction) {
			if(!tooltipMsg) {
				this.removeClass("cm-tooltip-left cm-tooltip-right cm-tooltip-top cm-tooltip-bottom");
				this.removeAttribute("cm-tooltip-msg");
				return;
			}
			var dirs = ["right", "left", "top", "bottom"], 
				iDir = -1;
			if(direction) {
				iDir = $.inArray(direction.toLowerCase().trim(), dirs);
			}
			if(iDir >= 0) {
				for(var i = 0; i < dirs.length; i++) {
					if(i === iDir) {
						this.addClass("cm-tooltip-"+dirs[i]);
					} else {
						this.removeClass("cm-tooltip-"+dirs[i]);
					}
				}
			}
			this.attr("cm-tooltip-msg", tooltipMsg);
			return this;
		};
		
		/**
		 * Add help icon with tooltip.
		 * @param {string} tooltipMsg - The tooltip content.
		 * @param {string} [direction="right"] - Side in which tooltip should appear.
		 * @param {Object} [style] - Additional optional styles to the icon.
		 * @returns {jQuery} Itself.
		 */
		jQuery.fn.appendHelpIcon = function(tooltipMsg, direction, style) {
			if(!direction) { direction = "top"; }
			var i = $("<i>", {"class": "cm-icon", "text": "?"}).appendTo(this)
				.addTooltip(tooltipMsg, direction);
			if(style) { i.css(style); }
			return this;
		};
		
		jQuery.fn.removeHelpIcon = function() {
			this.find(".cm-icon").remove();
		};
		
		//****************************************************************************************************
		// Date prototype extensions
		//****************************************************************************************************
		/**
		 * Because javascript's Date library is lacking. Major difference is it ensures entered as UTC time 
		 * and month is supplied as 1-12 number, not 0-11.
		 * @param {number} year - Either year or millisecond epoch time (if latter, leave rest params null)
		 * @param {number} month - Month 1-12 !!Important!!, this is different than normal, which works 0-11
		 * @param {number} day - Day 1-31
		 * @param {number} hour - Hour 0-23
		 * @param {number} min - Minute 0-59
		 * @param {number} sec - Second 0-59
		 * @returns {Date}
		 */
		DateUTC = function(year, month, day, hour, min, sec) {
			if(!month && !day && !hour && !min && !sec) {
				return new Date(parseInt(year));
			}
			return new Date(Date.UTC(
				parseInt(year), 
				month ? parseInt(month)-1 : 0, 
				day   ? parseInt(day)     : 1, 
				hour  ? parseInt(hour)    : 0, 
				min   ? parseInt(min)     : 0, 
				sec   ? parseInt(sec)     : 0
			));
		};
		window.DateUTC = DateUTC;
		
		/**
		 * Convert date to UTC date assuming that the time as given in local time was incorrectly meant for 
		 * UTC. E.g., a value of 8:00 PST will just be converted to 8:00 UTC instead of properly translated to
		 * 16:00 UTC.
		 * @returns {Date}
		 */
		Date.prototype.asUTC = function() {
			return new Date(Date.UTC(
				this.getFullYear(), 
				this.getMonth(), 
				this.getDate(),  
				this.getHours(), 
				this.getMinutes(), 
				this.getSeconds()
			));
		};
		
		/**
		 * Convert to date dropping any time information and assuming 12:00 AM UTC. Uses UTC date of instance.
		 * E.g. Jan 1 at 20:00 hours PST will result in Jan 2 at 0:00 hours UTC, or Jan 1 at 16:00 hours PST.
		 * @returns {Date}
		 */
		Date.prototype.asUTCDate = function() {
			return new Date(Date.UTC(
				this.getUTCFullYear(), 
				this.getUTCMonth(), 
				this.getUTCDate()
			));
		};
		
		/**
		 * Convert to date dropping any time information and assuming 12:00 AM UTC. Uses local date of 
		 * instance. Thus Jan 1 at 20:00 hours PST will result in Jan 1 at 0:00 hours UTC, or Dec 31 of the 
		 * previous year in PST.
		 * @returns {Date}
		 */
		Date.prototype.toUTCDate = function() {
			return new Date(Date.UTC(
				this.getFullYear(), 
				this.getMonth(), 
				this.getDate()
			));
		};
		
		/**
		 * Get new date instance with amount of days added (or subtracted if negative).
		 * @param {number} days
		 * @returns {Date}
		 */
		Date.prototype.addDays = function(days) {
			return new Date(this.getTime() + days*86400000);
		};
		
		/**
		 * Get the number of days in this date instance's (UTC) month and year.
		 * @returns {number} number of days in month
		 */
		Date.prototype.daysInMonth = function() {
			return (new Date(this.getUTCFullYear(), this.getUTCMonth()+1, 0)).getDate();
		};
		
		
		//****************************************************************************************************
		// Misc. Globals
		//****************************************************************************************************
		window.defaultErrorMessage = "This site is experiencing some technical difficulties. Please try again later. ";
		
		// note, none of these browser checks are future-proof, periodically update as necessary
		var ua = navigator.userAgent.toLowerCase();
		window.browserType = {};
		window.browserType.isOpera   = (!!window.opr && !!opr.addons) || !!window.opera || ua.indexOf(' opr/') >= 0;
		window.browserType.isFirefox = typeof InstallTrigger !== 'undefined';
		window.browserType.isSafari  = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		window.browserType.isChrome  = !!window.chrome && !window.browserType.isOpera;
		window.browserType.isIE      = /*@cc_on!@*/false || !!document.documentMode;
		window.browserType.isEdge    = !window.browserType.isIE && !!window.StyleMedia;
		if(window.browserType.isIE) {
			if(ua.indexOf('msie') >= 0) {
				window.browserType.ieVersion = parseInt(ua.split('msie')[1]);
			} else if(ua.indexOf('trident/') >= 0) {
				window.browserType.ieVersion = parseInt(ua.split('rv:')[1]);
			} else {
				window.browserType.ieVersion = 9999;
			}
		} else if(window.browserType.isEdge) {
			var match = ua.match(/edge\/([0-9]+)\./);
			window.browserType.edgeVersion = match ? parseInt(match[1]) : 9999;
		} else if(window.browserType.isChrome) {
			var match = ua.match(/chrom(e|ium)\/([0-9]+)\./);
			window.browserType.chromeVersion = match ? parseInt(match[2]) : 9999;
		} else if(window.browserType.isFirefox) {
			var match = ua.match(/firefox\/([0-9]+)\./);
			window.browserType.firefoxVersion = match ? parseInt(match[1]) : 9999;
		} else if(window.browserType.isSafari) {
			var match = ua.match(/safari\/([0-9]+)\./);
			window.browserType.safariVersion = match ? parseInt(match[1]) : 9999;
		} else if(window.browserType.isOpera) {
			var match = ua.match(/opera|opr\/([0-9]+)\./);
			window.browserType.operaVersion = match ? parseInt(match[1]) : 9999;
		}
		
		
		//****************************************************************************************************
		// Prep for modal content
		//****************************************************************************************************
		window.commonGlobals = {};
		// Add modal content (if not already existing)
		if($("#cm-modal-outer").length === 0) {
			$("<div>", {'class': 'cm-modal-inner'}).appendTo(
				$("<div>", {id: 'cm-modal-container'}).appendTo(
					$("<div>", {id: 'cm-modal-outer'}).appendTo("body")
				)
			);
		}
		$("#cm-modal-outer").hide();
		// Add modal close functionality by clicking anywhere not in the modal
		$("#cm-modal-outer").click(function(evt) {
			if(window.commonGlobals.modalNotExitable) { return; }
			if(!$(evt.target).closest('#cm-modal-container div').length) {
				$("#cm-modal-outer").hide();
			}
		});
	
		// set global helpers as defined
		window.commonHelpersDefined = true;
	}
	
	
	//********************************************************************************************************
	// Return object of utility functions
	//********************************************************************************************************
	return {
		/**
		 * Adds the handling of adding/removing the 'grab' and 'grabbing' css classes on mouse drag events. 
		 * Original for the map (as OpenLayers doesn't do this automatically) but useful for a lot of other 
		 * stuff, like custom dialog boxes/windows.
		 * @param {jQuery} element - jQuery object for element to add functionality to.
		 */
		addGrabCursorFunctionality: function(element) {
			$(element)
				.addClass("grab")
				.mousedown(function() {
					element.removeClass("grab").addClass("grabbing");
				})
				.mouseup(function() {
					element.removeClass("grabbing").addClass("grab");
				});
		}, 

		/**
		 * Custom function to create a new window. Has a lot of useful functionality that gets commonly used, 
		 * e.g. having every new window centered on the monitor, even accounting for dual monitor setups.
		 * @param {event} e - Event object (useful on links where you want to keep the middle-mouse clicks and
		 *        ctrl+left-clicks as new tabs as those are filtered and ignored).
		 * @param {string} url - Link URL.
		 * @param {string} name - New window name.
		 * @param {number} width - Width in pixels.
		 * @param {number} height - Height in pixels.
		 * @param {boolean} minimal - If true forces hiding of menubar, statusbar, and location (although with
		 *        many modern browsers this has no effect).
		 * @returns {Window} The new window object.
		 */
		newWindow: function(e, url, name, width, height, minimal) {
			if(!e) e = window.event;
			if(e === undefined || !(e.which === 2 || (e.which === 1 && e.ctrlKey))) {
				// center window, from http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
				// Fixes dual-screen position                          Most browsers       Firefox
				var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
				var dualScreenTop  = window.screenTop  !== undefined ? window.screenTop  : screen.top;
				var winWidth  = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth : screen.width;
				var winHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
				var left = ((winWidth / 2)  - (width / 2))  + dualScreenLeft;
				var top  = ((winHeight / 2) - (height / 2)) + dualScreenTop;
				var options = "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top;
				if(minimal) {
					options += ", scrollbars=yes, menubar=no, statusbar=no, location=no";
				} else {
					options += ", scrollbars=yes, menubar=yes, statusbar=yes, location=yes";
				}
				var newWin = window.open(url, '', options);
				if(!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
					alert("Could not open new window, to view '" + name + "' allow an exception for this domain in your pop-up blocker's settings.");
					return null;
				} else {
					if(newWin) { newWin.focus(); }
					return newWin;
				}
			}
		}, 
		
		//****************************************************************************************************
		// Modal dialogs. On first loading common 3 elements (#cm-modal-outer, #cm-modal-container, and 
		// #cm-modal-content) are added to the document body. These are required for the below functions to 
		// work.
		//****************************************************************************************************
		/**
		 * Create (or destroy) a modal dialog with a default loading message (in this case: "Loading..").
		 * @param {boolean} visible - True creates, false removes.
		 * @param {Object} options
		 * @param {string} [content="Loading.."] - The loading message string.
		 * @param {string} [options.imgUrl="images/loader.gif"] - The link to a loading image. If 
		 *        null/undefined, looks for "images/loader.gif". If false, does not append any loading image.
		 * @param {boolean} [options.addDetails=true] - If true, adds paragraph with class `loading-details` 
		 *        for use of addition information.
		 * @param {string} [options.id="modal-loading-dialog"] - ID attached to modal content div.
		 * @param {boolean} [options.showBackground=true] - Whether to hve a semi-transparent div over the 
		 *        background (so as to visually signify the modal status). Keep in mind in older browsers that
		 *        don't support transparency it'll just grey out the entire background.
		 * @param {boolean} [options.notExitable=true] - Modal content closes when clicking outside of modal,
		 *        bt default.  Set true to override this (that is, modal can only be closed programmatically).
		 * @param {boolean} [options.hideCloser=true] - If set true, does not automatically apply a close modal
		 *        "X" to the top right of the content.
		 */
		setModalAsLoading: function(visible, content, options) {
			if(!visible) {
				this.setModal(false);
			} else {
				if(!content)                             { content = "Loading.."; }
				if(!options)                             { options = {}; }
				if(!options.id)                          { options.id = "cm-modal-loading-dialog"; }
				if(options.addDetails === undefined)     { options.addDetails = true; }
				if(options.showBackground === undefined) { options.showBackground = true; }
				if(options.notExitable === undefined)    { options.notExitable = true; }
				if(options.hideCloser === undefined)     { options.hideCloser = true; }
				if(!options.imgUrl && options.imgUrl !== false)  { options.imgUrl = "images/loader.gif"; }
				var loadingDialog = $("<div>", {'id': 'cm-modal-loading-dialog'}).html("&nbsp;" + content);
				if(options.imgUrl) {
					loadingDialog.prepend($("<img>", {'src': options.imgUrl, 'alt': 'loading'}));
				}
				if(options.addDetails) {
					$("<p>", {'class': 'cm-modal-loading-details'}).appendTo(loadingDialog).html("Loading..");
				}
				this.setModal(visible, loadingDialog, options);
			}
		}, 

		/**
		 * Create (or destroy) a modal dialog.
		 * @param {boolean} visible - True creates, false removes.
		 * @param {string} content - The HTML content of the modal dialog.
		 * @param {Object} options
		 * @param {string} options.id - Whether to attach an ID to the modal content div.
		 * @param {boolean} options.showBackground - Whether to hve a semi-transparent div over the background
		 *        (so as to visually signify the modal status). Keep in mind in older browsers that don't 
		 *        support transparency it'll just grey out the entire background.
		 * @param {boolean} options.notExitable - Modal content closes when clicking outside of modal, by 
		 *        default. Set true to override this (that is, modal can only be closed programmatically -- 
		 *        which by default is still allowed via the closer).
		 * @param {boolean} options.hideCloser - If set true, does not automatically apply a close modal "X" 
		 *        to the top right of the content.
		 */
		setModal: function(visible, content, options) {
			if(!options) { options = {}; }
			var modalContainer = $("#cm-modal-outer");
			if(!visible) {
				modalContainer.hide();
			} else {
				var modalContent = modalContainer.find(".cm-modal-inner")
					.attr("id", options.id ? options.id : "")
					.html(content);
				if(!options.hideCloser) {
					modalContent.prepend(
						$("<div>", {id: "cm-modal-closer"}).on("click", function() {
							modalContainer.hide();
						})
					);
				}
				if(!options.showBackground) {
					modalContainer.css('background-color', 'transparent');
				} else {
					modalContainer.css('background-color', '');
				}
				modalContainer.show();
				window.commonGlobals.modalOpened = true;
				window.commonGlobals.modalNotExitable = !!options.notExitable;
			}
		}
		
	};
	
// END IIFE Constructor
});
