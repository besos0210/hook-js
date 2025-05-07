(function () {
    let stringifyCache = JSON.stringify;
    JSON.stringify = function (params) {
        console.log("Hook JSON.stringify => ", params);
        debugger;
        return stringifyCache(params);
    };
})();
