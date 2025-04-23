// ==UserScript==
// @name         知乎Plus（极简暗黑VSCode风）
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  知乎极简暗黑阅读模式，适配动态加载，避免顶部遮挡，删除回到顶部按钮，打造完美VSCode风体验
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const COLORS = {
    background: "#1e1e1e", // 页面背景色
    blockBackground: "#222", // 内容块背景色
    text: "#d4d4d4", // 默认文字颜色
    buttonBackground: "#333", // 按钮背景色
    buttonText: "rgb(205,205,205)", // 按钮文字颜色
    linkText: "rgb(205,205,205)", // 链接文字颜色
    border: "#444",
  };

  /** 隐藏所有图片和视频等视觉内容 */
  const hideVisualElements = (root = document) => {
    const selectors = ["img", "picture", "video"];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

  /** 删除页面中不需要的元素，如广告、侧边栏、按钮等 */
  const removeUnnecessaryElements = (root = document) => {
    const selectors = [
      "figure",
      "canvas",
      "svg",
      "use",
      "header",
      '[data-za-detail-view-path-module="RightSideBar"]',
      ".QuestionHeader-side",
      ".Question-sideColumn",
      "button.FollowButton",
      ".AppHeader-userInfo",
      ".SearchBar-askButton",
      ".ShareMenu",
      ".TopstoryHeader",
      ".Question-sideColumn",
      ".TopstoryItem--advertCard",
      ".RichText-LinkCardContainer",
      ".ecommerce-ad-box",
      ".QuestionHeader-footer",
      ".QuestionHeader-tags",
      ".Reward",
      ".UserLink",
      ".AuthorInfo-badgeText",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
  };

  /** 删除特定 button（通过 aria-label 判断） */
  const removeSpecificButtons = () => {
    const labelsToRemove = ["回到顶部", "反对"];
    document.querySelectorAll("button").forEach((btn) => {
      const label = btn.getAttribute("aria-label");
      if (labelsToRemove.includes(label)) {
        btn.remove();
      }
    });
  };

  /** 设置主内容容器的宽度为100% */
  const styleMainContainers = (root = document) => {
    const selectors = [
      ".Topstory-mainColumn",
      ".Question-mainColumn",
      ".Topstory-container",
      ".Question-main",
      ".ListShortcut",
      ".QuestionHeader-main",
      ".App-main",
      ".AuthorInfo-content",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
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

  /** 调整每个回答块item的样式 */
  const setItemStyle = (root = document) => {
    const selectors = [
      ".TopstoryItem",
      ".List-item",
      ".QuestionAnswer-content",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.style.padding = "20px 10px 20px 10px ";
      el.style.borderBottom = `1px solid ${COLORS.border}`;
    });
  };

  /** 给内容块设置暗色背景和文字颜色 */
  const styleContentBlocks = (root = document) => {
    const selectors = [
      ".Card",
      ".ContentItem",
      ".Question-mainColumn",
      ".Topstory-mainColumn",
      ".Topstory-container",
      ".Post-item",
      ".Question-main",
      ".ListShortcut",
      ".ContentItem-actions",
      ".QuestionHeader",
      ".QuestionHeader-footer",
      ".List-headerText",
      ".comment_img",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      Object.assign(el.style, {
        backgroundColor: COLORS.blockBackground,
        color: COLORS.text,
        boxSizing: "border-box",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        minWidth: "0",
      });
    });
  };

  /** 所有元素通用的样式优化（比如换行处理） */
  const styleAllElements = (root = document) => {
    root.querySelectorAll("*").forEach((el) => {
      Object.assign(el.style, {
        overflowWrap: "break-word",
        wordBreak: "break-word",
        minWidth: "0",
        boxSizing: "border-box",
      });
    });
  };

  /** 美化按钮、链接和文字颜色 */
  const styleButtonsAndLinks = (root = document) => {
    root.querySelectorAll("button").forEach((btn) => {
      Object.assign(btn.style, {
        backgroundColor: COLORS.buttonBackground,
        color: COLORS.buttonText,
        border: "none",
        boxSizing: "border-box",
      });
    });
    root.querySelectorAll("a, span, h1").forEach((el) => {
      el.style.color = COLORS.linkText;
    });
  };

  /** 设置页面整体背景为暗黑色 */
  const applyDarkBackground = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.backgroundColor = COLORS.background;
    document.body.style.color = COLORS.text;
  };

  /** 统一调用所有自定义样式 */
  const applyAllCustomStyles = () => {
    hideVisualElements();
    removeUnnecessaryElements();
    removeSpecificButtons();
    styleMainContainers();
    setItemStyle();
    styleContentBlocks();
    styleAllElements();
    styleButtonsAndLinks();
    applyDarkBackground();
  };

  // 初始执行
  applyAllCustomStyles();

  // 监听 DOM 变化（应对知乎的动态加载机制）
  const observer = new MutationObserver(() => {
    applyAllCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
