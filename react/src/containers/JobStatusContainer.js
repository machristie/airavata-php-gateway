
import ActionTypes from '../actions/ActionTypes';
import Dispatcher from '../dispatcher/Dispatcher';
import JobStatusStore from '../stores/JobStatusStore';
import JobStatusView from '../views/JobStatusView';

import React from 'react';


class JobStatusContainer extends React.Component {

    componentDidMount() {
        Dispatcher.addEventListener(ActionTypes.JOB_STATUS_STORE_CHANGE, () => this.setState(this.getState()));
        this.setState(this.getState());
    }

    componentWillUnmount() {
        Dispatcher.removeEventListener(ActionTypes.JOB_STATUS_STORE_CHANGE, () => this.setState(this.getState()));
    }

    getState() {
        return {
            'jobStatus': JobStatusStore.getState()
        };
    }

    render() {
        return (
            <JobStatusView {...this.state}/>
        );
    }
}

export default JobStatusContainer;