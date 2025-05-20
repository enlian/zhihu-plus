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
      backgroundColor: "#007acc",
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

  const hideVisualElements = (root = document) => {
    const selectors = ["img", "picture", "video"];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.style.visibility = "hidden";
      el.style.opacity = "0";
    });
  };

    //删除非必要元素
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
        '.Post-Sub.Post-NormalSub'
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
  };

  const removeSpecificButtons = () => {
    const labelsToRemove = ["回到顶部", "反对"];
    document.querySelectorAll("button").forEach((btn) => {
      const label = btn.getAttribute("aria-label");
      if (labelsToRemove.includes(label)) {
        btn.remove();
      }
    });
  };

    //宽度改成100%的元素
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
      ".Search-container",
      ".SearchMain",
        'div[style*="width: 688px"]',

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

  const setItemStyle = (root = document) => {
    const selectors = [
      ".TopstoryItem",
      ".List-item",
      ".QuestionAnswer-content",
    ];
    root.querySelectorAll(selectors.join(",")).forEach((el) => {
      el.style.padding = "20px 10px 20px 10px";
      el.style.borderBottom = `1px solid ${COLORS.border}`;
    });
  };

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

  const applyDarkBackground = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.backgroundColor = COLORS.background;
    document.body.style.color = COLORS.text;
  };

  const removeFavicon = () => {
    document.querySelectorAll('link[rel*="icon"]').forEach((el) => el.remove());
  };

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
    insertSearchBox();
    removeFavicon();
  };

  applyAllCustomStyles();

  const observer = new MutationObserver(() => {
    applyAllCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
