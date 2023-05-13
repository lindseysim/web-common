export default {

    addGrabCursorFunctionality(element) {
        var elList = this.getElementList(element);
        elList.forEach(e => {
            e.classList.add("grab");
            e.addEventListener('mousedown', function() {
                this.classList.remove("grab");
                this.classList.add("grabbing");
            });
            e.addEventListener('mouseup', function() {
                this.classList.remove("grabbing");
                this.classList.add("grab");
            });
        });
    }, 
    
    createDropdown(element, menu) {
        var addDropdown = (outer, menuObj, first) => {
            let inner = document.createElement("div");
            inner.className = 'cm-dropdown-menu';
            outer.append(inner);
            // if(first) inner.classList.add("entry");
            for(var j = 0; j < menuObj.length; j++) {
                var m = menuObj[j], 
                    menuItem = document.createElement("div");
                m.id && menuItem.setAttribute("id", m.id);
                menuItem.className = 'cm-dropdown-menu-item';
                inner.append(menuItem);
                if(m.class) menuItem.classList.add(m.class);
                if(m.style) menuItem.css(m.style);
                if(m.href) {
                    let a = document.createElement("a");
                    a.setAttributes({
                        href: m.href, 
                        target: m.target ? m.target : ''
                    });
                    m.html && (a.innerHTML = m.html);
                    m.text && (a.innerText = m.text);
                    menuItem.append(a);
                } else {
                    m.html && (menuItem.innerHTML = m.html);
                    m.text && (menuItem.innerText = m.text);
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
        this.getElementList(element).forEach(el => {
            el.classList.add("cm-dropdown");
            addDropdown(el, menu, true);
        });
    }, 
    
    clearDropdown(element) {
        this.getElementList(element).forEach(el => {
            el.classList.remove("cm-dropdown");
            el.querySelectorAll("cm-dropdown-menu").forEach(menuItem => menuItem.remove());
        });
    }, 

    addTooltip(element, message, direction, force) {
        var dirs = ["right", "left", "top", "bottom"];
        if(Object.isObjectLiteral(message)) {
            if(typeof direction === "undefined") direction = message.direction;
            if(typeof force === "undefined") force = message.force;
            message = message.message;
        }
        this.getElementList(element).forEach(el => {
            if(!message) {
                el.classList.remove("cm-tooltip-left", "cm-tooltip-right", "cm-tooltip-top", "cm-tooltip-bottom", "cm-tooltip-force");
                el.removeAttribute("cm-tooltip-msg");
            } else {
                let useDir = direction && direction.toLowerCase().trim(), 
                    hasDir = useDir && ~dirs.indexOf(useDir);
                if(!hasDir) useDir = "top";
                dirs.forEach(dir => {
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

    removeTooltip(element) {
        this.getElementList(element).forEach(el => {
            el.classList.remove("cm-tooltip-left", "cm-tooltip-right", "cm-tooltip-top", "cm-tooltip-bottom", "cm-tooltip-force");
            el.removeAttribute("cm-tooltip-msg");
        });
    }, 

    appendHelpIcon(element, message, direction, style, force) {
        if(Object.isObjectLiteral(message)) {
            if(typeof direction === "undefined") direction = message.direction;
            if(typeof style === "undefined") style = message.style;
            if(typeof force === "undefined") force = message.force;
            message = message.message;
        }
        this.getElementList(element).forEach(el => {
            let icon = document.createElement("i");
            icon.classList.add("cm-icon");
            icon.innerHTML = "?";
            if(style) icon.css(style);
            el.append(icon);
            this.addTooltip(icon, message, direction, force);
        });
    }, 

    removeHelpIcon(element) {
        this.getElementList(element).forEach(el => {
            let icons = el.querySelectorAll("i.cm-icon");
            if(icons && icons.length) icons.forEach(i => i.remove());
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

    _initModalFunctionality() {
        // Add modal content (if not already existing)
        if(this._modalsInit && document.querySelector("#cm-modal-outer")) return;
        let inner     = document.createElement("div"), 
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
        outer.addEventListener('click', evt => {
            if(this._modalNotExitable) return;
            if(!evt.target.closest('#cm-modal-container div')) this.closeModal();
        });
        this._modalsInit = true;
    }, 

    isModalOpen() {
        if(!this._modalsInit) return false;
        this._modalOpened = document.querySelector("#cm-modal-outer").offsetParent !== null;
        return this._modalOpened;
    }, 

    openModal(content, options) {
        return this.setModal(true, content, options);
    }, 
    
    setModal(visible, content, options) {
        if(!this._modalsInit) this._initModalFunctionality();
        options = options || {};
        let modalContainer = document.querySelector("#cm-modal-outer");
        if(!visible) {
            this.closeModal();
        } else {
            let modalContent = modalContainer.querySelector(".cm-modal-inner");
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
                let closer = document.createElement("div");
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
    
    setModalAsLoading(content, options) {
        if(!content)                             content = "Loading..";
        if(!options)                             options = {};
        if(!options.id)                          options.id = "cm-modal-loading-dialog";
        if(options.addDetails === undefined)     options.addDetails = false;
        if(!options.addDetailsText)              options.addDetailsText = "Please wait..";
        if(options.showBackground === undefined) options.showBackground = true;
        if(options.notExitable === undefined)    options.notExitable = true;
        if(options.hideCloser === undefined)     options.hideCloser = true;
        let loadingDialog = document.createElement("div");
        loadingDialog.innerHTML = "&nbsp;" + content;
        if(options.addDetails) {
            let p = document.createElement("p");
            p.className = 'cm-modal-loading-details';
            p.innerHTML = options.addDetailsText;
            loadingDialog.append(p);
        }
        return this.openModal(loadingDialog, options);
    }, 
    
    changeModal(content, prepContentCallback, hideCloser) {
        if(!this._modalsInit) this._initModalFunctionality();
        if(!this.isModalOpen()) {
            this.setModal(true, content);
            if(prepContentCallback) prepContentCallback();
            return;
        }
        let modalContent = document.querySelector("#cm-modal-outer").querySelector(".cm-modal-inner"), 
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
            let closer = document.createElement("div");
            closer.setAttribute("id", "cm-modal-closer");
            closer.addEventListener("click", this.closeModal.bind(this, false));
            modalContent.append(closer);
        }
        // fast store new dims before reverting
        modalContent.css({
            'height': '', 
            'width': ''
        });
        let newWidth  = modalContent.offsetWidth+"px", 
            newHeight = modalContent.offsetHeight+"px";
        modalContent.css({
            'width': oldWidth, 
            'height': oldHeight, 
            'overflow': 'hidden'
        });
        // animate then reset to auto
        let durationSecs = 0.2, 
            delayMs = 10, 
            transitionValue = "width " + durationSecs + "s ease, height " + durationSecs + "s ease";
        modalContent.css({
            '-webkit-transition': transitionValue, 
            '-moz-transition': transitionValue, 
            'transition': transitionValue
        });
        window.setTimeout(
            () => {
                modalContent.css({height: newHeight, width: newWidth });
                window.setTimeout(
                    () => {
                        modalContent.css({
                            'height': '', 
                            'width': '', 
                            '-webkit-transition': transitionValue, 
                            '-moz-transition': transitionValue, 
                            'transition': transitionValue, 
                            'overflow': ''
                        });
                    }, 
                    1000*durationSecs+delayMs
                );
            }, 
            delayMs
        );
        return modalContent;
    }, 
    
    hideModal(suppressOnClose) {
        this.closeModal(suppressOnClose);
    }, 
    
    closeModal(suppressOnClose) {
        let outer = document.querySelector("#cm-modal-outer");
        outer.style['visibility'] = "hidden";
        outer.querySelector(".cm-modal-inner").innerHTML = "";
        if(this._modalOnClose) {
            if(!suppressOnClose) this._modalOnClose();
            this._modalOnClose = null;
            this._modalOpened = false;
        }
    }

};