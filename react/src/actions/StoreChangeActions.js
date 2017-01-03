
import Dispatcher from '../dispatcher/Dispatcher';
import ActionTypes from './ActionTypes';

const Actions = {
    jobStatusStoreChanged() {
        Dispatcher.dispatchEvent(
            new CustomEvent(ActionTypes.JOB_STATUS_STORE_CHANGE)
        );
    },
};

export default Actions;