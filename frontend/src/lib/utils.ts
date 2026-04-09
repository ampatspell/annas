export const mins = (m: number) => 60 * 1000 * m;

export const buildWebsocket = (opts: {
  url: string;
  binaryType?: BinaryType;
  onEvent: (e: MessageEvent<unknown>) => void;
  onError: (ws: WebSocket) => void;
}) => {
  const websocket = new WebSocket(opts.url);
  if (opts.binaryType) {
    websocket.binaryType = opts.binaryType;
  }

  const open = () => {
    console.log("ws: opened");
  };
  const close = (e: Event) => {
    console.log("ws: close", e);
    onError();
  };
  const error = (e: Event) => {
    console.log("ws: error", e);
    onError();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = (e: MessageEvent<any>) => {
    // console.log("ws: message", e.data);
    opts.onEvent(e);
  };
  const onError = async () => {
    websocket.removeEventListener("open", open);
    websocket.removeEventListener("close", close);
    websocket.removeEventListener("error", error);
    websocket.removeEventListener("message", message);
    clearInterval(cancel);
    opts.onError(websocket);
  };
  websocket.addEventListener("open", open);
  websocket.addEventListener("close", close);
  websocket.addEventListener("error", error);
  websocket.addEventListener("message", message);

  const cancel = setInterval(() => {
    if (websocket.readyState == websocket.OPEN) {
      websocket.send("ping");
    }
  }, 3000);

  return websocket;
};
