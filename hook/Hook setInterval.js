(function () {
    let setIntervalCache = setInterval;
    setInterval = function (func, delay) {
        console.log("Hook setInterval func => %s, delay => %s", func, delay);
        debugger;
        return setIntervalCache(func, delay);
    };
})();
