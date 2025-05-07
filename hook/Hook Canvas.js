(function () {
    let createElementCache = document.createElement;
    document.createElement = function (tagName) {
        console.info("Hook createElement tagName => ", tagName);
        if(tagName === "canvas") {
            debugger;
        }
        return createElementCache(tagName);
    };
})();