export default {

    addGrabCursorFunctionality: function(element) {
        var elList = this.getElementList(element);
        for(var i = 0; i < elList.length; ++i) {
            e = elList[i];
            e.classList.add("grab");
            e.addEventListener('mousedown', function() {
                this.classList.remove("grab");
                this.classList.add("grabbing");
            });
            e.addEventListener('mouseup', function() {
                this.classList.remove("grabbing");
                this.classList.add("grab");
            });
        }
    }, 
    
    createDropdown: function(element, menu) {
        var addDropdown = function(outer, menuObj) {
            var inner = document.createElement("div");
            inner.className = 'cm-dropdown-menu';
            outer.append(inner);
            for(var j = 0; j < menuObj.length; j++) {
                var m = menuObj[j], 
                    menuItem = document.createElement("div");
                menuItem.setAttribute("id", m.id ? m.id : '');
                menuItem.className = 'cm-dropdown-menu-item';
                inner.append(menuItem);
                if(m.class) menuItem.classList.add(m.class);
                if(m.style) menuItem.css(m.style);
                if(m.href) {
                    var a  = document.createElement("a");
                    a.setAttributes({
                        href: m.href, 
                        target: m.target ? m.target : '',
                        text: m.text
                    });
                    menuItem.append(a);
                } else {
                    menuItem.innerHTML = m.text;
                }
                if(m.onClick) {
                    menuItem.addEventListener('click', m.onClick);
                }
                if(m.menu) {
                    menuItem.classList.add("cm-dropdown");
                    addDropdown(menuItem, m.menu);
                }
            }
        };
        var self = this;
        this.getElementList(element).forEach(function(el) {
            el.classList.add("cm-dropdown");
            self.addDropdown(el, menu);
        });
    }, 
    
    clearDropdown: function(element) {
        this.getElementList(element).forEach(function(el) {
            el.classList.remove("cm-dropdown");
            el.querySelectorAll("cm-dropdown-menu").forEach(function(menuItem) {
                menuItem.remove();
            });
        });
    }, 

    addTooltip: function(element, message, direction, force) {
        this.getElementList(element).forEach(function(el) {
            if(!message) {
                el.classList.remove("cm-tooltip-left", "cm-tooltip-right", "cm-tooltip-top", "cm-tooltip-bottom", "cm-tooltip-force");
                el.removeAttribute("cm-tooltip-msg");
            } else {
                var useDir = direction && direction.toLowerCase().trim(), 
                    hasDir = useDir && ~dirs.indexOf(useDir);
                if(!hasDir) useDir = "top";
                ["right", "left", "top", "bottom"].forEach(function(dir) {
                    if(useDir === dir) {
                        el.classList.add("cm-tooltip-"+dir);
                    } else {
                        el.classList.remove("cm-tooltip-"+dir);
                    }
                });
                if(force) el.classList.add("cm-tooltip-force");
                el.setAttribute("cm-tooltip-msg", message);
            }
        });
    }, 

    removeTooltip: function(element) {
        this.getElementList(element).forEach(function(el) {
            el.classList.remove("cm-tooltip-left", "cm-tooltip-right", "cm-tooltip-top", "cm-tooltip-bottom", "cm-tooltip-force");
            el.removeAttribute("cm-tooltip-msg");
        });
    }, 

    appendHelpIcon: function(element, message, direction, style, force) {
        var self = this;
        this.getElementList(element).forEach(function(el) {
            var icon = document.createElement("i");
            icon.classList.add("cm-icon");
            icon.innerHTML = "?";
            if(style) icon.css(style);
            el.append(icon);
            self.addTooltip(icon, message, direction, force);
        });
    }, 

    removeHelpIcon: function(element) {
        this.getElementList(element).forEach(function(el) {
            var icons = el.querySelectorAll("i.cm-icon");
            if(icons && icons.length) {
                icons.forEach(function(i) { i.remove(); });
            }
        });
    }, 

    //************************************************************************************************
    // Common Modal
    // On first use, three elements (#cm-modal-outer, #cm-modal-container, and #cm-modal-content) are 
    // added to the document body.
    //************************************************************************************************
    _modalsInit: false, 
    _modalOnClose: null, 
    _modalOpened: true, 
    _modalNotExitable: false, 

    _initModalFunctionality: function() {
        // Add modal content (if not already existing)
        if(this._modalsInit && document.querySelector("#cm-modal-outer")) return;
        var inner     = document.createElement("div"), 
            outer     = document.createElement("div"), 
            container = document.createElement("div");
        inner.className = "cm-modal-inner";
        outer.setAttribute("id", "cm-modal-outer");
        container.setAttribute("id", "cm-modal-container");
        document.body.append(container);
        container.append(outer);
        outer.append(inner);
        outer.style['visibility'] = "hidden";
        // Add modal close functionality by clicking anywhere not in the modal
        var self = this;
        outer.addEventListener('click', function(evt) {
            if(self._modalNotExitable) return;
            if(!evt.target.closest('#cm-modal-container div')) self.closeModal();
        });
        this._modalsInit = true;
    }, 

    isModalOpen: function() {
        if(!this._modalsInit) return false;
        this._modalOpened = document.querySelector("#cm-modal-outer").offsetParent !== null;
        return this._modalOpened;
    }, 

    openModal: function(content, options) {
        return this.setModal(true, content, options);
    }, 
    
    setModal: function(visible, content, options) {
        if(!this._modalsInit) this._initModalFunctionality();
        if(!options) { options = {}; }
        var modalContainer = document.querySelector("#cm-modal-outer");
        if(!visible) {
            this.closeModal();
        } else {
            var modalContent = modalContainer.querySelector(".cm-modal-inner");
            modalContent.setAttribute("id", options.id ? options.id : "");
            if(
                (typeof jQuery !== "undefined" && content instanceof jQuery)
                || (typeof $ !== "undefined" && content instanceof $)
            ) {
                modalContent.innerHTML = "";
                modalContent.append(content[0]);
            } else if(content instanceof Element) {
                modalContent.innerHTML = "";
                modalContent.append(content);
            } else if(typeof content === "string") {
                modalContent.innerHTML = content;
            }
            if(!options.hideCloser) {
                var closer = document.createElement("div");
                closer.setAttribute("id", "cm-modal-closer");
                closer.addEventListener("click", this.closeModal.bind(this, false));
                modalContent.append(closer);
            }
            if(!options.showBackground) {
                modalContainer.css('background-color', 'transparent');
            } else {
                modalContainer.css('background-color', '');
            }
            if(options.onClose) {
                this._modalOnClose = options.onClose;
            } else {
                this._modalOnClose = null;
            }
            modalContainer.style["visibility"] = "";
            this._modalOpened = true;
            this._modalNotExitable = !!options.notExitable;
            return modalContent;
        }
    }, 
    
    setModalAsLoading: function(content, options) {
        if(!content)                             content = "Loading..";
        if(!options)                             options = {};
        if(!options.id)                          options.id = "cm-modal-loading-dialog";
        if(options.addDetails === undefined)     options.addDetails = false;
        if(!options.addDetailsText)              options.addDetailsText = "Please wait..";
        if(options.showBackground === undefined) options.showBackground = true;
        if(options.notExitable === undefined)    options.notExitable = true;
        if(options.hideCloser === undefined)     options.hideCloser = true;
        var loadingDialog = document.createElement("div");
        loadingDialog.innerHTML = "&nbsp;" + content;
        if(options.addDetails) {
            var p = document.createElement("p");
            p.className = 'cm-modal-loading-details';
            p.innerHTML = options.addDetailsText;
            loadingDialog.append(p);
        }
        return this.openModal(visible, loadingDialog, options);
    }, 
    
    changeModal: function(content, prepContentCallback, hideCloser) {
        if(!this._modalsInit) this._initModalFunctionality();
        if(!this.isModalOpen()) {
            this.setModal(true, content);
            if(prepContentCallback) prepContentCallback();
            return;
        }
        var modalContent = document.querySelector("#cm-modal-outer").querySelector(".cm-modal-inner"), 
            oldWidth  = modalContent.offsetWidth+"px", 
            oldHeight = modalContent.offsetHeight+"px";
        // fix dimensions
        modalContent.css({
            'width': oldWidth, 
            'height': oldHeight
        });
        // new content
        modalContent.innerHTML = content;
        if(prepContentCallback) prepContentCallback();
        // add closer
        if(!hideCloser) {
            var closer = document.createElement("div");
            closer.setAttribute("id", "cm-modal-closer");
            closer.addEventListener("click", this.closeModal.bind(this, false));
            modalContent.append(closer);
        }
        // fast store new dims before reverting
        modalContent.css({
            'height': '', 
            'width': ''
        });
        var newWidth  = modalContent.offsetWidth+"px", 
            newHeight = modalContent.offsetHeight+"px";
        modalContent.css({
            'width': oldWidth, 
            'height': oldHeight, 
            'overflow': 'hidden'
        });
        // animate then reset to auto
        var durationSecs = 0.2, 
            delayMs = 10, 
            transitionValue = "width " + durationSecs + "s ease, height " + durationSecs + "s ease";
        modalContent.css({
            '-webkit-transition': transitionValue, 
            '-moz-transition': transitionValue, 
            'transition': transitionValue
        });
        window.setTimeout(function() {
                modalContent.css({
                    height: newHeight, 
                    width: newWidth
                });
                window.setTimeout(function() {
                        modalContent.css({
                            'height': '', 
                            'width': '', 
                            '-webkit-transition': transitionValue, 
                            '-moz-transition': transitionValue, 
                            'transition': transitionValue, 
                            'overflow': ''
                        });
                    }, 1000*durationSecs+delayMs);
            }, delayMs);
        return modalContent;
    }, 
    
    hideModal: function(suppressOnClose) {
        this.closeModal(suppressOnClose);
    }, 
    
    closeModal: function(suppressOnClose) {
        var outer = document.querySelector("#cm-modal-outer");
        outer.style['visibility'] = "hidden";
        outer.querySelector(".cm-modal-inner").innerHTML = "";
        if(this._modalOnClose) {
            if(!suppressOnClose) this._modalOnClose();
            this._modalOnClose = null;
            this._modalOpened = false;
        }
    }

};