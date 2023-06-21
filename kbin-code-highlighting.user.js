// ==UserScript==
// @name         kbin-code-highlighting
// @namespace    https://github.com/Oricul
// @version      0.2
// @description  Use HLJS to add code highlighting to kbin. Hopefully adds some legibility as well.
// @author       0rito
// @license      MIT
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @resource     css   https://github.com/highlightjs/highlight.js/raw/main/src/styles/base16/windows-10.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL  https://github.com/Oricul/kbin-scripts/raw/main/kbin-code-highlighting.user.js
// @updateURL    https://github.com/Oricul/kbin-scripts/raw/main/kbin-code-highlighting.user.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
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
