(function () {
    let getElementByIdCache = document.getElementById;
    document.getElementById = function (id) {
        console.info("Hook getElementById id => ", id);
        if (id === "spiderapi") {
            debugger;
        }
        return getElementByIdCache(id);
    };
})();
