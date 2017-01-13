
import Actions from '../actions/StoreChangeActions';
import ActionTypes from '../actions/ActionTypes';
import Dispatcher from '../dispatcher/Dispatcher';

import $ from 'jquery';

// TODO: add an addListener method for store changes
// Store Interface
// - getState()
//   - delegates to StoreState.getState()
// - addListener()
//   - delegates to StoreState.addListener()
class JobStatusStore {

    constructor() {
        this._state = {};
        Dispatcher.addEventListener(ActionTypes.JOB_STATUS_STORE_INIT, (e) => {
            this.init(e.detail.machines);
        });
    }

    init(machines) {
        console.log("JobStatusStore.init", machines);
        this._machines = machines;
        this.loadData();
    }

    getState() {
        return this._state;
    }

    setState(newState) {
        this._state = Object.assign(this._state, newState);
        this.dispatchStateChangeEvent();
    }

    loadData() {

        // this.setState({
        //     loading: true
        // });
        
        var promises = [];
        this._machines.forEach((machine) => {
            promises.push(this.loadJobStatusForMachine(machine));
        });
        // Wait for job statuses to be loaded for all machines
        // $.when.apply(null, promises).then(() => {
        //     this.setState({
        //         loading: false
        //     });
        // });
    }

    loadJobStatusForMachine(machine) {
        
        var newState = {};
        newState[machine] = {
            loading: true
        }
        this.setState(newState);

        // TODO: replace jQuery with native ajax handling
        return $.ajax({
            url: 'mws/jobinfo/' + machine + '/jobstatus',
            dataType: 'json'
        }).done(data => {
            var newState = {};
            newState[machine] = this.createJobStatusSummary(data);
            this.setState(newState);
        }).promise();
    }
    
    createJobStatusSummary(data) {
        var totalJobCount = data.results.length,
            runningJobCount = 0,
            idleJobCount = 0,
            notQueuedJobCount = 0,
            completedJobCount = 0,
            otherJobCount = 0;
        data.results.forEach(function(job) {
            var state = job.states.state;
            if (state == "Running"){
                runningJobCount++;
            } else if (state == "Idle") {
                idleJobCount++;
            } else if (state == "NotQueued") {
                notQueuedJobCount++;
            } else if (state == "Completed") {
                completedJobCount++;
            } else {
                otherJobCount++;
            }
        });
        
        return {
            totalJobCount: totalJobCount,
            runningJobCount: runningJobCount,
            idleJobCount: idleJobCount,
            notQueuedJobCount: notQueuedJobCount,
            completedJobCount: completedJobCount,
            otherJobCount: otherJobCount
        };
    }

    dispatchStateChangeEvent() {
        // TODO: include the old and the new state as event properties
        Actions.jobStatusStoreChanged();
    }
}

export default new JobStatusStore();