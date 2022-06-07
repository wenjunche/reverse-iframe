
import { Payload } from './api';

const getParentOrigin = () => {
    return !!document.referrer ? document.referrer : location.ancestorOrigins[0];
}

const initFrame = (channleName: string) => {

    const bc = new BroadcastChannel(channleName);

    bc.onmessage = (event: MessageEvent<Payload>) => {
        if (event.data.channel === channleName) {
            console.log('BroadcastChannel got', event.data);
            window.parent.postMessage(event.data, getParentOrigin());
        }
    }

    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        const referrer = new URL(getParentOrigin());
        if (event.origin === referrer.origin) {
            if (event.data.channel === channleName) {
                const msg = { ...event.data, origin: event.origin };
                console.log('BroadcastChannel forwarding', msg);
                bc.postMessage(msg);
            }
        } else {
            console.warn('apiframe ignoring message from', event.origin);
        }
    });
}

window.addEventListener("DOMContentLoaded",  async () => {
    const queries = new URLSearchParams(window.location.search);
    const channel = queries.get('channel');
    if (channel) {
        initFrame(channel);
    } else {
        console.error('missing topc query parameter for api iframe');
    }
});