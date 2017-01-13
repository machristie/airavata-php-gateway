
import Actions from '../actions/StoreChangeActions';

import $ from 'jquery';

class JobStatusStore {

    constructor() {
        this._state = null;
        // TODO: add listener for init action
    }

    init(machines) {
        this._machines = machines;
        loadData();
    }

    getState() {
        return this._state;
    }

    setState(newState) {
        this._state = newState;
        this.dispatchStateChangeEvent();
    }

    loadData() {

        this.setState({
            loading: true
        });
        // TODO: replace jQuery with native ajax handling
        $.ajax({
            url: 'mws/jobinfo/bigred2/jobstatus',
            dataType: 'json'
        }).done(data => {
            data.loading = false;
            this.setState(data)
        });
    }

    dispatchStateChangeEvent() {
        // TODO: include the old and the new state as event properties
        Actions.jobStatusStoreChanged();
    }
}

export default new JobStatusStore();