import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initializeProfile } from './variables/profile';
import Socket from './socket/socket';

initializeProfile();
Socket.initialize();

ReactDOM.render(<App />, document.getElementById('root'));