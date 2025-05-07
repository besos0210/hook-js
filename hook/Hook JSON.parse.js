(function () {
    let parseCache = JSON.parse;
    JSON.parse = function (params) {
        console.log("Hook JSON.parse => ", params);
        debugger;
        return parseCache(params);
    };
})();
