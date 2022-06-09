declare const APP_PRELOAD_URL: string;

const APIFrameUrl = `${APP_PRELOAD_URL}/apiframe.html`;

export interface ApplicationMessage {
    channel: string;
    origin: string;     // origin of source
    source: string;     // souce UUID
    data: any;
}

export type ChannelAction = 'JOIN' | 'LEAVE';
export interface ChannelEvent {
    action: ChannelAction;
    uuid: string;
    origin: string;     // origin of source
    channel: string;
}

export interface Config {
    uuid: string;           // id of this connection
    channel: string;
    allowedOrigins: string[];
    onmessage: (message: ApplicationMessage) => void;
    onChannelEvent?: (message: ChannelEvent) => void;
}

type Payload = ApplicationMessage | ChannelEvent;

export interface Fin {
    send: (payload: any) => void;
}

declare global {
    interface Window {
        finfin: Fin;
    }
  }

const api = (iframe: HTMLIFrameElement, config: Config) => {
    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        if (Object.hasOwn(event.data, 'action')) {
            if (config.onChannelEvent) {
                config.onChannelEvent(event.data as ChannelEvent);
            }
        } 
        else if (config.allowedOrigins.includes((event.data as ApplicationMessage).origin)) {
            if (event.data.channel === config.channel) {
                config.onmessage( event.data as ApplicationMessage);
            } else {
                console.warn('message not allowed from', event.data);
            }
        }
    });

    return {
        send: (payload: any) => {
            iframe.contentWindow?.postMessage({ channel: config.channel, data: payload, source: config.uuid }, APIFrameUrl );
        }
    }    
}

export const init = (config: Config) => {
    const ifrm = document.createElement("IFRAME") as HTMLIFrameElement;
    ifrm.setAttribute("src", `${APIFrameUrl}?channel=${config.channel}&uuid=${config.uuid}`);
    ifrm.style.width = '0px';
    ifrm.style.height = '0px';
    ifrm.style.display = 'none';
    document.body.appendChild(ifrm);
    window.finfin = api(ifrm, config);
};
