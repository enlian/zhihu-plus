// ==UserScript==
// @name         知乎Plus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动隐藏网页中所有图片、SVG、canvas
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.innerHTML = `
      img, picture, figure, canvas, svg, use {
        display: none !important;
        visibility: hidden !important;
      }
      * {
        background-image: none !important;
        mask-image: none !important;
        -webkit-mask-image: none !important;
      }
    `;
  document.head.appendChild(style);

  const hideNewImages = (node) => {
    if (node.nodeType !== 1) return;

    const elements =
      node.querySelectorAll?.("img, picture, figure, canvas, svg, use") || [];
    elements.forEach((el) => {
      el.style.display = "none";
      el.style.visibility = "hidden";
    });

    node.style.backgroundImage = "none";
    node.style.maskImage = "none";
    node.style.webkitMaskImage = "none";

    const children = node.querySelectorAll("*");
    children.forEach((el) => {
      el.style.backgroundImage = "none";
      el.style.maskImage = "none";
      el.style.webkitMaskImage = "none";
    });
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(hideNewImages);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始也执行一遍
  hideNewImages(document.body);
})();
