// ==UserScript==
// @name         kbin-code-highlighting
// @namespace    https://github.com/Oricul
// @version      0.3
// @description  Use HLJS to add code highlighting to kbin. Hopefully adds some legibility as well.
// @author       0rito
// @license      MIT
// @match        https://kbin.social/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @connect      github.com
// @connect      raw.githubusercontent.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL  https://github.com/Oricul/kbin-scripts/raw/main/kbin-code-highlighting.user.js
// @updateURL    https://github.com/Oricul/kbin-scripts/raw/main/kbin-code-highlighting.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Declare all functions
    function generateSettingsDiv(setting, settingFriendlyName, settingContent) {
        const div = document.createElement('div');
        div.className = 'row';
        div.innerHTML = `<span>${settingFriendlyName}:</span>
        <div>
            <input type="text" class="kbin-code-highlighting" value="${settingContent}"/>
        </div>
        `;
        return div;
    }
    function injectHtmlSettings(setting, settingFriendlyName, settingContent) {
        const settingsList = document.querySelector(".settings-list");
        const header = document.createElement('strong');
        header.textContent = "kbin-code-highlighting";
        settingsList.appendChild(header);
        settingsList.appendChild(generateSettingsDiv(setting, settingFriendlyName, settingContent));
        document.querySelectorAll(".kbin-code-highlighting").forEach(input => { input.addEventListener("change", () => {
            GM_setValue(setting, input.value);
            console.log(input.value);
            location.reload();
        })});
    }
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
    // Load settings
    const settingPrefix = 'kbin-code-highlighting-'
    let css = GM_getValue(settingPrefix + 'css', "https://github.com/highlightjs/highlight.js/raw/main/src/styles/base16/windows-10.css");
    // Perform web request to get defined CSS and add it to the page's stylesheet.
    GM_xmlhttpRequest({
        method: "GET",
        url: css,
        headers: {
            "Content-Type": "text/css"
        },
        onload: function(response) {
            const injectedCss = GM_addStyle(response.responseText);
            //injectedCss.remove(); // Removes the stylesheet - good for megamod?
        }
    });
    injectHtmlSettings(settingPrefix + 'css', 'Stylesheet URL', css);
    getCodeTags("code");
    hljs.configure({
        ignoreUnescapedHTML: true
    });
    hljs.highlightAll();
})();
