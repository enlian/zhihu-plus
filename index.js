// ==UserScript==
// @name         知乎Plus
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动隐藏知乎中图片等视觉元素，展开主列，优化整体背景色和文字色
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 移除不需要的元素
  const removeElementsCompletely = [
    "figure",
    "canvas",
    "svg",
    "use",
    ".RichContent-cover",
    '[data-za-detail-view-path-module="RightSideBar"]',
    ".css-1reovvu",
    ".QuestionHeader-side",
    ".Question-sideColumn",
    "button.FollowButton",
    ".AppHeader-userInfo",
    ".SearchBar-askButton",
    ".ShareMenu",
  ];

  const visuallyHideMedia = (root = document) => {
    const mediaSelectors = ["img", "picture", "video"];
    root.querySelectorAll(mediaSelectors.join(",")).forEach((el) => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

  const removeUnwantedElements = (root = document) => {
    root
      .querySelectorAll(removeElementsCompletely.join(","))
      .forEach((el) => el.remove());
  };

  const expandMainColumns = (root = document) => {
    const expandSelectors = [
      ".Topstory-mainColumn",
      ".Question-mainColumn",
      ".ListShortcut",
    ];
    expandSelectors.forEach((selector) => {
      const el = root.querySelector(selector);
      if (el) {
        el.style.width = "100%";
      }
    });
  };

  const restyleButtonsAndLinks = (root = document) => {
    root.querySelectorAll("button").forEach((btn) => {
      btn.style.backgroundColor = "#333"; // 深灰色背景
      btn.style.color = "rgb(205,205,205)"; // 淡灰色文字
      btn.style.border = "none"; // 去除按钮边框，保持简洁
    });

    root.querySelectorAll("a").forEach((a) => {
      a.style.color = "rgb(205,205,205)"; // 淡灰色文字
    });
  };

  // ✅ 全局修改背景色和文字色
  const applyGlobalStyles = (root = document) => {
    // 设置页面背景色为黑色，并优化整体视觉效果
    document.body.style.backgroundColor = "#1e1e1e"; // 更深的黑色背景
    document.body.style.color = "#d4d4d4"; // 优化文字颜色为浅灰色，确保对比度

    // 设置全页面文字区域背景色为深灰色
    root.querySelectorAll("*").forEach((el) => {
      // 忽略按钮、链接等已修改的元素
      if (
        el.tagName.toLowerCase() !== "button" &&
        el.tagName.toLowerCase() !== "a"
      ) {
        el.style.backgroundColor = "#222"; // 深灰色背景
        el.style.color = "#d4d4d4"; // 浅灰色文字
      }
    });

    // 设置 .QuestionHeader-title 的 margin-top
    const questionHeaderTitle = root.querySelector("h1.QuestionHeader-title");
    if (questionHeaderTitle) {
      questionHeaderTitle.style.marginTop = "50px";
    }
  };

  const applyChanges = (root = document) => {
    visuallyHideMedia(root);
    removeUnwantedElements(root);
    expandMainColumns(root);
    restyleButtonsAndLinks(root);
    applyGlobalStyles(root); // 应用全局样式修改
  };

  applyChanges();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          applyChanges(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
