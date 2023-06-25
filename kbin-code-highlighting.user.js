// ==UserScript==
// @name         kbin-code-highlighting
// @namespace    https://github.com/Oricul
// @version      0.3.1
// @description  Use HLJS to add code highlighting to kbin. Hopefully adds some legibility as well.
// @author       0rito
// @license      MIT
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://karab.in/*
// @match        https://readit.buzz/*
// @match        https://forum.fail/*
// @match        https://fedi196.gay/*
// @match        https://feddit.online/*
// @match        https://kbin.run/*
// @match        https://nadajnik.org/*
// @match        https://kbin.cafe/*
// @match        https://kbin.lol/*
// @match        https://nerdbin.social/*
// @match        https://kbin.lgbt/*
// @match        https://kbin.place/*
// @match        https://kopnij.in/*
// @match        https://kbin.sh/*
// @match        https://kayb.ee/*
// @match        https://wiku.hu/*
// @match        https://kbin.chat/*
// @match        https://fediverse.boo/*
// @match        https://tuna.cat/*
// @match        https://kbin.dk/*
// @match        https://kbin.projectsegau.lt/*
// @match        https://bin.pol.social/*
// @match        https://kbin.fedi.cr/*
// @match        https://baguette.pub/*
// @match        https://kbin.tech/*
// @match        https://teacup.social/*
// @match        https://thebrainbin.org/*
// @match        https://fr3diver.se/*
// @match        https://kbin.rocks/*
// @match        https://remy.city/*
// @match        https://community.yshi.org/*
// @match        https://kbin.buzz/*
// @match        https://kilioa.org/*
// @match        https://kbin.melroy.org/*
// @match        https://gehimeimer.de/*
// @match        https://champserver.net/*
// @match        https://k.fe.derate.me/*
// @match        https://the.coolest.zone/*
// @match        https://streetbikes.club/*
// @match        https://kbin.korgen.xyz/*
// @match        https://kbin.donar.dev/*
// @match        https://nolani.academy/*
// @match        https://kbin.dentora.social/*
// @match        https://kbin.cocopoops.com/*
// @match        https://thekittysays.icu/*
// @match        https://dev-kbin.korako.me/*
// @match        https://
// @icon         https://kbin.social/favicon.svg
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
