// ==UserScript==
// @name         kbin-federation-awareness
// @namespace    https://github.com/Oricul
// @version      0.2.1
// @description  Adds border to articles and comments based on moderation or federation.
// @author       0ri
// @match        https://sacredori.net/*
// @match        https://kbin.social/*
// @icon         https://kbin.social/favicon.svg
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    /*
        Original by CodingAndCoffee (https://kbin.social/u/CodingAndCoffee)
        Source: https://greasyfork.org/en/scripts/468747-kbin-federation-awareness
        License: MIT
    */
    'use strict';
    window.addEventListener("load", function () {
        const prefix = 'kbin-federation-awareness: ';

        const hasStrictModerationRules = [
            'beehaw.org'
        ];

        function isStrictlyModerated(hostname) {
            return hasStrictModerationRules.indexOf(hostname) !== -1;
        }

        GM_addStyle('.data-moderated { box-shadow:1px 0 0 #ff0000, -1px 0 0 #ff0000, 2px 0 0 #ff0000, -2px 0 0 #ff0000, 3px 0 0 #c80000, -3px 0 0 #c80000, 4px 0 0 #960000, -4px 0 0 #960000, 5px 0 0 #640000, -5px 0 0 #640000; }');
        GM_addStyle('article.data-federated { box-shadow:1px 0 0 #009bff, -1px 0 0 #009bff, 2px 0 0 #009bff, -2px 0 0 #009bff, 3px 0 0 #0064fa, -3px 0 0 #0064fa, 4px 0 0 #0032c8, -4px 0 0 #0032c8, 5px 0 0 #000096, -5px 0 0 #000096; }');
        GM_addStyle('.comment.data-federated { box-shadow:1px 0 0 #009bff, 2px 0 0 #009bff, 3px 0 0 #0064fa, 4px 0 0 #0032c8, 5px 0 0 #000096; }');

        document.querySelectorAll('#content article.entry').forEach(function(article) {
            var hostname = new URL(article.querySelector('footer menu .dropdown li:nth-child(4) a').href).hostname;
            article.setAttribute('data-hostname', hostname);

            if (isStrictlyModerated(hostname)) {
                article.classList.toggle('data-moderated');
            } else if (hostname !== window.location.hostname) {
                article.classList.toggle('data-federated');
            }
        });

        document.querySelectorAll('.comments blockquote.entry-comment').forEach(function(comment) {
            var userInfo = comment.querySelector('header a:nth-child(1)');
            if (userInfo) {
                var userHostname = userInfo.title.split('@').reverse()[0];

                if (isStrictlyModerated(userHostname)) {
                    comment.classList.toggle('data-moderated');
                } else if (userHostname !== window.location.hostname) {
                    comment.classList.toggle('data-federated');
                }
            }
        });
    });
})();