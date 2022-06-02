
import { init, Payload } from './api'

const onmessage = (message: Payload) => {
    console.log('got message', message);
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        topic: 'bigw', 
        allowedOrigins: ['http://localhost:8081'],
        onmessage
     });

});
