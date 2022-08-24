import * as D3 from "d3"; // <-- todo optimize later

import { SineDataItemInterface } from "../interfaces";

interface lineInterface {
  width: number;
  color?: string;
  fill?: string;
}
interface sineInterface {
  frequency: number;
  amplitude?: number;
  start?: number;
}

export interface ChartSineConstructor {
  domNode: HTMLDivElement;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  svg?: { width: number; height: number; className: string };
  line?: lineInterface;
  dot?: { radius: number };
  sine?: sineInterface;
}

export const ChartSine = class {
  options: ChartSineConstructor & { line: lineInterface; sine: sineInterface };
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
  constructor(opts: ChartSineConstructor) {
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
    const svgSettings = { width: 600, height: 270, className: "", ...opts.svg };

    const width = svgSettings.width - margin.left - margin.right;
    const height = svgSettings.height - margin.top - margin.bottom;
    const svg = D3.select(opts.domNode)
      .append("svg")
      .attr("class", `svg ${svgSettings.className}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = D3.scaleLinear().range([0, width]);

    const scaleY = D3.scaleLinear().domain([-1, 1]).range([0, height]);

    // axis
    const axisX = D3.axisBottom(scaleX);
    const axisY = D3.axisLeft(scaleY).ticks(5);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(axisX);

    svg.append("g").attr("class", "y axis").call(axisY);

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
  generatePathData(sineData: SineDataItemInterface[]) {
    const initialX = sineData[0]?.x || 0;
    return sineData.map(({ x, y }) => [x - initialX, y]);
  }
  build(sineData: SineDataItemInterface[]) {
    // reformat
    const pathData = this.generatePathData(sineData);

    // Scales
    const scaleY = this.grapher.scaleY;
    const scaleX = D3.scaleLinear()
      .domain([
        D3.min(pathData, (set) => set[0]) || 0,
        D3.max(pathData, (set) => set[0]) || 0,
      ])
      .range([0, this.canvas.width]);

    // Generator
    const line = D3.line()
      .curve(D3.curveNatural)
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

    // save
    this.hasBuilt = true;
    this.grapher.line = line;
    this.grapher.scaleY = scaleY;
    this.grapher.scaleX = scaleX;
  }
  update(sineData: SineDataItemInterface[]) {
    // Clear
    // D3.selectAll("path").remove();

    // reformat
    const pathData = this.generatePathData(sineData);

    // Scales
    // const scaleY = this.grapher.scaleY;
    const scaleX = D3.scaleLinear()
      .domain([
        D3.min(pathData, (set) => set[0]) || 0,
        D3.max(pathData, (set) => set[0]) || 0,
      ])
      .range([0, this.canvas.width]);

    // Draw
    this.grapher.svg.transition();

    this.grapher.svg
      .select(".line")
      .attr("d", this.grapher.line(pathData as [number, number][]));

    // Animate
    // line
    // .transition("grow")
    // .duration(900)
    // .attrTween("stroke-dasharray", function () {
    //   const len = this.getTotalLength();
    //   return (t) => d3.interpolateString("0," + len, len + ",0")(t);
    // });

    // save
    // this.grapher.scaleY = scaleY;
    this.grapher.scaleX = scaleX;
  }
  destroy() {
    D3.select(`svg.${this.options.svg?.className}`).remove();
  }
};
