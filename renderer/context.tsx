
import { createContext } from 'react';

const sampleSignalData: signalData[] = [
  {
    "name": "clk",
    "type": "clock",
    "order": "ascending",
    "folding": false,
    "data": [
      "0101"
    ]
  },
  {
    "name": "reset",
    "type": "data",
    "order": "descending",
    "folding": false,
    "data": [
      "0101"
    ]
  },
  {
    "name": "bus_data",
    "type": "data",
    "order": "descending",
    "folding": false,
    "data": [
      "0101",
      "1010",
      "0101",
      "0101"
    ]
  }
];

export const DataContext = createContext<{
  data: signalData[],
  dataReducer: (period: ScalePeriod) => void
}>({
  data: [],
  dataReducer: (period) => { }
});