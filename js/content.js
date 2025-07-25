// js文件的注入会按照manifest的配置顺序执行
console.log("all！！！！！");

// 访问inject.js的方法例子
(function () {
  try {
    const validPaths = ["js/inject.js"]; // 允许加载的合法路径
    const path = "js/inject.js";

    if (!validPaths.includes(path)) {
      console.error("Invalid script path:", path);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");

    // 设置超时处理
    const loadTimeout = setTimeout(() => {
      console.error("Script load timeout:", path);
      cleanup();
    }, 5000);

    const cleanup = () => {
      clearTimeout(loadTimeout);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    script.onload = function () {
      cleanup();
      console.log("Script loaded successfully:", path);
    };

    script.onerror = function () {
      cleanup();
      console.error("Failed to load script:", path);
    };

    script.src = chrome.runtime.getURL(path);
    document.body.appendChild(script);
  } catch (error) {
    console.error("Script injection error:", error);
  }
})();
