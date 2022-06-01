
import { init } from './api'

const onmessage = (message) => {
    console.log('got message', message);
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        topic: 'bigw', 
        allowedOrigins: ['http://localhost:8081'],
        onmessage
     });

});
