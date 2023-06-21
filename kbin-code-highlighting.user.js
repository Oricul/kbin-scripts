// ==UserScript==
// @name         kbin-code-highlighting
// @namespace    https://github.com/Oricul
// @version      0.1
// @description  Use HLJS to add code highlighting to kbin. Hopefully adds some legibility as well.
// @author       0rito
// @license      MIT
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @resource     css1   https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css
// @resource     css2   https://raw.githubusercontent.com/dracula/highlightjs/master/dracula.css
// @resource     css3   https://jmblog.github.io/color-themes-for-highlightjs/css/themes/hemisu-dark.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("css1"));
    GM_addStyle(GM_getResourceText("css2"));
    GM_addStyle(GM_getResourceText("css3"));
    function addTags(item) {
        const orig_html = item.innerHTML;
        let new_html = "<pre>" + orig_html + "</pre>";
        item.innerHTML = new_html;
    }
    function getCodeTags(selector) {
        const items = document.querySelectorAll(selector);
        items.forEach((item) => {
            addTags(item);
        });
    }
    getCodeTags("code");
    hljs.initHighlighting();
})();