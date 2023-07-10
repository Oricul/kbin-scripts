// ==UserScript==
// @name         kbin-federation-awareness
// @namespace    https://github.com/Oricul
// @version      0.2.1
// @description  Adds border to articles and comments based on moderation or federation.
// @author       0ri
// @match        https://sacredori.net/*
// @match        https://kbin.social/*
// @icon         https://kbin.social/favicon.svg
// @require      https://github.com/Oricul/kbin-scripts/raw/main/kbin-mod-options.js
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==

(function() {
    /*
        Original by CodingAndCoffee (https://kbin.social/u/CodingAndCoffee)
        Source: https://greasyfork.org/en/scripts/468747-kbin-federation-awareness
        License: MIT
    */
    'use strict';

    // List of strictly moderated instance domains.
    // TODO: Migrate this to an external list so you don't update script every time something lands on here.
    const hasStrictModerationRules = [
        'beehaw.org'
    ];

    // Returns true if in moderation list.
    function isStrictlyModerated(hostname) {
        return hasStrictModerationRules.indexOf(hostname) !== -1;
    }

    // These 3 functions (componentToHex, rgbToHex, hexToRgb) support border color selection by converting values.
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Returns a hex code that subtracts a supplied amount. Gives a slight gradient for visual appeal.
    // ex. RGB(255,100,20) -50 -> RGB(205,50,0)
    function subtractColor(hex, amount) {
        let rgb = hexToRgb(hex);
        if (rgb.r > amount) {
            rgb.r -= amount;
        } else {
            rgb.r = 0;
        }
        if (rgb.g > amount) {
            rgb.g -= amount;
        } else {
            rgb.g = 0;
        }
        if (rgb.b > amount) {
            rgb.b -= amount;
        } else {
            rgb.b = 0;
        }
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    // Generates CSS to inject.
    // NOTE: Does not apply 'side' to comments as the left side of comments already has border effects.
    function getCss() {
        let commentFed = ` .comment.data-federated {  box-shadow: `;
        let articleFed = ` article.data-federated {  box-shadow: `;
        let commentMod = ` .comment.data-moderated {  box-shadow: `;
        let articleMod = ` article.data-moderated {  box-shadow: `;
        let commentHome = ` .comment.data-home {  box-shadow: `;
        let articleHome = ` article.data-home {  box-shadow: `;
        let fedColor0 = settingsFed;
        let fedColor1 = subtractColor(fedColor0, 50);
        let fedColor2 = subtractColor(fedColor1, 50);
        let fedColor3 = subtractColor(fedColor2, 50);
        let modColor0 = settingsMod;
        let modColor1 = subtractColor(modColor0, 50);
        let modColor2 = subtractColor(modColor1, 50);;
        let modColor3 = subtractColor(modColor2, 50);;
        let homeColor0 = settingsHome;
        let homeColor1 = subtractColor(homeColor0, 50);
        let homeColor2 = subtractColor(homeColor1, 50);
        let homeColor3 = subtractColor(homeColor2, 50);
        commentMod += `1px 0 0 ` + modColor0 + `, 2px 0 0 ` + modColor0 + `, 3px 0 0 ` + modColor1 + `, 4px 0 0 ` + modColor2 + `, 5px 0 0 ` + modColor3 + `; }`;
        commentFed += `1px 0 0 ` + fedColor0 + `, 2px 0 0 ` + fedColor0 + `, 3px 0 0 ` + fedColor1 + `, 4px 0 0 ` + fedColor2 + `, 5px 0 0 ` + fedColor3 + `; }`;
        commentHome += `1px 0 0 ` + homeColor0 + `, 2px 0 0 ` + homeColor0 + `, 3px 0 0 ` + homeColor1 + `, 4px 0 0 ` + homeColor2 + `, 5px 0 0 ` + homeColor3 + `; }`;
        if (settingArticleSide === 'left' || settingArticleSide === 'both') {
            articleMod += `-1px 0 0 ` + modColor0 + `, -2px 0 0 ` + modColor0 + `, -3px 0 0 ` + modColor1 + `, -4px 0 0 ` + modColor2 + `, -5px 0 0 ` + modColor3;
            articleFed += `-1px 0 0 ` + fedColor0 + `, -2px 0 0 ` + fedColor0 + `, -3px 0 0 ` + fedColor1 + `, -4px 0 0 ` + fedColor2 + `, -5px 0 0 ` + fedColor3;
            articleHome += `-1px 0 0 ` + homeColor0 + `, -2px 0 0 ` + homeColor0 + `, -3px 0 0 ` + homeColor1 + `, -4px 0 0 ` + homeColor2 + `, -5px 0 0 ` + homeColor3;
        }
        if (settingArticleSide === 'right' || settingArticleSide === 'both') {
            if (settingArticleSide === 'both') {
                articleMod += `, `;
                articleFed += `, `;
                articleHome += `, `;
            }
            articleMod += `1px 0 0 ` + modColor0 + `, 2px 0 0 ` + modColor0 + `, 3px 0 0 ` + modColor1 + `, 4px 0 0 ` + modColor2 + `, 5px 0 0 ` + modColor3;
            articleFed += `1px 0 0 ` + fedColor0 + `, 2px 0 0 ` + fedColor0 + `, 3px 0 0 ` + fedColor1 + `, 4px 0 0 ` + fedColor2 + `, 5px 0 0 ` + fedColor3;
            articleHome += `1px 0 0 ` + homeColor0 + `, 2px 0 0 ` + homeColor0 + `, 3px 0 0 ` + homeColor1 + `, 4px 0 0 ` + homeColor2 + `, 5px 0 0 ` + homeColor3;
        }
        articleMod += `; }`;
        articleFed += `; }`;
        articleHome += `; }`;
        return commentFed + articleFed + commentMod + articleMod + commentHome + articleHome;
    }

    // These 2 functions (startup, shutdown) support init and deinit.
    function startup() {
        injectedCss = GM_addStyle(getCss());
    }

    function shutdown() {
        injectedCss.remove();
    }

    // Creates the setting panel.
    function createSettings() {
        let license = (GM_info).script.header.split('\n').find(header => header.includes('license'));
        license = license.replace('//', '').replace('@license', '').trim();
        const settingHeader = kmoAddHeader('kbin-federation-awareness', { author: (GM_info).script.author, version: (GM_info).script.version, license: license, url: 'https://github.com/Oricul/kbin-scripts/' });
        settingsEnabledToggle = kmoAddToggle(settingHeader, 'Enabled', settingsEnabled, 'Toggle kbin-federation-awareness on or off.');
        settingsEnabledToggle.addEventListener("click", () => {
            const enabledState = kmoGetToggle(settingsEnabledToggle);
            settingsEnabled = enabledState;
            GM_setValue(settingPrefix + 'enabled', enabledState);
            if (enabledState === true) {
                startup();
            } else {
                shutdown();
            }
        });
        const styleOptions = [
            { name: 'Left', value: 'left' },
            { name: 'Right', value: 'right' },
            { name: 'Both', value: 'both' }
        ];
        settingsArticleSideDropdown = kmoAddDropDown(settingHeader, 'Article Side', styleOptions, settingArticleSide, 'Changes which side of articles are highlighted.');
        settingsArticleSideDropdown.addEventListener("change", () => {
            const newStyle = kmoGetDropDown(settingsArticleSideDropdown);
            settingArticleSide = newStyle;
            GM_setValue(settingPrefix + 'articleSide', newStyle);
            if (settingsEnabled) {
                injectedCss.remove();
                startup();
            }
        });
        settingsPickerHome = kmoAddColorDropper(settingHeader, 'Home Color', settingsHome, 'Color for home content');
        settingsPickerHome.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'home', settingsPickerHome.value);
            settingsHome = settingsPickerHome.value;
            if (settingsEnabled) {
                injectedCss.remove();
                startup();
            }
        });
        settingsPickerFed = kmoAddColorDropper(settingHeader, 'Federated Color', settingsFed, 'Color for federated content.');
        settingsPickerFed.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'fed', settingsPickerFed.value);
            settingsFed = settingsPickerFed.value;
            if (settingsEnabled) {
                injectedCss.remove();
                startup();
            }
        });
        settingsPickerMod = kmoAddColorDropper(settingHeader, 'Moderated Color', settingsMod, 'Color for moderated content.');
        settingsPickerMod.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'mod', settingsPickerMod.value);
            settingsMod = settingsPickerMod.value;
            if (settingsEnabled) {
                injectedCss.remove();
                startup();
            }
        });
    }

    // Global and persistent variables.
    let settingPrefix = 'kbin-fed-aware-';
    let settingsEnabled = GM_getValue(settingPrefix + 'enabled', true);
    let settingsFed = GM_getValue(settingPrefix + 'fed', '#009bff');
    let settingsMod = GM_getValue(settingPrefix + 'mod', '#ff0000');
    let settingsHome = GM_getValue(settingPrefix + 'home', '#00FF64');
    let settingArticleSide = GM_getValue(settingPrefix + 'articleSide', 'right');
    let settingsEnabledToggle;
    let settingsArticleSideDropdown;
    let settingsPickerFed;
    let settingsPickerMod;
    let settingsPickerHome;
    let injectedCss;

    // Wait for the page to finish loading before doing the real work.
    window.addEventListener("load", function () {
        // If enabled, display effect.
        if (settingsEnabled) {
            startup();
        }

        // Find all articles, determine their status, toggle appropriate class.
        document.querySelectorAll('#content article.entry').forEach(function(article) {
            var hostname = new URL(article.querySelector('footer menu .dropdown li:nth-child(4) a').href).hostname;
            article.setAttribute('data-hostname', hostname);

            if (isStrictlyModerated(hostname)) {
                article.classList.toggle('data-moderated');
            } else if (hostname !== window.location.hostname) {
                article.classList.toggle('data-federated');
            } else {
                article.classList.toggle('data-home');
            }
        });

        // Find all comments, determine their status, toggle appropriate class.
        document.querySelectorAll('.comments blockquote.entry-comment').forEach(function(comment) {
            var userInfo = comment.querySelector('header a:nth-child(1)');
            if (userInfo) {
                var userHostname = userInfo.title.split('@').reverse()[0];

                if (isStrictlyModerated(userHostname)) {
                    comment.classList.toggle('data-moderated');
                } else if (userHostname !== window.location.hostname) {
                    comment.classList.toggle('data-federated');
                } else {
                    comment.classList.toggle('data-home');
                }
            }
        });

        // Inject settings panel.
        createSettings();
    });
})();