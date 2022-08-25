import * as d3 from "d3";
import {
  iLine,
  iSine,
  iSineDatum,
  iChartSineConstructor,
} from "../SineCoordinates/SineCoordinatesInterfaces";

export const ChartSine = class {
  //
  options: iChartSineConstructor & { line: iLine; sine: iSine };
  grapher: {
    svg: any;
    scaleX: any;
    scaleY: any;
    axisX: any;
    axisY: any;
    line?: any;
  };
  canvas: {
    width: number;
    height: number;
  };
  hasBuilt = false;
  //
  constructor(opts: iChartSineConstructor) {
    const dot = { radius: 2, ...opts.dot };
    const line = {
      width: 2,
      color: "black",
      fill: "none",
      ...opts.line,
    };
    const margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50,
      ...opts.margin,
    };
    const sine = { frequency: 1, ...opts.sine };
    const svgSettings = { width: 500, height: 500, className: "", ...opts.svg };

    const width = svgSettings.width - margin.left - margin.right;
    const height = svgSettings.height - margin.top - margin.bottom;

    const svg = d3
      .select(opts.domNode)
      .append("svg")
      .attr("class", `svg ${svgSettings.className}`)
      .attr("viewBox", `0 0 ${svgSettings.width} ${svgSettings.height}`)
      .append("g")
      .attr("class", `chart`)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear().range([0, width]);
    const scaleY = d3.scaleLinear().domain([-1, 1]).range([0, height]);

    // axis
    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY).ticks(5);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(axisX);

    svg.append("g").attr("class", "y axis").call(axisY);

    // Zoom
    // const handleZoom = (e: any) => {
    //   console.log("handleZoom");
    //   d3.select("g.chart").attr("transform", e.transform);

    //   d3.select(".x.axis").transition().call(axisX);
    //   d3.select(".y.axis").transition().call(axisY);
    // };

    // const zoomSvg = d3.zoom().on("zoom", (e: any) => {
    //   console.log("zoomSvg");
    //   d3.select("g.chart").attr("transform", e.transform);
    // });
    // d3.select("svg").call(zoomSvg);

    // const zoomX = d3.zoom().on("zoom", (e: any) => {
    //   console.log("zoomX");
    //   d3.select(".x.axis").transition().call(axisX);
    //   d3.select(".x.axis").attr("transform", e.transform);
    // });
    // d3.select(".x.axis").call(zoomX);

    // save
    this.options = {
      ...opts,
      dot,
      line,
      margin,
      sine,
      svg: svgSettings,
    };
    this.canvas = { width, height };
    this.grapher = {
      svg,
      scaleX,
      scaleY,
      axisX,
      axisY,
    };
  }
  //
  generatePathData(sineData: iSineDatum[]) {
    const initialX = sineData[0]?.x || 0;
    return sineData.map(({ x, y }) => [x - initialX, y]);
  }
  //
  build(sineData: iSineDatum[]) {
    // Reformat data
    const pathData = this.generatePathData(sineData);

    // Create scales
    const scaleY = this.grapher.scaleY;
    const scaleX = d3
      .scaleLinear()
      .domain([
        d3.min(pathData, (set) => set[0]) || 0,
        d3.max(pathData, (set) => set[0]) || 0,
      ])
      .range([0, this.canvas.width]);

    // Create line generator
    const line = d3
      .line()
      .curve(d3.curveNatural)
      .x(([x]) => {
        return x * this.options.sine.frequency;
      })
      .y(([_, y]) => scaleY(y));

    // Draw
    const { color, width, fill } = this.options.line;
    this.grapher.svg
      .append("path")
      .datum(pathData)
      .attr("class", "line")
      .attr("stroke", color)
      .attr("stroke-width", width)
      .attr("fill", fill)
      .attr("d", line(pathData as [number, number][]));

    // Save
    this.hasBuilt = true;
    this.grapher.line = line;
    this.grapher.scaleY = scaleY;
    this.grapher.scaleX = scaleX;
  }
  update(sineData: iSineDatum[]) {
    // Reformat data
    const pathData = this.generatePathData(sineData);

    // Draw
    const line = this.grapher.svg.select(".line");
    line.attr("d", this.grapher.line(pathData as [number, number][]));
  }
  destroy() {
    d3.select(`svg.${this.options.svg?.className}`).remove();
  }
};
