import React from 'react';

function JobStatusView(props) {
    if (!props.jobStatus || props.jobStatus.loading) {
        return <h1>Loading job statuses...</h1>;
    } else {
        return <h1>{props.jobStatus.totalCount}</h1>;
    }
}

export default JobStatusView;