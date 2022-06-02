
import { init, Payload } from './api'

const onmessage = (message: Payload) => {
    console.log('got message', message);
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        topic: 'iFrameRules', 
        allowedOrigins: ['http://localhost:8081', 'https://openfin.co', 'https://www.openfin.co', 'https://example.com'],
        onmessage
     });

});
