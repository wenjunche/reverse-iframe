# reverse-iframe
iframe that is reversed

## Code 
~~~
import { init, Payload } from './api'

// message listener
const onmessage = (message: Payload) => {
    console.log('got data', message.data, ' from ', message.origin);
}

// channel event listener, called when a member joins or leaves the channel
const onChannelEvent = (message: ChannelEvent) => {
    console.log('got channel event', message );
}

window.addEventListener("DOMContentLoaded",  async () => {

    init({
        channel: 'iFrameRules',   // channel name
        allowedOrigins: ['http://localhost:8081', 'https://openfin.co', 'https://www.openfin.co', 'https://example.com'],  // allowed to send messages to this app
        onmessage  // onmessage call back,
        onChannelEvent // channel event listener
     });

    // sends a message to all members of the channel
    finfin.send({name: 'OpenFin', location:'NY'});
});
~~~

## Test with OpenFin Runtime

This API does not require Runtime, but the example injects the API with a preload script to any website.

1. npm run build
2. npm run start
3. launch fin://localhost:8081/app.json?app=example.com and fin://localhost:8081/app.json?app=openfin.co
4. open devtools on both apps and run
~~~
finfin.send({ name: 'OpenFin', location: 'NY'})
~~~