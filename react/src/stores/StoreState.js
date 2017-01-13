
class StoreState {

    constructor(stateChangeEventType, initialState = {}) {
        this.stateChangeEventType = stateChangeEventType;
        this.state = initialState;
    }
    
    addListener(listener) {
        
        // TODO: return object with remove() method to remove listener
    }
    
    setState(newState) {
        // TODO: merge in newState and dispatch change event
    }
}