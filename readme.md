# 我的第一个插件

**插件目录说明**

```json
{
  "manifest_version": 3, // 版本，2目前已废弃
  "name": "my-plugin", // 插件名
  "version": "0.1.0", // 插件版本
  "description": "这是一段描述", // 插件的简短描述
  "icons": {
    // 不同大小的图标配置
    "84": "./icons/hello.jpg"
  },
  "action": {
    // 插件工具栏按钮的默认行为（图标、标题、弹出页面等）
    "default_icon": "./icons/hello.jpg", // 插件图标
    "default_title": "我的插件", // 插件名
    "default_popup": "./html/popup.html" // 点击插件图标出现的下拉框
  },
  "background": {
    // 后台server脚本配置，使用 service worker
    "service_worker": "./js/background.js"
  },
  "content_scripts": [
    // 内容脚本
    {
      "matches": ["<all_urls>"], // 指定哪些页面注入
      "js": ["./js/content.js"],// 注入的js
      "css": ["./css/style.css"],// 注入的css
      "run_at": "document_start"// 执行的时机
    },
    {
      "matches": ["https://www.baidu.com/"],
      "js": ["./js/other.js"],
      "run_at": "document_start"
    }
  ]
}
```

content-scripts 和原始页面共享DOM，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过inject-scripts来实现，content-scripts能够访问的Chrome API的权限也比较低，只能访问以下四个API：

chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
chrome.i18n
chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
chrome.storage

## Inject-scripts
inject-scripts 是通过DOM操作插入的JS代码，通常在content-scripts只能操作DOM，但是却无法访问页面的JS，借助content-scripts可以操作DOM的能力，往页面中插入JS文件，给页面提供调用插件API的能力，以及和background通信的能力。
在插入之前，需配置一下web可访问的资源，同时content-scripts的调用时机换成"document_end"或者"document_idle"，不然会无法获取DOM,导致插入失败
