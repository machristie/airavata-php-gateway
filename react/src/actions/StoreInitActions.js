
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from './ActionTypes';

let dispatch = function (type, detail) {
    console.log("dispatch", type, detail);
    Dispatcher.dispatchEvent(new CustomEvent(type, {
        detail: detail
    }));
}

const Actions = {
    jobStatusStoreInit(machines) {
        dispatch(ActionTypes.JOB_STATUS_STORE_INIT, {
            machines: machines
        });
    },
    machineNamesStoreInit(machines) {
        dispatch(ActionTypes.MACHINE_NAMES_STORE_INIT, {
            machines: machines
        });
    },
};

export default Actions;