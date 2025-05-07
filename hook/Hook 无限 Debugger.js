//方法一：constructor
(function () {
    let constructorCache = Function.prototype.constructor;
    Function.prototype.constructor = function (string) {
        if (string === "debugger") {
            console.log("Hook constructor debugger!");
            return function () {};
        }
        return constructorCache(string);
    };
})();


// //方法二：setInterv
// (function () {
//     let setIntervalCache = setInterval;
//     setInterval = function (func, delay) {
//         if (func.toString().indexOf("debugger") !== -1) {
//             console.log("Hook setInterval debugger!");
//             return function () {};
//         }
//         return setIntervalCache(func, delay);
//     };
// })();

// //方法三：setTimeout
// (function () {
//     let setTimeoutCache = setTimeout;
//     setTimeout = function (func, delay) {
//         if (func.toString().indexOf("debugger") !== -1) {
//             console.log("Hook setTimeout debugger!");
//             return function () {};
//         }
//         return setTimeoutCache(func, delay);
//     };
// })();


// //方法四：eval
// (function () {
//     let evalCache = window.eval;
//     window.eval = function (string) {
//         if (string.includes("debugger")) {
//             console.log("Hook eval debugger!");
//         }
//         return evalCache(string.replace(/debugger\s*;?/g, ""));
//     };
//     window.eval.toString = function () {
//         return evalCache.toString();
//     };
// })();
