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

  const COLORS = {
    background: "#1e1e1e",
    blockBackground: "#222",
    text: "#d4d4d4",
    buttonBackground: "#333",
    buttonText: "rgb(205,205,205)",
    linkText: "rgb(205,205,205)",
    border: "#444",
  };

  if (!document.getElementById("vscode-global-style")) {
    const style = document.createElement("style");
    style.id = "vscode-global-style";
    style.textContent = `a { color: rgb(205,205,205) !important; }`;
    document.head.appendChild(style);
  }

  // 基础盒模型样式，应用于主要容器和内容块，保证布局和文本换行一致性
  const BASE_BOX_STYLE = {
    boxSizing: "border-box",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    minWidth: "0",
  };

  // 基础元素样式，应用于所有元素，保证文本换行和盒模型一致
  const BASE_ELEMENT_STYLE = {
    overflowWrap: "break-word",
    wordBreak: "break-word",
    minWidth: "0",
    boxSizing: "border-box",
  };

  /**
   * 插入自定义的知乎搜索框
   * 适用场景：页面顶部添加简洁的搜索输入框，方便用户快速搜索知乎内容
   */
  const insertSearchBox = () => {
    if (document.getElementById("vscode-search-box")) return;

    const container = document.createElement("div");
    container.id = "vscode-search-box";
    container.style.margin = "20px auto";
    container.style.maxWidth = "720px";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.padding = "0 10px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "知乎搜索…";
    Object.assign(input.style, {
      padding: "6px 10px",
      border: `1px solid ${COLORS.border}`,
      borderRadius: "4px",
      backgroundColor: COLORS.blockBackground,
      color: COLORS.text,
      outline: "none",
      flex: "1",
    });

    const button = document.createElement("button");
    button.textContent = "搜索";
    Object.assign(button.style, {
      padding: "6px 10px",
      border: "none",
      borderRadius: "4px",
      backgroundColor: COLORS.buttonBackground,
      color: "#fff",
      cursor: "pointer",
      marginLeft: "10px",
    });

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flex = "1";
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
    target.insertBefore(container, target.firstChild);
  };

  /**
   * 隐藏页面中的媒体元素（图片、视频等）
   * 适用场景：减少视觉干扰，提升极简阅读体验
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const hideMediaElements = (root = document) => {
    const selectors = ["img", "picture", "video"];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

  /**
   * 移除页面中的噪声元素，如广告、侧边栏、无关按钮等
   * 适用场景：清理页面内容，去除干扰元素，提升阅读专注度
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const removeNoiseElements = (root = document) => {
    // 选择器组：常见广告、侧边栏、无关内容等
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
    ];
    // 移除上述选择器对应的所有元素
    root.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
    // 移除 aria-label 为“回到顶部”或“反对”的按钮
    const labelsToRemove = ["回到顶部", "反对"];
    document.querySelectorAll("button").forEach((btn) => {
      const label = btn.getAttribute("aria-label");
      if (labelsToRemove.includes(label)) {
        btn.remove();
      }
    });
    // 删除 favicon 防止干扰
    document.querySelectorAll('link[rel*="icon"]').forEach((el) => el.remove());
  };

  /**
   * 扩展主要内容容器宽度至100%
   * 适用场景：调整页面布局，使内容区域最大化利用宽度，提升阅读体验
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const expandMainLayoutWidth = (root = document) => {
    const selectors = [
      ".Topstory-mainColumn",
      ".Question-mainColumn",
      ".Topstory-container",
      ".Question-main",
      ".ListShortcut",
      ".QuestionHeader-main",
      ".App-main",
      ".AuthorInfo-content",
      ".Search-container",
      ".SearchMain",
      'div[style*="width: 688px"]',
      ".Post-Row-Content-left",
      ".Post-Row-Content-left-article",
      ".css-1aq8hf9",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      Object.assign(
        el.style,
        Object.assign(
          {
            width: "100%",
            maxWidth: "100%",
            padding: "0px",
            margin: "0 auto",
            overflowX: "hidden",
          },
          BASE_BOX_STYLE
        )
      );
    });
  };

  /**
   * 样式化内容区域的各个区块
   * 适用场景：统一内容块的背景、边距和边框样式，提升整体视觉一致性
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const styleContentAreaBlocks = (root = document) => {
    // 配置数组，每个对象包含选择器和对应样式
    const styleConfigs = [
      {
        selectors: [".TopstoryItem", ".List-item", ".QuestionAnswer-content"],
        style: {
          padding: "20px 10px 20px 10px",
          borderBottom: `1px solid ${COLORS.border}`,
        },
      },
      {
        selectors: [
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
        ],
        style: {
          backgroundColor: COLORS.blockBackground,
          color: COLORS.text,
          ...BASE_BOX_STYLE,
        },
      },
    ];
    styleConfigs.forEach(({ selectors, style }) => {
      root.querySelectorAll(selectors.join(",")).forEach((el) => {
        Object.assign(el.style, style);
      });
    });
  };

  /**
   * 应用全局基础样式，确保所有元素文本换行及盒模型一致
   * 适用场景：统一页面所有元素的基础样式，避免样式冲突和显示异常
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const applyGlobalBaseStyle = (root = document) => {
    root.querySelectorAll("*").forEach((el) => {
      Object.assign(el.style, BASE_ELEMENT_STYLE);
    });
  };

  /**
   * 样式化按钮和链接元素，统一配色方案
   * 适用场景：调整交互元素的颜色和样式，提升视觉一致性和可用性
   * @param {Document|Element} root - 作用根节点，默认文档根
   */
  const applyButtonAndLinkStyle = (root = document) => {
    root.querySelectorAll("button").forEach((btn) => {
      Object.assign(btn.style, {
        backgroundColor: COLORS.buttonBackground,
        color: COLORS.buttonText,
        border: "none",
        boxSizing: "border-box",
      });
    });
    // root.querySelectorAll("a, span, h1").forEach((el) => {
    //   el.style.color = COLORS.linkText;
    // });
  };

  /**
   * 应用暗色背景和整体文字颜色
   * 适用场景：切换页面为暗黑模式，减少视觉疲劳
   */
  const applyDarkPageBackground = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.backgroundColor = COLORS.background;
    document.body.style.color = COLORS.text;
  };

  /**
   * 应用所有自定义样式和功能增强
   * 适用场景：初始化及动态更新页面时调用，确保样式和功能一致生效
   */
  const applyAllEnhancements = () => {
    hideMediaElements();
    removeNoiseElements();
    expandMainLayoutWidth();
    styleContentAreaBlocks();
    applyDarkPageBackground();
    insertSearchBox();
    applyButtonAndLinkStyle();
    //applyGlobalBaseStyle();
  };

  applyAllEnhancements();

  const observer = new MutationObserver(() => {
    applyAllEnhancements();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
