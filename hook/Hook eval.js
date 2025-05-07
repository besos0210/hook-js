(function () {
    let evalCache = window.eval;
    window.eval = function (string) {
        console.log("Hook eval =>", string);
        debugger;
        return evalCache(string);
    };
    window.eval.toString = function () {
        return evalCache.toString();
    };
})();