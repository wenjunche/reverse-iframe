
import { Payload } from './api';

const initFrame = (channleName: string) => {

    const bc = new BroadcastChannel(channleName);

    bc.onmessage = (event: MessageEvent<Payload>) => {
        if (event.data.topic === channleName) {
            window.parent.postMessage(event.data);
        }
    }

    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        const referrer = new URL(document.referrer);
        if (event.origin === referrer.origin) {
            if (event.data.topic === channleName) {
                bc.postMessage(event.data);
            }
        } else {
            console.warn('ignoring message form', document.referrer);
        }
    });
}

window.addEventListener("DOMContentLoaded",  async () => {
    const queries = new URLSearchParams(window.location.search);
    const topic = queries.get('topic');
    if (topic) {
        initFrame(topic);
    } else {
        console.error('missing topc query parameter for api iframe');
    }
});