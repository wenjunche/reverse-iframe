declare const APP_PRELOAD_URL: string;

const APIFrameUrl = `${APP_PRELOAD_URL}/apiframe.html`;

export interface Payload {
    topic: string;
    origin: string;
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
        finfin: Fin;
    }
  }

const api = (iframe: HTMLIFrameElement, config: Config) => {
    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        if (config.allowedOrigins.includes(event.data.origin)) {
            if (event.data.topic === config.topic) {
                config.onmessage( event.data );
            }
        } else {
            console.warn('message not allowed from', event.data.origin);
        }
    });

    return {
        send: (payload: any) => {
            iframe.contentWindow?.postMessage({ topic: config.topic, data: payload }, APIFrameUrl );
        }
    }    
}

export const init = (config: Config) => {
    const ifrm = document.createElement("IFRAME") as HTMLIFrameElement;
    ifrm.setAttribute("src", `${APIFrameUrl}?topic=${config.topic}`);
    ifrm.style.width = '0px';
    ifrm.style.height = '0px';
    document.body.appendChild(ifrm);
    window.finfin = api(ifrm, config);
};
