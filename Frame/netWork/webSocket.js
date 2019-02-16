
class CusSocket {
    constructor (url) {
        this._ws = new WebSocket(url)

        this._ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };

        this._ws.onmessage = function (event) {
            console.log("response text msg: " + event.data);
        };

        this._ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        
        this._ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
    }

    static _fctor
    static getInstance () {
        if (! this._fctor) {
            this._fctor = new CusSocket()
        } return this._fctor
    }
}