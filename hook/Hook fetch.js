(function () {
    let fetchCache = Object.getOwnPropertyDescriptor(window, "fetch");
    Object.defineProperty(window, "fetch", {
        value: function (url) {
            console.log("Hook fetch url => ", url);
            debugger;
            return fetchCache.value.apply(this, arguments);
        }
    });
})();