(function () {
    let RegExpCache = RegExp;
    RegExp = function (pattern, flags) {
        console.log("Hook RegExp pattern => %s, flags => %s", pattern, flags);
        debugger;
        return RegExpCache(pattern, flags);
    };
})();
