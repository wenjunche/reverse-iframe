import { ChannelEvent } from './api'

const portMap = new Map<string, MessagePort[]>();

const processControlMessage = (m: ChannelEvent, port: MessagePort) => {
    switch (m.action) {
        case 'JOIN': 
            addPort(m.channel, port);
            break;
        case 'LEAVE': 
            removePort(m.channel, port);
            break;
    }
    const ports = portMap.get(m.channel);
    if (ports) {
        ports.forEach(elm => elm.postMessage(m));
    }
}

const addPort = (channel: string, port: MessagePort) => {
    let ports = portMap.get(channel);
    if (!ports) {
        ports = [];
        portMap.set(channel, ports);
    }
    ports.push(port);
}

const removePort = (channel: string, port: MessagePort) => {
    let ports = portMap.get(channel);
    if (ports) {
        portMap.set(channel, ports.filter(elm => elm !== port));
    }
}

addEventListener('connect', (ev) => {
    console.log('sharedWorker connected', ev);
    const [port] = ev.ports;
    port.addEventListener('message', (evm: MessageEvent<ChannelEvent>) => {
        processControlMessage(evm.data, port);
    });
    port.addEventListener('messageerror', err => {
        console.log('messageerror', err);
    });
    port.start();
});