import { useEffect, useRef } from "react";
import { Chart } from "./D3/Chart";
import { WebSocketHelper } from "./WebSocketHelper";

const onError = (error: any) => {
  // console.log(`CLIENT:[error] ${error.message}`);
};
const onOpen = (event: any) => {
  // console.log("CLIENT:[open] Connection established");
};

// const onMessage = (event: any) => {
//   console.log(`CLIENT:[message] Data received from server: ${event.data}`);
// };

const onClose = (event: any) => {
  // if (event.wasClean) {
  //   console.log(
  //     `CLIENT:[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
  //   );
  // } else {
  //   // e.g. server process killed or network down
  //   // event.code is usually 1006 in this case
  //   console.log("CLIENT:[close] Connection died");
  // }
};

export const ChartWrapper = () => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const chart = Chart(chartRef.current);
    new WebSocketHelper({
      url: process.env.REACT_APP_URL_WEBSOCKET_SERVER as string,
      onOpen,
      onMessage: (event: any) => {
        const datum = JSON.parse(event.data);
        console.log("have message", [datum]);
        chart.update([datum]);
      },
      onClose,
      onError,
    });
  }, []);
  return <div ref={chartRef} />;
};
