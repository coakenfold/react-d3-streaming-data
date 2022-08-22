import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { updateRealtime, replaceLog } from "./sineCoordinates";
import type { RootState } from "../store";
import { Chart } from "../D3/Chart";

export function SineChart() {
  // Setup for D3/Chart
  const nodeRef = useRef<null | HTMLDivElement>(null);
  const [ChartContainer, SetChartContainer] = useState<any>();
  useEffect(() => {
    if (nodeRef.current) {
      SetChartContainer(
        new Chart({
          containerNode: nodeRef.current,
          containerHeight: 500,
          containerWidth: 500,
          elemHeight: 10,
          elemWidth: 10,
        })
      );
    }
  }, []);

  // Redux
  const realtime = useSelector(
    (state: RootState) => state.sineCoordinates.realtime
  );
  //   const log = useSelector((state: RootState) => state.sineCoordinates.log);
  //   useEffect(() => {
  //     ChartContainer.update(realtime);
  //   }, [ChartContainer, realtime]);
  //   ChartContainer.update({ x: 200, y: 200 });
  useEffect(() => {
    ChartContainer?.update(realtime);
  }, [ChartContainer, realtime]);
  return (
    <>
      <div ref={nodeRef} />
    </>
  );
}
