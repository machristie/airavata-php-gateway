
import Actions from '../actions/StoreChangeActions';
import ActionTypes from '../actions/ActionTypes';
import Dispatcher from '../dispatcher/Dispatcher';

import $ from 'jquery';

// TODO: add an addListener method for store changes
class MachineNamesStore {

    constructor() {
        Dispatcher.addEventListener(ActionTypes.MACHINE_NAMES_STORE_INIT, (e) => {
            this.init(e.detail.machines);
        });
        // TODO: load this from the server
        this._machineNames = {
            "bigred2": "Big Red II",
            "karst": "Karst",
        };
    }

    init(machines) {
        this._machines = machines;
        this.dispatchStateChangeEvent();
    }

    getState() {
        var state = {};
        this._machines.forEach(machine => {
            state[machine] = this._machineNames[machine];
        });
        return state;
    }

    setState(newState) {
        this._state = Object.assign(this._state, newState);
    }

    dispatchStateChangeEvent() {
        // TODO: include the old and the new state as event properties
        Actions.machineNamesStoreChanged();
    }
}

export default new MachineNamesStore();