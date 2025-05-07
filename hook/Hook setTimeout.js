(function () {
    let setTimeoutCache = setTimeout;
    setTimeout = function (func, delay) {
        console.log("Hook setTimeout func => %s, delay => %s", func, delay);
        debugger;
        return setTimeoutCache(func, delay);
    };
})();
