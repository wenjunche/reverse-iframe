
import { init, ApplicationMessage, ChannelEvent } from './api'

const onmessage = (message: ApplicationMessage) => {
    console.log('got message', message);
}

const onChannelEvent = (message: ChannelEvent) => {
    console.log('got channel event', message );
}

window.addEventListener("DOMContentLoaded",  async () => {
    console.log('preload', location.href);
    init({
        uuid: crypto.randomUUID(),
        channel: 'iFrameRules', 
        allowedOrigins: ['http://localhost:8081', 'https://example.com', 'https://openfin.co', 'https://www.openfin.co', 'https://finjs.com/' ],
        onmessage,
        onChannelEvent
     });

});
