import * as d3 from "d3"; // <-- todo optimize later

import { SineDataItemInterface } from "../interfaces";
export interface ChartConstructor {
  containerNode: HTMLDivElement;
  containerWidth: number;
  containerHeight: number;
  elemWidth: number;
  elemHeight: number;
}
export const Chart = class {
  container;
  containerWidth;
  containerHeight;
  elemWidth;
  elemHeight;
  constructor(arg: ChartConstructor) {
    this.containerWidth = arg.containerWidth;
    this.containerHeight = arg.containerHeight;
    this.elemWidth = arg.elemWidth;
    this.elemHeight = arg.elemHeight;

    // Parent
    this.container = d3
      .select(arg.containerNode)
      .append("svg")
      .attr("width", arg.containerWidth)
      .attr("height", arg.containerHeight);
  }
  update(sineData: [number, number][]) {
    const lineWidth = 1;

    // Scale
    const scaleX = d3
      .scaleLinear()
      .domain([
        d3.min(sineData, (d) => d[0]) as number,
        d3.max(sineData, (d) => d[0]) as number,
      ])
      .range([0, this.containerWidth]);
    const scaleY = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, this.containerHeight - lineWidth]);

    // Curved line interpolator.
    const bezierLine = d3
      .line()
      .curve(d3.curveBasis)
      .x((d, i) => {
        console.log(d, i, scaleX(d[0]));
        return scaleX(d[0]);
      })
      .y((d) => scaleY(d[1]));

    // Draw line & animate.
    const line = this.container
      .append("path")
      .datum(sineData)
      .attr("stroke", "black")
      .attr("stroke-width", lineWidth)
      .attr("fill", "none")
      .attr("d", (d) => {
        return bezierLine(d as [number, number][]);
      });

    line
      .transition("grow")
      .duration(900)
      .attrTween("stroke-dasharray", function () {
        const len = this.getTotalLength();
        return (t) => d3.interpolateString("0," + len, len + ",0")(t);
      });
  }
};
