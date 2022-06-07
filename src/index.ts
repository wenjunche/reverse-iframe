
import { init, Payload } from './api'

const onmessage = (message: Payload) => {
    console.log('got data', message.data, ' from ', message.origin);
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        uuid: crypto.randomUUID(),
        channel: 'iFrameRules',   //  channel name
        allowedOrigins: ['http://localhost:8081', 'https://openfin.co', 'https://www.openfin.co', 'https://example.com'],  // allowed to send messages
        onmessage  // onmessage call back
     });

});
