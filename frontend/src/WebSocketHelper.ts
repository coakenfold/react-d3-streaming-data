// TODO: RECONNECT LOGIC
export interface WebsocketHelperConstructorInterface {
  url: string;
  onOpen: (event: any) => void;
  onMessage: (event: any) => void;
  onClose: (event: any) => void;
  onError: (error: any) => void;
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
    this._socket.onopen = onOpen;
    this._socket.onmessage = onMessage;
    this._socket.onclose = onClose;
    this._socket.onerror = onError;
  }
};
