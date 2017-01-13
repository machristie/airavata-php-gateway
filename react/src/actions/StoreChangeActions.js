
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from './ActionTypes';

// TODO: move this into Dispatcher?
let dispatch = function (type) {
    Dispatcher.dispatchEvent(new CustomEvent(type));
}

// TODO: remove these
const Actions = {
    jobStatusStoreChanged() {
        dispatch(ActionTypes.JOB_STATUS_STORE_CHANGE);
    },
    nodeStatusStoreChanged() {
        dispatch(ActionTypes.NODE_STATUS_STORE_CHANGE);
    },
    machineNamesStoreChanged() {
        dispatch(ActionTypes.MACHINE_NAMES_STORE_CHANGE);
    }
};

export default Actions;