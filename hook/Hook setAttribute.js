(function () {
    let setAttributeCache = window.Element.prototype.setAttribute;
    window.Element.prototype.setAttribute = function (name, value) {
        console.info("Hook setAttribute name => %s, value => %s", name, value);
        if (name === "spiderapi") {
            debugger;
        }
        return setAttributeCache(name, value);
    };
})();
