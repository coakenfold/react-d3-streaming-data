import * as d3 from "d3"; // <-- todo optimize later

import { SineDataItemInterface } from "../interfaces";

export const Chart = (element: HTMLDivElement | null) => {
  const WIDTH = 500;
  const HEIGHT = 500;
  const RECT_WIDTH = 10;
  const RECT_HEIGHT = 10;

  // Parent
  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  // Scales
  const y = d3
    .scaleLinear()
    .domain([-1, 1])
    .range([0, HEIGHT - RECT_HEIGHT]);
  var x = d3
    .scaleLinear()
    .domain([0, 1.7976931348623157 * 10308])
    .range([0, WIDTH]);

  const update = (sineData: SineDataItemInterface[]) => {
    // Data Join
    const rects = svg.selectAll("rect").data(sineData);
    console.log("i am update", sineData);

    // Exit
    rects.exit().remove();

    // Update
    rects
      .attr("x", (data, i) => {
        return WIDTH - RECT_WIDTH;
      })
      .attr("y", (data, i) => {
        return 0; //y(data.y);
      })
      .attr("width", RECT_WIDTH)
      .attr("height", RECT_HEIGHT)
      .attr("fill", "green")
      .transition()
      .duration(500)
      .attr("y", (data, i) => {
        return y(data.y);
      });

    // Enter
    rects
      .enter()
      .append("rect")
      .attr("x", (data, i) => {
        console.log("enter", data);
        return x(data.x);
      })
      .attr("y", (data, i) => {
        return y(data.y);
      })
      .attr("width", RECT_WIDTH)
      .attr("height", RECT_HEIGHT)
      .attr("fill", "green");
  };
  return { update };
};
