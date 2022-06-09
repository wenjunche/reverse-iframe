
import { ChannelEvent, ApplicationMessage } from './api';

const getParentOrigin = () => {
    return !!document.referrer ? document.referrer : document.location.ancestorOrigins[0];
}

const initFrame = (channleName: string) => {

    const bc = new BroadcastChannel(channleName);

    bc.onmessage = (event: MessageEvent<ApplicationMessage>) => {
        if (event.data.channel === channleName) {
            postToParent(event.data);
        }
    }

    window.addEventListener('message', (event: MessageEvent<ApplicationMessage>) => {
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

const postToParent = (data: any) => {
    window.parent.postMessage(data, getParentOrigin());
}

window.addEventListener("DOMContentLoaded",  async () => {
    const queries = new URLSearchParams(window.location.search);
    const channel = queries.get('channel');
    const uuid = queries.get('uuid');

    const worker: SharedWorker = new SharedWorker(new URL('./sharedWorker.ts', import.meta.url));
    worker.port.addEventListener('message', (event: MessageEvent) => {
        postToParent(event.data );
    });
    worker.port.addEventListener('messageerror', (event: MessageEvent) => {
        console.log('sharedworker error', event);
    });
    worker.port.start();
    worker.port.postMessage({ action: 'JOIN', uuid, channel, origin: getParentOrigin() } as ChannelEvent);

    window.addEventListener('beforeunload', (ev: BeforeUnloadEvent) => {
        worker.port.postMessage({ action: 'LEAVE', uuid, channel, origin: getParentOrigin() } as ChannelEvent);
    });


    if (channel) {
        initFrame(channel);
    } else {
        console.error('missing topc query parameter for api iframe');
    }
});