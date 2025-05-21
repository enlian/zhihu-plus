// ==UserScript==
// @name         知乎Plus
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  知乎极简暗黑阅读模式
// @author       https://github.com/enlian
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @match        https://daily.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // 定义全局配色方案，用于不同页面元素的背景色、文字色等，保证暗黑模式统一风格
  const COLORS = {
    background: "#1e1e1e",
    blockBackground: "#222",
    text: "#d4d4d4",
    buttonBackground: "#333",
    buttonText: "rgb(205,205,205)",
    linkText: "rgb(205,205,205)",
    border: "#444",
  };

  // 全局样式注入逻辑，避免重复注入
  // style.id = "vscode-global-style" 用于唯一标识该样式块，方便后续判断和管理
  // 选择器覆盖页面主要布局、文本、按钮等元素，统一应用暗黑背景和文字颜色，提升阅读体验
  if (!document.getElementById("vscode-global-style")) {
    const style = document.createElement("style");
    style.id = "vscode-global-style";
    style.textContent = `
      /* 页面基础背景色与文字色 */
      html {
        overflow-x: hidden !important;
      }
      body {
        background-color: #1e1e1e !important;
        color: #d4d4d4 !important;
      }
      /* 全局文字样式 */
      a,p,span,h1 {
        color: ${COLORS.linkText} !important;
        background-color: ${COLORS.blockBackground} !important;
      }
      /* 按钮样式 */
      button {
        background-color: ${COLORS.buttonBackground} !important;
        color: ${COLORS.buttonText} !important;
        border: none !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
      }
      /* 所有元素的盒模型统一 */
      * {
        overflow-wrap: break-word !important;
        word-break: break-word !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      /* 内容区块暗色风格 */
      .Card,
      .ContentItem,
      .Question-mainColumn,
      .Topstory-mainColumn,
      .Topstory-container,
      .Post-item,
      .Question-main,
      .ListShortcut,
      .ContentItem-actions,
      .QuestionHeader,
      .QuestionHeader-footer,
      .List-headerText,
      .Comments-container div,
      .Modal-content,
      .Modal-content div,
      .comment_img {
        background-color: ${COLORS.blockBackground} !important;
        color: ${COLORS.text} !important;
        box-sizing: border-box !important;
        overflow-wrap: break-word !important;
        word-break: break-word !important;
        min-width: 0 !important;
      }
      /* 内容块 padding 和分隔线 */
      .TopstoryItem,
      .List-item,
      .QuestionAnswer-content {
        padding: 20px 10px 20px 10px !important;
        border-bottom: 1px solid ${COLORS.border} !important;
      }
      /* 布局区域宽度设置 */
      /* Expand main layout width to 100% for better reading experience */
      .Topstory-mainColumn,
      .Question-mainColumn,
      .Topstory-container,
      .Question-main,
      .ListShortcut,
      .QuestionHeader-main,
      .App-main,
      .AuthorInfo-content,
      .Search-container,
      .SearchMain,
      div[style*="width: 688px"],
      .Post-Row-Content-left,
      .Post-Row-Content-left-article,
      .css-1aq8hf9 {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0px !important;
        margin: 0 auto !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        overflow-wrap: break-word !important;
        word-break: break-word !important;
        min-width: 0 !important;
      }
      /* 自定义知乎搜索框样式 */
      #vscode-search-box {
        margin: 20px auto;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 10px;
        height: 36px !important;
      }
      #vscode-search-box form {
        flex: 1;
        display: flex;
        gap: 8px;
        height: 36px;
      }
      #vscode-search-box input {
        padding: 6px 10px;
        border: 1px solid ${COLORS.border};
        border-radius: 4px;
        background-color: ${COLORS.blockBackground};
        color: ${COLORS.text};
        outline: none;
        flex: 1;
        height: 36px;
        box-sizing: border-box;
      }
      #vscode-search-box button {
        padding: 6px 10px;
        border: none;
        border-radius: 4px;
        background-color: ${COLORS.buttonBackground};
        color: #fff;
        cursor: pointer;
        flex: none;
        height: 36px;
        box-sizing: border-box;
      }
      /* 隐藏媒体元素 */
      img, picture, video {
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 插入自定义的知乎搜索框
   */
  const insertSearchBox = () => {
    if (document.getElementById("vscode-search-box")) return;

    const container = document.createElement("div");
    container.id = "vscode-search-box";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "知乎搜索…";

    const button = document.createElement("button");
    button.textContent = "搜索";

    const form = document.createElement("form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const q = encodeURIComponent(input.value.trim());
      if (q) {
        window.location.href = `https://www.zhihu.com/search?type=content&q=${q}`;
      }
    };

    form.appendChild(input);
    form.appendChild(button);
    container.appendChild(form);

    const target = document.querySelector("main") || document.body;
    if (target) {
      target.insertBefore(container, target.firstChild);
    }
  };

  // 删除元素
  const NOISE_SELECTORS = [
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
    //".QuestionHeader-footer",
    ".QuestionHeader-tags",

    ".Reward",
    ".UserLink",
    ".AuthorInfo-badgeText",
    ".SearchTabs",
    ".TopSearch",
    "footer",
    ".QuestionStatus-notification",
    ".CornerButtons",
    ".Post-Sub.Post-NormalSub",
    ".Post-Row-Content-right",
    ".ColumnPageHeader-Wrapper",
    ".Pc-word-new",
    ".ErrorPage",
    "link[rel*='icon']",
  ];

  // 删除按钮
  const BUTTON_LABELS_TO_REMOVE = new Set(["回到顶部", "反对"]);

  /**
   * 移除页面中的噪声元素，如广告、侧边栏、无关按钮等
   */
  const removeNoiseElements = (root = document) => {
    if (!root) return;
    root
      .querySelectorAll(NOISE_SELECTORS.join(","))
      .forEach((el) => el.remove());

    root.querySelectorAll("button").forEach((btn) => {
      const label = btn.getAttribute("aria-label");
      if (BUTTON_LABELS_TO_REMOVE.has(label)) {
        btn.remove();
      }
    });
  };

  /**
   * 应用所有自定义样式和功能增强
   */
  const applyAllEnhancements = () => {
    removeNoiseElements();
    insertSearchBox();
  };

  applyAllEnhancements();

  // 监听页面 DOM 变动，处理异步加载的内容，确保新增内容同样应用暗黑模式和清理规则
  const observer = new MutationObserver(() => {
    applyAllEnhancements();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
