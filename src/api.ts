
export interface Payload {
    topic: string;
    data: any;
}

export interface Fin {
    send: (payload: Payload) => void;
}

declare global {
    interface Window {
        fin: Fin;
    }
  }

const api = (iframe: HTMLIFrameElement, topic: string) => {
    window.addEventListener('message', (event: MessageEvent<Payload>) => {
        if (event.data.topic === topic) {
            console.log(event);
        }
    });

    return {
        send: (payload: Payload) => {
            iframe.contentWindow?.postMessage({ topic: topic, data: payload } );
        }
    }    
}

export const init = (topic: string) => {
    const ifrm = document.createElement("IFRAME") as HTMLIFrameElement;
    ifrm.setAttribute("src", `http://localhost:8081/apiframe.html?topic=${topic}`);
    ifrm.style.width = '0px';
    ifrm.style.height = '0px';
    document.body.appendChild(ifrm);
    window.fin = api(ifrm, topic);
};
