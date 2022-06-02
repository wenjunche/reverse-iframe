
import { init, Payload } from './api'

const onmessage = (message: Payload) => {
    console.log('got data', message.data, ' from ', message.origin);
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        topic: 'iFrameRules',   // topic or channel name
        allowedOrigins: ['http://localhost:8081', 'https://openfin.co', 'https://www.openfin.co', 'https://example.com'],  // allowed to send messages
        onmessage  // onmessage call back
     });

});
