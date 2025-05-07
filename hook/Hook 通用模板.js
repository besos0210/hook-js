(function () {
    let oldFunc = func;
    func = function (arguments) {
        console.log(arguments);
        return oldFunc.apply(arguments);
    };
})();
