// TODO: RECONNECT LOGIC
export interface WebsocketHelperConstructorInterface {
  url: string;
  onOpen?: (event: any) => void;
  onMessage?: (event: any) => void;
  onClose?: (event: any) => void;
  onError?: (error: any) => void;
}
export const WebSocketHelper = class {
  _socket;
  constructor({
    onOpen,
    onMessage,
    onClose,
    onError,
    url,
  }: WebsocketHelperConstructorInterface) {
    this._socket = new WebSocket(url);

    const _onError = (error: any) => {
      console.log(`[error] ${error.message}`);
    };
    const _onOpen = (event: any) => {
      console.log("[open] Connection established");
    };

    const _onMessage = (event: any) => {
      console.log(`[message] Data received from server: ${event.data}`);
    };

    const _onClose = (event: any) => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died");
      }
    };
    this._socket.onopen = onOpen || _onOpen;
    this._socket.onmessage = onMessage || _onMessage;
    this._socket.onclose = onClose || _onClose;
    this._socket.onerror = onError || _onError;
  }
  get socket() {
    return this._socket;
  }
};
