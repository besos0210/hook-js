(function () {
    let FunctionCache = window.Function;
    let newFunction = function () {
        let src = arguments[arguments.length - 1];
        console.log("Hook Function => ", src);
        debugger;
        return FunctionCache.apply(this, arguments);
    };
    newFunction.toString = function () {
        return FunctionCache.toString();
    };
})();
