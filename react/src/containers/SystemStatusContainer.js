
import ActionTypes from '../actions/ActionTypes';
import Dispatcher from '../dispatcher/Dispatcher';
import JobStatusStore from '../stores/JobStatusStore';
import NodeStatusStore from '../stores/NodeStatusStore';
import MachineNamesStore from '../stores/MachineNamesStore';
import SystemStatusView from '../views/SystemStatusView';

import React from 'react';


class SystemStatusContainer extends React.Component {

    constructor(props) {
        super(props);
        // TODO: factor out the store change listener management
        this.storeChangeEvents = [
            ActionTypes.JOB_STATUS_STORE_CHANGE,
            ActionTypes.NODE_STATUS_STORE_CHANGE,
            ActionTypes.MACHINE_NAMES_STORE_CHANGE,
        ];
        this.storeChangeHandler = function() {
            this.setState(this.getState());
        }.bind(this);
    }

    componentDidMount() {
        this.storeChangeEvents.forEach( type => {
            Dispatcher.addEventListener(type, this.storeChangeHandler);
        });
        this.setState(this.getState());
    }

    componentWillUnmount() {
        this.storeChangeEvents.forEach( type => {
            Dispatcher.removeEventListener(type, this.storeChangeHandler);
        });
    }

    getState() {
        return {
            'jobStatus': JobStatusStore.getState(),
            'nodeStatus': NodeStatusStore.getState(),
            'machineNames': MachineNamesStore.getState(),
        };
    }

    render() {
        return (
            <SystemStatusView {...this.state}/>
        );
    }
}

export default SystemStatusContainer;