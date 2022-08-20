export const websocket = () => {
  let socket = new WebSocket("wss://localhost:8000/");

  socket.onopen = function (e) {
    console.log("CLIENT:[open] Connection established");
    // console.log("CLIENT:Sending to server");
    // socket.send(">this came from the client<");
  };

  socket.onmessage = function (event) {
    console.log(`CLIENT:[message] Data received from server: ${event.data}`);
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `CLIENT:[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log("CLIENT:[close] Connection died");
    }
  };

  socket.onerror = function (error) {
    console.log(`CLIENT:[error] ${error.message}`);
  };
};
