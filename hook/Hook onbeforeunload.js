// 提示

// onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。
// Hook 此事件可阻断跳转，使其留在当前页面，通常用来应对网站打开 F12 就跳转页面的情况。




(function () {
    window.onbeforeunload = function () {
        console.log("Hook window.onbeforeunload.");
        debugger;
        return false;
    };
})();
