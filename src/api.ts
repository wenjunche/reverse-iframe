

export interface Payload {
    topic: string;
    origin?: string;
    data: any;
}

export interface Config {
    topic: string;
    allowedOrigins: string[];
    onmessage: (message: Payload) => void;
}

export interface Fin {
    send: (payload: Payload) => void;
}

declare global {
    interface Window {
        fin: Fin;
    }
  }

const api = (iframe: HTMLIFrameElement, config: Config) => {
    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        if (config.allowedOrigins.includes(event.origin)) {
            if (event.data.topic === config.topic) {
                config.onmessage({ topic: event.data.topic, data: event.data.data, origin: event.origin });
            }
        }
    });

    return {
        send: (payload: Payload) => {
            iframe.contentWindow?.postMessage({ topic: config.topic, data: payload } );
        }
    }    
}

export const init = (config: Config) => {
    const ifrm = document.createElement("IFRAME") as HTMLIFrameElement;
    ifrm.setAttribute("src", `http://localhost:8081/apiframe.html?topic=${config.topic}`);
    ifrm.style.width = '0px';
    ifrm.style.height = '0px';
    document.body.appendChild(ifrm);
    window.fin = api(ifrm, config);
};
