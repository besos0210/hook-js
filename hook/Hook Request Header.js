(function () {
    let headerCache = window.XMLHttpRequest.prototype.setRequestHeader;
    window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
        console.log("Hook set header %s => %s", key, value);
        if (key === "spiderapi.cn") {
            debugger;
        }
        return headerCache.apply(this, arguments);
    };
})();
