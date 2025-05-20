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
  'use strict';

  // 定义页面颜色主题
  const COLORS = {
    background: '#1e1e1e',
    blockBackground: '#222',
    text: '#d4d4d4',
    buttonBackground: '#333',
    buttonText: 'rgb(205,205,205)',
    linkText: 'rgb(205,205,205)',
    border: '#444',
  };

  // 定义基础盒模型样式，确保文本换行和布局一致性
  const BASE_BOX_STYLE = {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    minWidth: '0',
    boxSizing: 'border-box',
  };

  /**
   * 为指定元素应用样式
   * @param {HTMLElement} element - 目标元素
   * @param {Object} style - 样式对象
   */
  const applyStyles = (element, style) => {
    if (element) Object.assign(element.style, style);
  };

  /**
   * 为指定选择器集合匹配的所有元素应用样式
   * @param {string[]} selectors - CSS选择器数组
   * @param {Object} style - 样式对象
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const applyStylesToSelectors = (selectors, style, root = document) => {
    root.querySelectorAll(selectors.join(',')).forEach((el) => applyStyles(el, style));
  };

  /**
   * 插入自定义知乎搜索框到页面顶部
   */
  const insertSearchBox = () => {
    if (document.getElementById('vscode-search-box')) return;

    const container = document.createElement('div');
    container.id = 'vscode-search-box';
    container.style.margin = '20px auto';
    container.style.maxWidth = '720px';
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.style.padding = '0 10px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '知乎搜索…';
    Object.assign(input.style, {
      padding: '6px 10px',
      border: `1px solid ${COLORS.border}`,
      borderRadius: '4px',
      backgroundColor: COLORS.blockBackground,
      color: COLORS.text,
      outline: 'none',
      flex: '1',
    });

    const button = document.createElement('button');
    button.textContent = '搜索';
    Object.assign(button.style, {
      padding: '6px 10px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: COLORS.buttonBackground,
      color: '#fff',
      cursor: 'pointer',
      marginLeft: '10px',
    });

    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flex = '1';
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

    const target = document.querySelector('main') || document.body;
    target.insertBefore(container, target.firstChild);
  };

  /**
   * 隐藏页面中的图片、视频等视觉元素，减少干扰
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const hideVisualElements = (root = document) => {
    const selectors = ['img', 'picture', 'video'];
    root.querySelectorAll(selectors.join(',')).forEach((el) => {
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
    });
  };

  /**
   * 移除页面中非必要的元素和特定按钮以简化界面
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const removeUnnecessaryElements = (root = document) => {
    const selectors = [
      // 媒体元素
      'figure',
      'canvas',
      'svg',
      'use',
      // 头部和侧边栏
      'header',
      '[data-za-detail-view-path-module="RightSideBar"]',
      '.QuestionHeader-side',
      '.Question-sideColumn',
      '.TopstoryHeader',
      '.QuestionHeader-tags',
      '.ColumnPageHeader-Wrapper',
      // 按钮和用户信息相关
      'button.FollowButton',
      '.AppHeader-userInfo',
      '.SearchBar-askButton',
      '.ShareMenu',
      '.Reward',
      '.UserLink',
      '.AuthorInfo-badgeText',
      '.SearchTabs',
      '.TopSearch',
      '.CornerButtons',
      // 广告和推广内容
      '.TopstoryItem--advertCard',
      '.RichText-LinkCardContainer',
      '.ecommerce-ad-box',
      '.Pc-word-new',
      // 文章状态和底部
      'footer',
      '.QuestionStatus-notification',
      '.Post-Sub.Post-NormalSub',
      '.Post-Row-Content-right',
      // favicon 链接
      'link[rel*="icon"]',
    ];
    root.querySelectorAll(selectors.join(',')).forEach((el) => el.remove());

    // 额外移除特定 aria-label 的按钮
    const labelsToRemove = ['回到顶部', '反对'];
    root.querySelectorAll('button').forEach((btn) => {
      const label = btn.getAttribute('aria-label');
      if (labelsToRemove.includes(label)) {
        btn.remove();
      }
    });
  };

  /**
   * 将主要内容容器扩展至页面宽度的100%，并应用基础盒模型样式，保证布局一致
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const expandAndNormalizeContainers = (root = document) => {
    const selectors = [
      '.Topstory-mainColumn',
      '.Question-mainColumn',
      '.Topstory-container',
      '.Question-main',
      '.ListShortcut',
      '.QuestionHeader-main',
      '.App-main',
      '.AuthorInfo-content',
      '.Search-container',
      '.SearchMain',
      'div[style*="width: 688px"]',
      '.Post-Row-Content-left',
      '.Post-Row-Content-left-article',
      '.css-1aq8hf9',
    ];
    const style = {
      ...BASE_BOX_STYLE,
      width: '100%',
      maxWidth: '100%',
      padding: '0px',
      margin: '0 auto',
      overflowX: 'hidden',
    };
    applyStylesToSelectors(selectors, style, root);
  };

  /**
   * 为内容块和列表项统一添加暗色主题背景、文字颜色、内边距和下边框，增强可读性
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const styleContentBlocksAndItems = (root = document) => {
    const selectors = [
      '.Card',
      '.ContentItem',
      '.Question-mainColumn',
      '.Topstory-mainColumn',
      '.Topstory-container',
      '.Post-item',
      '.Question-main',
      '.ListShortcut',
      '.ContentItem-actions',
      '.QuestionHeader',
      '.QuestionHeader-footer',
      '.List-headerText',
      '.comment_img',
      '.TopstoryItem',
      '.List-item',
      '.QuestionAnswer-content',
    ];
    root.querySelectorAll(selectors.join(',')).forEach((el) => {
      Object.assign(el.style, {
        ...BASE_BOX_STYLE,
        backgroundColor: COLORS.blockBackground,
        color: COLORS.text,
        padding: '10px 2px 10px 2px',
      });
    });
  };

  /**
   * 为按钮和链接等交互元素应用统一样式，提升视觉一致性
   * @param {Document|HTMLElement} root - 查询根节点，默认为document
   */
  const styleInteractiveElements = (root = document) => {
    root.querySelectorAll('button').forEach((btn) => {
      Object.assign(btn.style, {
        backgroundColor: COLORS.buttonBackground,
        color: COLORS.buttonText,
        border: 'none',
        boxSizing: 'border-box',
      });
    });
    root.querySelectorAll('a, span, h1').forEach((el) => {
      el.style.color = COLORS.linkText;
    });
  };

  /**
   * 应用整体暗色背景和文字颜色，防止页面横向滚动
   */
  const applyDarkBackground = () => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.backgroundColor = COLORS.background;
    document.body.style.color = COLORS.text;
  };

  /**
   * 执行所有自定义样式应用任务
   */
  const applyAllCustomStyles = () => {
    const tasks = [
      hideVisualElements,
      removeUnnecessaryElements,
      expandAndNormalizeContainers,
      styleContentBlocksAndItems,
      styleInteractiveElements,
      applyDarkBackground,
      insertSearchBox,
    ];
    tasks.forEach((fn) => fn());
  };

  applyAllCustomStyles();

  const observer = new MutationObserver(() => {
    applyAllCustomStyles();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
