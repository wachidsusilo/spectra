
import { w3cwebsocket as WebSocket } from 'websocket';
import { setDeviceList } from './../variables/device';
import { setSpectra } from './../variables/spectra';

const url = 'wss://spectra-physics.herokuapp.com';
let soc;

const initialize = () => {
    soc = new WebSocket(url);

    soc.onopen = () => {
        Socket.lastState = true;
        if (Socket.onConnectionChanged) Socket.onConnectionChanged();
        soc.send(JSON.stringify({ type: 'sub' }));
        soc.send(JSON.stringify({ type: 'device' }));
    }

    soc.onmessage = (e) => {
        const payload = JSON.parse(e.data);
        if (typeof payload !== 'object' || !payload.hasOwnProperty('type')) return;

        if (payload.type === 'granted' || payload.type === 'rejected') {
            if (Socket.auth.resolve) Socket.auth.resolve(payload.type);
            Socket.auth.resolve = undefined;
            Socket.auth.reject = undefined;
        }

        if (payload.type === 'device') {
            const dev = [];
            for (let i = 0; i < payload.data.length; i++) {
                const obj = {
                    id: payload.data[i].id,
                    title: payload.data[i].name,
                    secured: payload.data[i].secured,
                    busy: payload.data[i].busy,
                    iconIndex: 0,
                    tooltip: true
                }
                dev.push(obj);
            }
            setDeviceList(dev);
            if (Socket.onDeviceListUpdated) Socket.onDeviceListUpdated();
            if (Socket.onDeviceStatusUpdated) Socket.onDeviceStatusUpdated();
        }

        if(payload.type === 'progress') {
            if(Socket.onProress) Socket.onProress(payload.data);
        }

        if (payload.type === 'data') {
            setSpectra(payload.data);
            if(Socket.onDataReceived) Socket.onDataReceived();
        }
    }

    soc.onclose = () => {
        Socket.lastState = false;
        if (Socket.onConnectionChanged) Socket.onConnectionChanged();
        initialize();
    }

    soc.onerror = (e) => {
        if (Socket.lastState !== Socket.isOpen()) {
            Socket.lastState = Socket.isOpen();
            if (Socket.onConnectionChanged) Socket.onConnectionChanged();
        }
        if (!Socket.isOpen()) setTimeout(() => initialize(), 5000);
        if (Socket.auth.reject) {
            Socket.auth.reject('connection error');
            Socket.auth.resolve = undefined;
            Socket.auth.reject = undefined;
        }
    }
    Socket.ready = true;
}

const authorize = (id, password) => {
    Socket.auth.password = password;
    const promise = new Promise((resolve, reject) => {
        Socket.auth.resolve = resolve;
        Socket.auth.reject = reject;
    })
    const auth = {
        type: 'select',
        data: {
            id: id,
            password: password
        }
    }
    soc.send(JSON.stringify(auth));
    return promise;
}

const run = (id) => {
    const auth = {
        type: 'run',
        data: {
            id: id,
            password: Socket.auth.password
        }
    }
    soc.send(JSON.stringify(auth));
}

const isOpen = () => {
    if (soc) {
        return soc.readyState === soc.OPEN
    }
    return false;
}

const Socket = {
    isOpen: isOpen,
    lastState: false,
    ready: false,
    onDeviceListUpdated: undefined,
    onDataReceived: undefined,
    onConnectionChanged: undefined,
    onDeviceStatusUpdated: undefined,
    onProress: undefined,
    auth: {
        password: '',
        resolve: undefined,
        reject: undefined,
        authorize: authorize
    },
    device: {
        onUpdate: undefined,
        run: run
    },
    initialize: initialize
}

export default Socket;