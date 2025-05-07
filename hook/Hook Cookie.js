(function () {
    let cookieCache = "";
    Object.defineProperty(document, "cookie", {
        set: function (val) {
            console.log("Hook set cookie => ", val);
            if (val.indexOf("spiderapi.cn") !== -1) {
                debugger;
            }
            cookieCache = val;
            return val;
        },
        get: function () {
            return cookieCache;
        }
    });
})();