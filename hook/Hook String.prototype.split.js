(function () {
    String.prototype.splitCache = String.prototype.split;
    String.prototype.split = function (separator, limit) {
        console.log("Hook String.prototype.split separator => %s, limit => %s", separator, limit);
        let str = this.toString();
        if(str.includes("spiderapi.cn")) {
            debugger;
        }
        return str.splitCache(separator, limit)
    };
})();
