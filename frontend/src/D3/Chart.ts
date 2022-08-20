import * as d3 from "d3"; // <-- todo optimize later

export const Chart = (ref: HTMLDivElement | null) => {
  const svg = d3
    .select(ref)
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);
  svg
    .append("rect")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 400)
    .attr("fill", "orange");
};
