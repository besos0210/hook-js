# Hook-JS 工具集

一个强大的JavaScript Hook工具集合，用于前端调试和分析。

## 功能特性

- 🔍 支持多种Hook类型
  - DOM操作
  - 网络请求
  - 浏览器API
  - JavaScript内置函数
- 🎯 可配置的检测值功能
- 🛠 友好的用户界面
- 💾 设置自动保存

## 支持的Hook功能

### 网络请求
- Cookie
- Request Header
- XHR
- Fetch
- WebSocket

### DOM操作
- createElement
- getElementById
- setAttribute

### 数据处理
- JSON.parse
- JSON.stringify
- String.prototype.split

### 定时器
- setTimeout
- setInterval
- 清除定时器

### 其他功能
- Canvas
- Console
- Function
- RegExp
- eval
- onbeforeunload
- 固定浏览器高度和宽度值
- 固定随机变量
- 无限 Debugger

## 安装说明

1. 首先安装一个用户脚本管理器（如Tampermonkey）
2. 点击下面的安装链接：
   [安装Hook-JS工具集](https://raw.githubusercontent.com/besos0210/hook-js/main/hook-tools.user.js)

## 使用方法

1. 安装脚本后，在目标网页上会出现一个悬浮控制面板
2. 在控制面板中选择需要启用的Hook功能
3. 对于Cookie和Request Header功能，可以设置检测值
4. 当检测到匹配的值时，会自动触发debugger

## 注意事项

- 检测值区分大小写
- 部分功能可能需要刷新页面才能生效
- 建议按需开启Hook功能，避免影响页面性能

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个工具集！

## 许可证

Mozilla Public License
