import { useEffect, useRef } from "react";
import { Chart } from "./D3/Chart";
export const ChartWrapper = () => {
  const chartRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    Chart(chartRef.current);
  }, []);
  return <div ref={chartRef}>(I am Chart)</div>;
};
