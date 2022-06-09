
import { init, ApplicationMessage, ChannelEvent } from './api'

const onmessage = (message: ApplicationMessage) => {
    console.log('got data', message.data, ' from ', message.origin);
}

const onChannelEvent = (message: ChannelEvent) => {
    console.log('got channel event', message );
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        uuid: crypto.randomUUID(),
        channel: 'iFrameRules',   //  channel name
        allowedOrigins: ['http://localhost:8081', 'https://openfin.co', 'https://www.openfin.co', 'https://example.com'],  // allowed to send messages
        onmessage,  // onmessage call back
        onChannelEvent
     });

});
