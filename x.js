// ==UserScript==
// @name         推特极简模式
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  推特极简模式
// @author       https://github.com/enlian
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function hideScroll() {
    const elements = document.querySelectorAll(".r-1rnoaur");
    elements.forEach((el) => {
      el.style.overflowY = "hidden";
    });
  }

  const removeUnnecessaryElements = (root = document) => {
    const selectors = ['div[data-testid="sidebarColumn"]'];
    root.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
  };

  const styleMainContainers = (root = document) => {
    const selectors = [
      'div[data-testid="primaryColumn"]',
      "main > div:first-of-type",
    ];

    const elements = [
      ...root.querySelectorAll(selectors.join(",")),
      //   root.querySelector('section[aria-labelledby="accessible-list-1"]')
      //     ?.parentElement,
    ].filter(Boolean);

    elements.forEach((el) => {
      Object.assign(el.style, {
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0px",
        margin: "0 auto",
        overflowX: "hidden",
      });
    });
  };

  const applyAllCustomStyles = () => {
    removeUnnecessaryElements();
    styleMainContainers();
    hideScroll();
  };

  applyAllCustomStyles();

  const observer = new MutationObserver(() => {
    applyAllCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
