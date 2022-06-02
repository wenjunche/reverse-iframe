
import { init, Payload } from './api'

const onmessage = (message: Payload) => {
    console.log('got message', message);
}

window.addEventListener("DOMContentLoaded",  async () => {
    console.log('preload', location.href);
    init({
        topic: 'iFrameRules', 
        allowedOrigins: ['http://localhost:8081', 'https://example.com', 'https://openfin.co' ],
        onmessage
     });

});
