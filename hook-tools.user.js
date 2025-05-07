// ==UserScript==
// @name         Hook工具集1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  网页调试工具集，包含多个常用的Hook功能，支持DOM/网络/环境模拟等多种调试场景
// @author       TampermonkeyUser
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 添加控制面板样式
    GM_addStyle(`
        #hook-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            font-family: Arial, sans-serif;
            min-width: 300px;
        }
        #hook-control-panel h3 {
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #4CAF50;
            color: #333;
            font-size: 16px;
        }
        .hook-category {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .hook-category-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #2196F3;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .hook-category-toggle {
            cursor: pointer;
            color: #666;
            font-size: 12px;
        }
        .hook-control-item {
            margin: 8px 0;
            display: flex;
            align-items: center;
            padding: 5px;
            background: white;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .hook-control-item:hover {
            background: #e8f5e9;
        }
        .hook-control-item label {
            margin-left: 8px;
            cursor: pointer;
            font-size: 13px;
            color: #555;
            flex-grow: 1;
        }
        .hook-control-item input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }
        #hook-toggle-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
            transition: background-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #hook-toggle-panel:hover {
            background: #45a049;
        }
        #hook-toggle-panel.dragging {
            cursor: move;
            opacity: 0.8;
        }
    `);

    // Hook功能配置
    const hookFeatures = {
        // DOM操作相关
        createElement: {
            name: 'createElement',
            category: 'DOM操作',
            enabled: false,
            handler: function() {
                let createElementCache = document.createElement;
                document.createElement = function(tagName) {
                    console.info("Hook createElement tagName => ", tagName);
                    if(tagName === "div" || tagName === "canvas") {
                        debugger;
                    }
                    return createElementCache.apply(this, arguments);
                };
            }
        },
        getElementById: {
            name: 'getElementById',
            category: 'DOM操作',
            enabled: false,
            handler: function() {
                let getElementByIdCache = document.getElementById;
                document.getElementById = function(id) {
                    console.info("Hook getElementById id => ", id);
                    return getElementByIdCache.apply(this, arguments);
                };
            }
        },
        setAttribute: {
            name: 'setAttribute',
            category: 'DOM操作',
            enabled: false,
            handler: function() {
                let setAttributeCache = window.Element.prototype.setAttribute;
                window.Element.prototype.setAttribute = function(name, value) {
                    console.info("Hook setAttribute name => %s, value => %s", name, value);
                    return setAttributeCache.apply(this, arguments);
                };
            }
        },

        // 网络请求相关
        websocket: {
            name: 'WebSocket',
            category: '网络请求',
            enabled: false,
            handler: function() {
                let sendCache = WebSocket.prototype.send;
                WebSocket.prototype.send = function(data) {
                    console.info("Hook WebSocket send => ", data);
                    return sendCache.apply(this, arguments);
                };
            }
        },
        xhr: {
            name: 'XMLHttpRequest',
            category: '网络请求',
            enabled: false,
            handler: function() {
                let openCache = window.XMLHttpRequest.prototype.open;
                window.XMLHttpRequest.prototype.open = function(method, url) {
                    console.log("Hook xhr method => %s, url => %s", method, url);
                    return openCache.apply(this, arguments);
                };
            }
        },
        requestHeader: {
            name: 'Request Header',
            category: '网络请求',
            enabled: false,
            handler: function() {
                let headerCache = window.XMLHttpRequest.prototype.setRequestHeader;
                window.XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
                    console.log("Hook set header %s => %s", key, value);
                    const detectValue = GM_getValue('headerDetectValue', '');
                    if (detectValue && (key === detectValue || value.indexOf(detectValue) !== -1)) {
                        console.log("检测到目标Header值：", detectValue);
                        debugger;
                    }
                    return headerCache.apply(this, arguments);
                };
            }
        },
        fetch: {
            name: 'Fetch',
            category: '网络请求',
            enabled: false,
            handler: function() {
                let fetchCache = window.fetch;
                window.fetch = function(url) {
                    console.log("Hook fetch url => ", url);
                    return fetchCache.apply(this, arguments);
                };
            }
        },
        cookie: {
            name: 'Cookie',
            category: '网络请求',
            enabled: false,
            handler: function() {
                let cookieCache = "";
                Object.defineProperty(document, "cookie", {
                    set: function(val) {
                        console.log("Hook set cookie => ", val);
                        const detectValue = GM_getValue('cookieDetectValue', '');
                        if (detectValue && val.indexOf(detectValue) !== -1) {
                            console.log("检测到目标Cookie值：", detectValue);
                            debugger;
                        }
                        cookieCache = val;
                        return val;
                    },
                    get: function() {
                        return cookieCache;
                    }
                });
            }
        },

        // JSON相关
        jsonStringify: {
            name: 'JSON.stringify',
            category: 'JSON操作',
            enabled: false,
            handler: function() {
                let stringifyCache = JSON.stringify;
                JSON.stringify = function(params) {
                    console.log("Hook JSON.stringify => ", params);
                    return stringifyCache.apply(this, arguments);
                };
            }
        },
        jsonParse: {
            name: 'JSON.parse',
            category: 'JSON操作',
            enabled: false,
            handler: function() {
                let parseCache = JSON.parse;
                JSON.parse = function(params) {
                    console.log("Hook JSON.parse => ", params);
                    return parseCache.apply(this, arguments);
                };
            }
        },

        // 定时器相关
        setTimeout: {
            name: 'setTimeout',
            category: '定时器',
            enabled: false,
            handler: function() {
                let setTimeoutCache = setTimeout;
                window.setTimeout = function(func, delay) {
                    console.log("Hook setTimeout func => %s, delay => %s", func, delay);
                    return setTimeoutCache.apply(this, arguments);
                };
            }
        },
        setInterval: {
            name: 'setInterval',
            category: '定时器',
            enabled: false,
            handler: function() {
                let setIntervalCache = setInterval;
                window.setInterval = function(func, delay) {
                    console.log("Hook setInterval func => %s, delay => %s", func, delay);
                    return setIntervalCache.apply(this, arguments);
                };
            }
        },
        clearAllIntervals: {
            name: '清除所有定时器',
            category: '定时器',
            enabled: false,
            handler: function() {
                for (let i = 1; i < 99999; i++) {
                    window.clearInterval(i);
                    window.clearTimeout(i);
                }
            }
        },

        // 调试相关
        eval: {
            name: 'eval',
            category: '调试工具',
            enabled: false,
            handler: function() {
                let evalCache = window.eval;
                window.eval = function(string) {
                    console.log("Hook eval =>", string);
                    if (string.includes("debugger")) {
                        console.log("Hook eval debugger!");
                        string = string.replace(/debugger\s*;?/g, "");
                    }
                    return evalCache.apply(this, arguments);
                };
                window.eval.toString = function() {
                    return evalCache.toString();
                };
            }
        },
        Function: {
            name: 'Function构造器',
            category: '调试工具',
            enabled: false,
            handler: function() {
                let FunctionCache = window.Function;
                window.Function = function() {
                    let src = arguments[arguments.length - 1];
                    console.log("Hook Function => ", src);
                    return FunctionCache.apply(this, arguments);
                };
                window.Function.toString = function() {
                    return FunctionCache.toString();
                };
            }
        },
        antiDebugger: {
            name: '阻止无限debugger',
            category: '调试工具',
            enabled: false,
            handler: function() {
                // 方法一：constructor
                let constructorCache = Function.prototype.constructor;
                Function.prototype.constructor = function(string) {
                    if (string === "debugger") {
                        console.log("Hook constructor debugger!");
                        return function() {};
                    }
                    return constructorCache.apply(this, arguments);
                };

                // 方法二：setInterval
                let setIntervalCache = window.setInterval;
                window.setInterval = function(func, delay) {
                    if (func.toString().indexOf("debugger") !== -1) {
                        console.log("Hook setInterval debugger!");
                        return function() {};
                    }
                    return setIntervalCache.apply(this, arguments);
                };

                // 方法三：setTimeout
                let setTimeoutCache = window.setTimeout;
                window.setTimeout = function(func, delay) {
                    if (func.toString().indexOf("debugger") !== -1) {
                        console.log("Hook setTimeout debugger!");
                        return function() {};
                    }
                    return setTimeoutCache.apply(this, arguments);
                };
            }
        },
        consoleLog: {
            name: 'Console.log',
            category: '调试工具',
            enabled: false,
            handler: function() {
                let consoleCache = console.log;
                console.log = function(msg) {
                    consoleCache("Hook console.log =>", msg);
                    if(msg === "spiderapi.cn") {
                        debugger;
                    }
                    consoleCache.apply(this, arguments);
                };
            }
        },

        // 环境相关
        fixedRandom: {
            name: '固定随机值',
            category: '环境模拟',
            enabled: false,
            handler: function() {
                // 固定时间相关
                const FIXED_TIME = 1661986251253;
                const FIXED_TIME_STR = new Date(FIXED_TIME).toString();

                // Hook Date对象
                Date.now = function() { return FIXED_TIME; };
                Date.parse = function() { return FIXED_TIME; };
                Date.prototype.valueOf = function() { return FIXED_TIME; };
                Date.prototype.getTime = function() { return FIXED_TIME; };
                Date.prototype.toString = function() { return FIXED_TIME_STR; };

                // Hook Performance
                if (typeof Performance !== 'undefined') {
                    Performance.prototype.now = function() { return FIXED_TIME; };
                }
                if (typeof performance !== 'undefined') {
                    performance.now = function() { return FIXED_TIME; };
                    performance.timeOrigin = FIXED_TIME;
                }

                // Hook Math.random
                const FIXED_RANDOM = 0.08636862211354912;
                Math.random = function() { return FIXED_RANDOM; };

                // Hook crypto.getRandomValues
                if (typeof crypto !== 'undefined') {
                    const originalGetRandomValues = crypto.getRandomValues;
                    crypto.getRandomValues = function(array) {
                        console.log('Hook crypto.getRandomValues');
                        if (array instanceof Uint8Array) {
                            for (let i = 0; i < array.length; i++) {
                                array[i] = Math.floor(FIXED_RANDOM * 256);
                            }
                        }
                        return array;
                    };
                }

                // Hook 其他时间方法
                const dateProto = Date.prototype;
                const timeMethods = [
                    'getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds',
                    'getMinutes', 'getMonth', 'getSeconds', 'getYear',
                    'getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours',
                    'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds'
                ];

                const fixedDate = new Date(FIXED_TIME);
                timeMethods.forEach(method => {
                    dateProto[method] = function() {
                        return fixedDate[method]();
                    };
                });

                console.log('已固定随机值和时间相关函数');
            }
        },
        fixedScreen: {
            name: '固定屏幕尺寸',
            category: '环境模拟',
            enabled: false,
            handler: function() {
                const height = 660;
                const width = 1366;
                Object.defineProperty(window, "innerHeight", {
                    get: function() { return height; },
                    set: function() {}
                });
                Object.defineProperty(window, "innerWidth", {
                    get: function() { return width; },
                    set: function() {}
                });
            }
        },

        // Canvas相关
        canvas: {
            name: 'Canvas操作',
            category: '指纹检测',
            enabled: false,
            handler: function() {
                // Hook toDataURL
                let toDataURLCache = HTMLCanvasElement.prototype.toDataURL;
                HTMLCanvasElement.prototype.toDataURL = function() {
                    console.log("Hook Canvas.toDataURL");
                    return toDataURLCache.apply(this, arguments);
                };

                // Hook getContext
                let getContextCache = HTMLCanvasElement.prototype.getContext;
                HTMLCanvasElement.prototype.getContext = function() {
                    console.log("Hook Canvas.getContext =>", arguments[0]);
                    let context = getContextCache.apply(this, arguments);

                    if (context && arguments[0] === '2d') {
                        // Hook fillText
                        let fillTextCache = context.fillText;
                        context.fillText = function() {
                            console.log("Hook Canvas.fillText =>", arguments[0]);
                            return fillTextCache.apply(this, arguments);
                        };

                        // Hook font
                        let fontDescriptor = Object.getOwnPropertyDescriptor(context.__proto__, 'font');
                        Object.defineProperty(context, 'font', {
                            get: function() {
                                console.log("Hook Canvas get font");
                                return fontDescriptor.get.call(this);
                            },
                            set: function(value) {
                                console.log("Hook Canvas set font =>", value);
                                return fontDescriptor.set.call(this, value);
                            }
                        });
                    }

                    return context;
                };
            }
        },

        // 其他工具
        regExp: {
            name: 'RegExp构造器',
            category: '其他工具',
            enabled: false,
            handler: function() {
                let RegExpCache = RegExp;
                window.RegExp = function(pattern, flags) {
                    console.log("Hook RegExp pattern => %s, flags => %s", pattern, flags);
                    return RegExpCache.apply(this, arguments);
                };
            }
        },
        stringSplit: {
            name: 'String.split',
            category: '其他工具',
            enabled: false,
            handler: function() {
                let splitCache = String.prototype.split;
                String.prototype.split = function(separator, limit) {
                    console.log("Hook String.prototype.split separator => %s, limit => %s", separator, limit);
                    return splitCache.apply(this, arguments);
                };
            }
        },
        preventUnload: {
            name: '阻止页面跳转',
            category: '其他工具',
            enabled: false,
            handler: function() {
                window.onbeforeunload = function() {
                    console.log("Hook window.onbeforeunload.");
                    return false;
                };
            }
        },
        consoleProtect: {
            name: '保护Console',
            category: '其他工具',
            enabled: false,
            handler: function() {
                // 保存原始console方法
                const originalConsole = {
                    log: console.log,
                    info: console.info,
                    warn: console.warn,
                    error: console.error,
                    debug: console.debug
                };

                // 防止清空控制台
                Object.defineProperty(console, 'clear', {
                    value: function() {
                        originalConsole.log('已阻止清空控制台');
                    }
                });

                // 防止覆盖console方法
                ['log', 'info', 'warn', 'error', 'debug'].forEach(method => {
                    Object.defineProperty(console, method, {
                        get: function() {
                            return originalConsole[method];
                        },
                        set: function() {
                            originalConsole.warn(`已阻止修改console.${method}`);
                            return originalConsole[method];
                        }
                    });
                });
            }
        }
    };

    // 创建控制面板
    function createControlPanel() {
        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'hook-toggle-panel';
        toggleBtn.textContent = '显示Hook工具';
        document.body.appendChild(toggleBtn);

        // 添加拖动功能
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        toggleBtn.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - toggleBtn.getBoundingClientRect().left;
            offsetY = e.clientY - toggleBtn.getBoundingClientRect().top;
            toggleBtn.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                toggleBtn.style.left = `${e.clientX - offsetX}px`;
                toggleBtn.style.top = `${e.clientY - offsetY}px`;
                toggleBtn.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                toggleBtn.classList.remove('dragging');
            }
        });

        // 创建控制面板
        const panel = document.createElement('div');
        panel.id = 'hook-control-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <h3>Hook工具控制面板</h3>
            <div id="hook-controls"></div>
        `;
        document.body.appendChild(panel);

        // 切换按钮点击事件
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '隐藏Hook工具' : '显示Hook工具';
        });

        return panel;
    }

    // 初始化Hook状态
    function initHookStates() {
        Object.keys(hookFeatures).forEach(key => {
            const savedState = GM_getValue(key);
            if (savedState !== undefined) {
                hookFeatures[key].enabled = savedState;
                if (savedState) {
                    hookFeatures[key].handler();
                }
            }
        });
    }

    // 创建控制项
    function createControls(panel) {
        const controlsContainer = panel.querySelector('#hook-controls');

        // 按类别分组功能
        const categories = {};
        Object.entries(hookFeatures).forEach(([key, feature]) => {
            if (!categories[feature.category]) {
                categories[feature.category] = [];
            }
            categories[feature.category].push({ key, ...feature });
        });

        // 为每个类别创建控制组
        Object.entries(categories).forEach(([category, features]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'hook-category';

            // 创建类别标题和全选按钮
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'hook-category-title';
            categoryHeader.innerHTML = `
                <span>${category}</span>
                <span class="hook-category-toggle" data-category="${category}">全选</span>
            `;

            // 创建功能列表
            const featuresList = document.createElement('div');
            features.forEach(feature => {
                const controlItem = document.createElement('div');
                controlItem.className = 'hook-control-item';
                
                // 为Cookie和Request Header功能添加检测值输入框
                if (feature.key === 'cookie' || feature.key === 'requestHeader') {
                    const storageKey = feature.key === 'cookie' ? 'cookieDetectValue' : 'headerDetectValue';
                    const placeholder = feature.key === 'cookie' ? '输入需要检测的Cookie值' : '输入需要检测的Header值';
                    
                    controlItem.innerHTML = `
                        <input type="checkbox" id="hook-${feature.key}"
                               data-category="${category}"
                               ${feature.enabled ? 'checked' : ''}>
                        <label for="hook-${feature.key}">${feature.name}</label>
                        <input type="text" id="${feature.key}-detect-value"
                               placeholder="${placeholder}"
                               style="margin-left: 10px; padding: 2px 5px; border: 1px solid #ccc; border-radius: 3px;"
                               value="${GM_getValue(storageKey, '')}">
                    `;
                    
                    // 添加检测值输入框的change事件
                    setTimeout(() => {
                        const detectInput = controlItem.querySelector(`#${feature.key}-detect-value`);
                        detectInput.addEventListener('change', (e) => {
                            GM_setValue(storageKey, e.target.value);
                        });
                    }, 0);
                } else {
                    controlItem.innerHTML = `
                        <input type="checkbox" id="hook-${feature.key}"
                               data-category="${category}"
                               ${feature.enabled ? 'checked' : ''}>
                        <label for="hook-${feature.key}">${feature.name}</label>
                    `;
                }

                const checkbox = controlItem.querySelector(`#hook-${feature.key}`);
                checkbox.addEventListener('change', (e) => {
                    feature.enabled = e.target.checked;
                    GM_setValue(feature.key, feature.enabled);
                    if (feature.enabled) {
                        feature.handler();
                    } else {
                        // 刷新页面以禁用hook
                        location.reload();
                    }
                    updateCategoryToggle(category);
                });

                featuresList.appendChild(controlItem);
            });

            // 添加全选/取消全选功能
            const toggleBtn = categoryHeader.querySelector('.hook-category-toggle');
            toggleBtn.addEventListener('click', () => {
                const checkboxes = featuresList.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);

                checkboxes.forEach(checkbox => {
                    checkbox.checked = !allChecked;
                    checkbox.dispatchEvent(new Event('change'));
                });
            });

            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(featuresList);
            controlsContainer.appendChild(categoryDiv);
        });

        // 更新类别全选按钮状态
        function updateCategoryToggle(category) {
            const categoryCheckboxes = controlsContainer.querySelectorAll(`input[type="checkbox"][data-category="${category}"]`);
            const toggleBtn = controlsContainer.querySelector(`.hook-category-toggle[data-category="${category}"]`);
            const allChecked = Array.from(categoryCheckboxes).every(cb => cb.checked);
            const anyChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);

            toggleBtn.textContent = allChecked ? '取消全选' : '全选';
            toggleBtn.style.opacity = anyChecked ? '1' : '0.7';
        }

        // 初始化所有类别的全选按钮状态
        Object.keys(categories).forEach(category => {
            updateCategoryToggle(category);
        });
    }

    // 导出配置
    function exportConfig() {
        const config = {};
        Object.keys(hookFeatures).forEach(key => {
            config[key] = GM_getValue(key) || false;
        });
        const configStr = JSON.stringify(config, null, 2);
        GM_setClipboard(configStr);
        GM_notification({
            text: '配置已复制到剪贴板',
            title: 'Hook工具集',
            timeout: 2000
        });
    }

    // 导入配置
    function importConfig() {
        try {
            const configStr = prompt('请粘贴配置JSON:');
            if (!configStr) return;

            const config = JSON.parse(configStr);
            Object.keys(config).forEach(key => {
                if (hookFeatures[key]) {
                    GM_setValue(key, config[key]);
                }
            });

            GM_notification({
                text: '配置导入成功，即将刷新页面',
                title: 'Hook工具集',
                timeout: 2000
            });

            setTimeout(() => location.reload(), 2000);
        } catch (e) {
            GM_notification({
                text: '配置导入失败：' + e.message,
                title: 'Hook工具集',
                timeout: 3000
            });
        }
    }

    // 重置所有设置
    function resetAllSettings() {
        if (!confirm('确定要重置所有设置吗？这将关闭所有Hook功能。')) return;

        Object.keys(hookFeatures).forEach(key => {
            GM_setValue(key, false);
        });

        GM_notification({
            text: '所有设置已重置，即将刷新页面',
            title: 'Hook工具集',
            timeout: 2000
        });

        setTimeout(() => location.reload(), 2000);
    }

    // 快速开启所有功能
    function enableAllFeatures() {
        if (!confirm('确定要开启所有Hook功能吗？这可能会影响页面性能。')) return;

        Object.keys(hookFeatures).forEach(key => {
            GM_setValue(key, true);
        });

        GM_notification({
            text: '已开启所有功能，即将刷新页面',
            title: 'Hook工具集',
            timeout: 2000
        });

        setTimeout(() => location.reload(), 2000);
    }

    // 快速关闭所有功能
    function disableAllFeatures() {
        if (!confirm('确定要关闭所有Hook功能吗？')) return;

        Object.keys(hookFeatures).forEach(key => {
            GM_setValue(key, false);
        });

        GM_notification({
            text: '已关闭所有功能，即将刷新页面',
            title: 'Hook工具集',
            timeout: 2000
        });

        setTimeout(() => location.reload(), 2000);
    }

    // 注册菜单命令
    GM_registerMenuCommand('� 导入配置', importConfig);
    GM_registerMenuCommand('� 导出配置', exportConfig);
    GM_registerMenuCommand('✨ 开启所有功能', enableAllFeatures);
    GM_registerMenuCommand('🚫 关闭所有功能', disableAllFeatures);
    GM_registerMenuCommand('🗑️ 重置所有设置', resetAllSettings);

    // 在页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const panel = createControlPanel();
            initHookStates();
            createControls(panel);
        });
    } else {
        const panel = createControlPanel();
        initHookStates();
        createControls(panel);
    }
})();