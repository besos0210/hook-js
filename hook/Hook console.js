(function () {
    let consoleCache = console.log;
    console.log = function (msg) {
        consoleCache("Hook console.log =>", msg);
        if(msg === "spiderapi.cn") {
            debugger;
        }
        consoleCache(msg);
    };
})();
