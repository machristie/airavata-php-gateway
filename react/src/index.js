
import React from 'react';
import ReactDOM from 'react-dom';

// This is how to import jQuery if it is provided outside of webpack
// import $ from 'jquery';

function HelloWorld(props) {
    return <h1>Hello, {props.name}</h1>;
}

ReactDOM.render(<HelloWorld name="Marcus" />, document.getElementById('helloworld'));
