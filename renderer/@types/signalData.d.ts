type signalData = {
  name: string;
  type: "clock" | "clockn" | "data";
  order: "ascending" | "descending";
  strobe: [number, number];
  folding: boolean;
  datas: string[];
};

type ScalePeriod = {};
