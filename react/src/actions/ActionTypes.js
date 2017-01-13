
// TODO: Move the change types to a StoreChangeEventTypes object. Technically they aren't actions
// Maybe also move into the stores package too
const ActionTypes = {
    JOB_STATUS_STORE_CHANGE: 'JOB_STATUS_STORE_CHANGE',
    JOB_STATUS_STORE_INIT: 'JOB_STATUS_STORE_INIT',
    NODE_STATUS_STORE_CHANGE: 'NODE_STATUS_STORE_CHANGE',
    MACHINE_NAMES_STORE_INIT: 'MACHINE_NAMES_STORE_INIT',
    MACHINE_NAMES_STORE_CHANGE: 'MACHINE_NAMES_STORE_CHANGE',
}

export default ActionTypes;