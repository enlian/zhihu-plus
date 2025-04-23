// ==UserScript==
// @name         知乎Plus（极简暗黑VSCode风）
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  知乎极简暗黑阅读模式，适配动态加载，避免顶部遮挡，删除回到顶部按钮，打造完美VSCode风体验
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 需要彻底移除的元素
   */
  const REMOVE_ELEMENTS_SELECTORS = [
    "figure", "canvas", "svg", "use",
    "header",
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
    ".TopstoryItem--advertCard", // 广告
      ".RichText-LinkCardContainer", //富文本跳转小块
      ".ecommerce-ad-box", // 文章内商品广告
  ];

  /**
   * 需要宽度设为100%的容器
   */
  const MAIN_CONTAINERS_SELECTORS = [
    ".Topstory-mainColumn",
    ".Question-mainColumn",
    ".Topstory-container",
    ".Question-main",
    ".ListShortcut",
  ];

  /**
   * 需要单独padding设为0的元素（比如每个回答块）
   */
  const ITEM_CONTENT_SELECTORS = [
    ".TopstoryItem",
      ".List-item",
      ".QuestionAnswer-content"
  ];

  /**
   * 需要设置深色背景的内容块
   */
  const DARK_BACKGROUND_SELECTORS = [
    ".Card", ".ContentItem", ".Question-mainColumn", ".Topstory-mainColumn",
    ".Topstory-container", ".Post-item", ".Question-main", ".ListShortcut",
    ".ContentItem-actions", ".QuestionHeader", ".QuestionHeader-footer", ".List-headerText",".comment_img"
  ];

  /**
   * 隐藏所有图片/视频等多媒体元素
   */
  const hideVisualElements = (root = document) => {
    root.querySelectorAll("img, picture, video").forEach(el => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

  /**
   * 删除不需要的元素
   */
  const removeUnnecessaryElements = (root = document) => {
    root.querySelectorAll(REMOVE_ELEMENTS_SELECTORS.join(",")).forEach(el => el.remove());
  };

  /**
   * 删除右下角的回到顶部按钮
   */
  const removeBackToTopButton = () => {
    document.querySelectorAll("button").forEach(btn => {
      if (btn.getAttribute("aria-label") === "回到顶部") {
        btn.remove();
      }
    });
  };

  /**
   * 设置主列容器宽度100%
   */
  const styleMainContainers = (root = document) => {
    root.querySelectorAll(MAIN_CONTAINERS_SELECTORS.join(",")).forEach(el => {
      Object.assign(el.style, {
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0px",
        margin: "0 auto",
      });
    });
  };

  /**
   * 给特定元素强制设置padding为0
   */
  const setItemContentPadding = (root = document) => {
    root.querySelectorAll(ITEM_CONTENT_SELECTORS.join(",")).forEach(el => {
      el.style.padding = "0px 10px 20px 10px";
    });
  };

  /**
   * 给需要的内容块设置深灰背景
   */
  const styleContentBlocks = (root = document) => {
    root.querySelectorAll(DARK_BACKGROUND_SELECTORS.join(",")).forEach(el => {
      Object.assign(el.style, {
        backgroundColor: "#222",
        color: "#d4d4d4",
        boxSizing: "border-box",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        minWidth: "0",
      });
    });
  };

  /**
   * 所有元素基本统一文字处理
   */
  const styleAllElements = (root = document) => {
    root.querySelectorAll("*").forEach(el => {
      el.style.overflowWrap = "break-word";
      el.style.wordBreak = "break-word";
      el.style.minWidth = "0";
      el.style.boxSizing = "border-box";
    });
  };

  /**
   * 美化文字、按钮和链接的颜色
   */
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
      root.querySelectorAll("span").forEach(a => {
      a.style.color = "rgb(205,205,205)";
    });
  };

  /**
   * 强制全局暗黑背景色
   */
  const applyDarkBackground = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#d4d4d4";
  };

  /**
   * 统一执行所有样式应用
   */
  const applyAllCustomStyles = () => {
    hideVisualElements();
    removeUnnecessaryElements();
    removeBackToTopButton();
    styleMainContainers();
    setItemContentPadding();
    styleContentBlocks();
    styleAllElements();
    styleButtonsAndLinks();
    applyDarkBackground();
  };

  // 初次应用
  applyAllCustomStyles();

  // 监听页面动态变化（比如下拉刷新）
  const observer = new MutationObserver(() => {
    applyAllCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
