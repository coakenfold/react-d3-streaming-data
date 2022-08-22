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
  update(sineData: SineDataItemInterface[]) {
    // Scales
    const scaleX = d3
      .scaleLinear()
      // .domain([0, d3.max(sineData, ({ x }: SineDataItemInterface) => x)])
      .domain([0, 1.7976931348623157 * 10308])
      .range([0, this.containerWidth]);
    const scaleY = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, this.containerHeight - this.elemHeight]);

    console.log("debug", this);
    // Data Join
    const rects = this.container.selectAll("rect").data(sineData);

    // Exit
    rects.exit().remove();

    // Update
    rects
      .attr("x", (data, i) => {
        return this.containerWidth - this.elemWidth * i;
      })
      .attr("y", (data, i) => {
        return scaleY(data.y);
      });

    // Enter
    rects
      .enter()
      .append("rect")
      .attr("x", (data, i) => {
        return this.containerWidth - this.elemWidth;
      })
      .attr("y", (data, i) => {
        return scaleY(data.y);
      })
      .attr("width", this.elemWidth)
      .attr("height", this.elemHeight)
      .attr("fill", "green");
  }
};
