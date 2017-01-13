
import React from 'react';

function JobStatusView(props) {
    
    var machineStatuses = [];
    for (var machine in props.jobStatus) {
        if (props.jobStatus.hasOwnProperty(machine) && machine !== "loading") {
            var status = props.jobStatus[machine];
            machineStatuses.push(
                <li key={machine}>{machine} - Total: {status.totalJobCount}</li>
            );
        }
    }
    return <ul>{machineStatuses}</ul>;
}

function JobStatusTableCell(props) {
    
    var machine = props.machine;
    if (machine in props.jobStatus && !props.jobStatus[machine].loading) {
        var jobStatus = props.jobStatus[machine];
        return (
            <td>
            Total: {jobStatus.totalJobCount} <br/>
            Running: {jobStatus.runningJobCount} <br/>
            Idle: {jobStatus.idleJobCount} <br/>
            Not Queued: {jobStatus.notQueuedJobCount} <br/>
            Completed: {jobStatus.completedJobCount} <br/>
            Other: {jobStatus.otherJobCount} <br/>
            </td>
        );
    } else {
        return (
            <td>Loading...</td>
        );
    }
}

function MachineRow(props) {
    var machine = props.machine;
    var machineName = props.machineNames[machine];
    
    return (
        <tr>
            <td>{machineName}</td>
            <td>Healthy</td>
            <td>TBD</td>
            <JobStatusTableCell machine={machine} {...props} />
        </tr>
    );
}

function SystemStatusView(props) {
    
    var machineRows = [];
    for (var machine in props.machineNames) {
        if (props.machineNames.hasOwnProperty(machine)){
            machineRows.push(<MachineRow machine={machine} key={machine} {...props} />);
        }
    }
    return (
        <div>
            <h1>System Status</h1>
            <table>
                <thead>
                    <tr>
                        <th>Resource</th>
                        <th>Status</th>
                        <th>Utilization</th>
                        <th>Job</th>
                    </tr>
                </thead>
                <tbody>
                    {machineRows}
                </tbody>
            </table>
        </div>
    );
}

export default SystemStatusView;