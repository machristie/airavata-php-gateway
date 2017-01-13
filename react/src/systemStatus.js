
import StoreInitActions from './actions/StoreInitActions';
import SystemStatusContainer from './containers/SystemStatusContainer';
import React from 'react';
import ReactDOM from 'react-dom';

function init(machines) {
    
    StoreInitActions.jobStatusStoreInit(machines);
    StoreInitActions.machineNamesStoreInit(machines);
}

function render(domNode) {
    ReactDOM.render(React.createElement(SystemStatusContainer), domNode);
}
export {
    render,
    init
};