(function () {
    let sendCache = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        console.info("Hook WebSocket send => ", data);
        return sendCache(data);
    };
})();
