
import { Payload } from './api';

const initFrame = (channleName: string) => {

    const bc = new BroadcastChannel(channleName);

    bc.onmessage = (event: MessageEvent<Payload>) => {
        if (event.data.topic === channleName) {
            console.log(event);
            window.parent.postMessage(event.data);
        }
    }

    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        if (event.data.topic === channleName) {
            console.log(event);
            console.log(event);
            bc.postMessage(event.data);
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