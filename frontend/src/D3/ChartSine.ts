import * as d3 from "d3";
import {
  iLine,
  iSine,
  iSineDatum,
  iChartSineConstructor,
} from "../SineCoordinates/SineCoordinatesInterfaces";

/***
 * 
 * @example 
 * ```ts
 const chartSine = new ChartSine(arg: {
  domNode: HTMLDivElement;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  svg?: { width?: number; height?: number; className: string };
  line?: {
    width: number;
    color?: string;
    fill?: string;
  };
  dot?: { radius: number };
  sine?: {
    frequency: number;
    amplitude?: number;
    start?: number;
  });

  // Build the chart:
  chartSine.build([{
    timestamp: 1661481586997,
    "x":8993,
    "y":0.98180936061727
  }]);
  
  // Update the chart:
  chartSine.update({
    timestamp: 1661481586997,
    "x":8993,
    "y":0.98180936061727
  });
  // Remove chart svg:
  chartSine.destroy();
  ```
 */
export class ChartSine {
  // --------------------------------------------
  options: iChartSineConstructor & { line: iLine; sine: iSine };
  grapher: {
    svg: any;
    scaleX: any;
    scaleY: any;
    axisX: any;
    axisY: any;
    line?: any;
    gAxisX: any;
    gAxisY: any;
  };
  canvas: {
    width: number;
    height: number;
  };
  hasBuilt: boolean;

  constructor(opts: iChartSineConstructor) {
    this.hasBuilt = false;

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

    // Axis scale
    const scaleX = d3.scaleLinear().range([0, width]);
    const scaleY = d3.scaleLinear().domain([-1, 1]).range([0, height]);

    // Axis functions
    const axisX = d3.axisBottom(scaleX).ticks(10);
    const axisY = d3.axisLeft(scaleY).ticks(5);

    // Axis groups
    const gAxisX = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(axisX);

    const gAxisY = svg.append("g").attr("class", "y axis").call(axisY);

    // Zoom
    const onZoom = ({ transform }: { transform: any }) => {
      d3.select("path.line").attr("transform", transform);

      // Axis X
      const zoomScaleX = transform.rescaleX(scaleX);
      axisX.scale(zoomScaleX);
      d3.select("g.axis.x").call(axisX as any);

      // Axis Y
      const zoomScaleY = transform.rescaleY(scaleY);
      axisY.scale(zoomScaleY);
      d3.select("g.axis.y").call(axisY as any);
    };

    const zoomSvg = d3.zoom().on("zoom", onZoom);
    d3.select("svg").call(zoomSvg as any);

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
      gAxisX,
      gAxisY,
    };
  }
  /**
   *
   * Converts realtime data from {x,y} to [x - startingX, y]
   * @param sineData
   */
  generatePathData(sineData: iSineDatum[]) {
    const startingX = sineData[0]?.x || 0;
    return sineData.map(({ x, y }) => [x - startingX, y]);
  }
  /**
   * Draws the initial chart & axis
   */
  build(sineData: iSineDatum[]) {
    // Reformat data
    const pathData = this.generatePathData(sineData);

    // Create scales
    const scaleY = this.grapher.scaleY;
    const xMin = d3.min(pathData, (set) => set[0]) || 0;
    const xMax = d3.max(pathData, (set) => set[0]) || 0;

    const scaleX = d3
      .scaleTime()
      .domain([xMin, xMax])
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
  /**
   * Redraws the chart with updated data
   * @param sineData
   */
  update(sineData: iSineDatum[]) {
    // Reformat data
    const pathData = this.generatePathData(sineData);

    // Draw
    const line = this.grapher.svg.select(".line");
    line.attr("d", this.grapher.line(pathData as [number, number][]));
  }
  /**
   * Removes svg
   */
  destroy() {
    d3.select(`svg.${this.options.svg?.className}`).remove();
  }
}
