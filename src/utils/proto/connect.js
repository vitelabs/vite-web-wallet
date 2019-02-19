export default class Connect extends WebSocket {
    constructor(...args) {
        super(args);
    }
    onclose(){

    }
    onerror(){

    }
    onmessage(){
        this.dispatchEvent();
    }
    onopen(){

    }
    pfSend(){

    }
}
