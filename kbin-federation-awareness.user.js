// ==UserScript==
// @name         kbin-federation-awareness
// @namespace    https://github.com/Oricul
// @version      0.2.4
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
// @downloadURL  https://github.com/Oricul/kbin-scripts/raw/main/kbin-federation-awareness.user.js
// @updateURL    https://github.com/Oricul/kbin-scripts/raw/main/kbin-federation-awareness.user.js
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
        'beehaw.org',
        'lemmy.ml'
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
        if (settingStyle === 'border') {
            let commentFed = ` .comment.data-federated {  box-shadow: `;
            let articleFed = ` article.data-federated {  box-shadow: `;
            let commentMod = ` .comment.data-moderated {  box-shadow: `;
            let articleMod = ` article.data-moderated {  box-shadow: `;
            let commentHome = ` .comment.data-home {  box-shadow: `;
            let articleHome = ` article.data-home {  box-shadow: `;
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
        } else if (settingStyle === 'bubble') {
            let fedStyle = ` .comment .data-federated, article .data-federated { display: inline-block; width: 10px; height: 10px; border-radius: 10px; box-shadow: `;
            let modStyle = ` .comment .data-moderated, article .data-moderated { display: inline-block; width: 10px; height: 10px; border-radius: 10px; box-shadow: `;
            let homeStyle = ` .comment .data-home, article .data-home { display: inline-block; width: 10px; height: 10px; border-radius: 10px; box-shadow: `;
            modStyle += `0 0 3px 2px ` + modColor0 + `; background-color: ` + modColor0 + `; margin-right: 4px; }`;
            fedStyle += `0 0 3px 2px ` + fedColor0 + `; background-color: ` + fedColor0 + `; margin-right: 4px; }`;
            homeStyle += `0 0 3px 2px ` + homeColor0 + `; background-color: ` + homeColor0 + `; margin-right: 4px; }`;
            return modStyle + fedStyle + homeStyle;
        }
    }

    // These 2 functions (startup, shutdown) support init and deinit.
    function startup() {
        initClasses();
        injectedCss = GM_addStyle(getCss());
        // Support for infinite scrolling.
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = document.getElementById('content').children[0];
        const config = { childList: true, subtree: true };

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    initClasses();
                }
            }
        }
        observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    function shutdown() {
        injectedCss.remove();
        observer.disconnect();
    }

    function restart() {
        shutdown();
        startup();
    }

    function initClasses() {
        const classList = ['data-moderated', 'data-federated', 'data-home'];
        // Find all articles, determine their status, toggle appropriate class.
        document.querySelectorAll('#content article.entry').forEach(function(article) {
            if (!(article.classList.value.split(' ').some(r=> classList.indexOf(r) >= 0))) {
                var hostname = new URL(article.querySelector('footer menu .dropdown li:nth-child(4) a').href).hostname;
                let articleAside = article.querySelector('aside');
                article.setAttribute('data-hostname', hostname);
                let articleIndicator = document.createElement('div');

                if (isStrictlyModerated(hostname)) {
                    article.classList.toggle('data-moderated');
                    articleIndicator.classList.toggle('data-moderated');
                } else if (hostname !== window.location.hostname) {
                    article.classList.toggle('data-federated');
                    articleIndicator.classList.toggle('data-federated');
                } else {
                    article.classList.toggle('data-home');
                    articleIndicator.classList.toggle('data-home');
                }
                articleAside.prepend(articleIndicator);
            }
        });

        // Find all comments, determine their status, toggle appropriate class.
        document.querySelectorAll('.comments blockquote.entry-comment').forEach(function(comment) {
            if (!(comment.classList.value.split(' ').some(r=> classList.indexOf(r) >= 0))) {
                let commentHeader = comment.querySelector('header');
                const userInfo = commentHeader.querySelector('a.user-inline');
                if (userInfo) {
                    const userHostname = userInfo.title.split('@').reverse()[0];
                    let commentIndicator = document.createElement('div');

                    if (isStrictlyModerated(userHostname)) {
                        comment.classList.toggle('data-moderated');
                        commentIndicator.classList.toggle('data-moderated');
                    } else if (userHostname !== window.location.hostname) {
                        comment.classList.toggle('data-federated');
                        commentIndicator.classList.toggle('data-federated');
                    } else {
                        comment.classList.toggle('data-home');
                        commentIndicator.classList.toggle('data-home');
                    }
                    commentHeader.prepend(commentIndicator);
                }
            }
        });
    }

    // Creates the setting panel.
    function createSettings() {
        let license = (GM_info).script;
        if (license.license) {
            license = license.license;
        } else {
            license = (GM_info).script.header.split('\n').find(header => header.includes('license'));
            license = license.replace('//', '').replace('@license', '').trim();
        }
        const settingHeader = kmoAddHeader('kbin-federation-awareness', { author: (GM_info).script.author, version: (GM_info).script.version, license: license, url: 'https://github.com/Oricul/kbin-scripts/' });
        settingsEnabledToggle = kmoAddToggle(settingHeader, 'Enabled', settingsEnabled, 'Toggle kbin-federation-awareness on or off.');
        settingsEnabledToggle.addEventListener("click", () => {
            const enabledState = kmoGetToggle(settingsEnabledToggle);
            settingsEnabled = enabledState;
            GM_setValue(settingPrefix + 'enabled', enabledState);
            if (enabledState === true) {
                startup();
                settingsDisplayDropdown.parentNode.style.display = '';
                if (settingStyle === 'border') {
                    settingsArticleSideDropdown.parentNode.style.display = '';
                }
                settingsPickerHome.parentNode.style.display = '';
                settingsPickerFed.parentNode.style.display = '';
                settingsPickerMod.parentNode.style.display = '';
            } else {
                shutdown();
                settingsDisplayDropdown.parentNode.style.display = 'none';
                settingsArticleSideDropdown.parentNode.style.display = 'none';
                settingsPickerHome.parentNode.style.display = 'none';
                settingsPickerFed.parentNode.style.display = 'none';
                settingsPickerMod.parentNode.style.display = 'none';
            }
        });
        const displayStyle = [
            { name: 'Bubble', value: 'bubble' },
            { name: 'Border', value: 'border' }
        ];
        settingsDisplayDropdown = kmoAddDropDown(settingHeader, 'Display Style', displayStyle, settingStyle, 'How federation is to be displayed');
        settingsDisplayDropdown.addEventListener("change", () => {
            const newStyle = kmoGetDropDown(settingsDisplayDropdown);
            settingStyle = newStyle;
            GM_setValue(settingPrefix + 'style', newStyle);
            if (settingStyle === 'border') {
                settingsArticleSideDropdown.parentNode.style.display = '';
            } else {
                settingsArticleSideDropdown.parentNode.style.display = 'none';
            }
            if (settingsEnabled) {
                restart();
            }
        });
        const articleStyleOptions = [
            { name: 'Left', value: 'left' },
            { name: 'Right', value: 'right' },
            { name: 'Both', value: 'both' }
        ];
        settingsArticleSideDropdown = kmoAddDropDown(settingHeader, 'Article Side', articleStyleOptions, settingArticleSide, 'Changes which side of articles are highlighted.');
        if (settingStyle !== 'border') {
            settingsArticleSideDropdown.parentNode.style.display = 'none';
        }
        settingsArticleSideDropdown.addEventListener("change", () => {
            const newStyle = kmoGetDropDown(settingsArticleSideDropdown);
            settingArticleSide = newStyle;
            GM_setValue(settingPrefix + 'articleSide', newStyle);
            if (settingsEnabled) {
                restart();
            }
        });
        settingsPickerHome = kmoAddColorDropper(settingHeader, 'Home Color', settingsHome, 'Color for home content');
        settingsPickerHome.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'home', settingsPickerHome.value);
            settingsHome = settingsPickerHome.value;
            if (settingsEnabled) {
                restart();
            }
        });
        settingsPickerFed = kmoAddColorDropper(settingHeader, 'Federated Color', settingsFed, 'Color for federated content.');
        settingsPickerFed.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'fed', settingsPickerFed.value);
            settingsFed = settingsPickerFed.value;
            if (settingsEnabled) {
                restart();
            }
        });
        settingsPickerMod = kmoAddColorDropper(settingHeader, 'Moderated Color', settingsMod, 'Color for moderated content.');
        settingsPickerMod.addEventListener("change", () => {
            GM_setValue(settingPrefix + 'mod', settingsPickerMod.value);
            settingsMod = settingsPickerMod.value;
            if (settingsEnabled) {
                restart();
            }
        });
        return settingHeader;
    }

    // Global and persistent variables.
    let settingPrefix = 'kbin-fed-aware-';
    let settingsEnabled = GM_getValue(settingPrefix + 'enabled', true);
    let settingsFed = GM_getValue(settingPrefix + 'fed', '#009bff');
    let settingsMod = GM_getValue(settingPrefix + 'mod', '#ff0000');
    let settingsHome = GM_getValue(settingPrefix + 'home', '#00FF64');
    let settingArticleSide = GM_getValue(settingPrefix + 'articleSide', 'right');
    let settingStyle = GM_getValue(settingPrefix + 'style', 'bubble');
    let settingsEnabledToggle;
    let settingsArticleSideDropdown;
    let settingsDisplayDropdown;
    let settingsPickerFed;
    let settingsPickerMod;
    let settingsPickerHome;
    let injectedCss;
    let observer;
    let settingsPanel;

    // Wait for the page to finish loading before doing the real work.
    window.addEventListener("load", function () {
        // If enabled, display effect.
        if (settingsEnabled) {
            startup();
        }

        // Inject settings panel.
        settingsPanel = createSettings();
    });
})();