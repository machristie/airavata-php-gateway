
class Dispatcher {

    constructor() {
        this.domNode = window.document;
    }

    addEventListener(type, listener) {
        this.domNode.addEventListener(type, listener);
    }

    removeEventListener(type, listener) {
        this.domNode.removeEventListener(type, listener);
    }

    dispatchEvent(event) {
        this.domNode.dispatchEvent(event);
    }
}

export default new Dispatcher();