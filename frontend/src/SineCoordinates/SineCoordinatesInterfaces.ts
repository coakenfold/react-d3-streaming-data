export interface iLine {
  width: number;
  color?: string;
  fill?: string;
}
export interface iSine {
  frequency: number;
  amplitude?: number;
  start?: number;
}

export interface iSineDatum {
  timestamp: string;
  x: number;
  y: number;
}

export interface iChartSineConstructor {
  domNode: HTMLDivElement;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  svg?: { width?: number; height?: number; className: string };
  line?: iLine;
  sine?: iSine;
}
