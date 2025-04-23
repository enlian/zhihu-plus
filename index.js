// ==UserScript==
// @name         知乎Plus（极简Text Mode + 暗黑VSCode風）完全修正版
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  知乎极简暗黑阅读模式，自动适配动态加载，避免顶部空白遮挡，完美VSCode风体验
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
      ".TopstoryItem--advertCard"
  ];

  const CONTAINER_SELECTORS = [
    ".Topstory-mainColumn",
    ".Question-mainColumn",
    ".Topstory-container",
    ".Question-main",
    ".ListShortcut"
  ];

  const CONTENT_BLOCK_SELECTORS = [
    ".Card", ".ContentItem", ".Question-mainColumn", ".Topstory-mainColumn", ".Topstory-container", ".Post-item", ".Question-main", ".ListShortcut",".ContentItem-actions"
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

  const styleMainContentBlocks = (root = document) => {
    root.querySelectorAll(CONTENT_BLOCK_SELECTORS.join(",")).forEach(el => {
      el.style.backgroundColor = "#222"; // 主内容块深灰背景
      el.style.color = "#d4d4d4";
      el.style.boxSizing = "border-box";
      el.style.overflowWrap = "break-word";
      el.style.wordBreak = "break-word";
      el.style.minWidth = "0";
    });
  };

  const styleAllElements = (root = document) => {
    root.querySelectorAll("*").forEach(el => {
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
    styleMainContentBlocks();
    styleAllElements();
    styleButtonsAndLinks();
    forceDarkBackground();
  };

  // 初次应用
  applyAllStyles();

  // 动态变化监听（下拉刷新、动态加载）
  const observer = new MutationObserver(() => {
    applyAllStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
