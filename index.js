// ==UserScript==
// @name         知乎Plus（极简Textモード+暗黑VSCode風）修正版
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动隐藏知乎视觉元素，展开主列，自适应宽度，禁止横向滚动，优化文字色，彻底暗黑主题，强制文字换行，适配动态加载（修正）
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const REMOVE_SELECTORS = [
    "figure", "canvas", "svg", "use",
      "header",
    ".RichContent-cover",
    '[data-za-detail-view-path-module="RightSideBar"]',
    ".QuestionHeader-side",
    ".Question-sideColumn",
    "button.FollowButton",
    ".AppHeader-userInfo",
    ".SearchBar-askButton",
    ".ShareMenu",
    ".TopstoryHeader",
    ".QuestionHeader-content",
    ".Question-sideColumn",
  ];

  const CONTAINER_SELECTORS = [
    ".Topstory-mainColumn",
    ".Question-mainColumn",
    ".Topstory-container",
    ".Question-main",
    ".ListShortcut"
  ];

  const hideVisualMedia = (root = document) => {
    root.querySelectorAll("img, picture, video").forEach(el => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

  const removeUnwantedElements = (root = document) => {
    root.querySelectorAll(REMOVE_SELECTORS.join(",")).forEach(el => el.remove());
  };

  const styleContainers = (root = document) => {
    root.querySelectorAll(CONTAINER_SELECTORS.join(",")).forEach(el => {
      Object.assign(el.style, {
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0px",
        margin: "0 auto",
      });
    });
  };

  const styleAllElements = (root = document) => {
    root.querySelectorAll("*").forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag !== "button" && tag !== "a") {
        el.style.backgroundColor = "#222";
        el.style.color = "#d4d4d4";
      }
      el.style.overflowWrap = "break-word";
      el.style.wordBreak = "break-word";
      el.style.minWidth = "0";
      el.style.boxSizing = "border-box";
    });
  };

  const styleButtonsAndLinks = (root = document) => {
    root.querySelectorAll("button").forEach(btn => {
      Object.assign(btn.style, {
        backgroundColor: "#333",
        color: "rgb(205,205,205)",
        border: "none",
        boxSizing: "border-box",
      });
    });

    root.querySelectorAll("a").forEach(a => {
      a.style.color = "rgb(205,205,205)";
    });
  };

  const forceDarkBackground = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#d4d4d4";
  };

  const applyAllStyles = () => {
    hideVisualMedia();
    removeUnwantedElements();
    styleContainers();
    styleAllElements();
    styleButtonsAndLinks();
    forceDarkBackground();
  };

  // 初次应用
  applyAllStyles();

  // 用 MutationObserver 实现动态内容更新
  const observer = new MutationObserver(() => {
    applyAllStyles(); // 页面有变化就全局刷新样式
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
