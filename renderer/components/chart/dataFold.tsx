import { Stage, Text, Layer, Rect, Line } from "react-konva";

export const DataFold = ({
  x,
  y,
  strobe,
  d,
  dPre,
  width,
  height,
  bitWidth,
  delayWidth,
}: {
  x: number;
  y: number;
  strobe: signalData["strobe"];
  d: string;
  dPre: string;
  width: number;
  height: number;
  bitWidth: number;
  delayWidth: number;
}) => {
  const isX = d.indexOf("x") > 0 || d.indexOf("X") > 0 || "" === d;
  const isXPre = dPre.indexOf("x") > 0 || dPre.indexOf("X") > 0;

  const dBin = "" !== d ? `${bitWidth}'b${d}` : `${bitWidth}'bx`;
  const dInt = parseInt(d, 2);
  const dHex = Number.isNaN(dInt)
    ? `${bitWidth}'hx`
    : `${bitWidth}'h${dInt.toString(16)}`;

  const signal = bitWidth <= 5 ? dBin : dHex;

  console.log(d, x, y);

  return (
    <>
      <Text
        x={x + delayWidth + 1}
        y={y + height / 4}
        text={signal}
        fontSize={10}
      />
      <Line
        x={x}
        y={y}
        points={[delayWidth, 0, width, 0]}
        stroke={isX ? "red" : "black"}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
      <Line
        x={x}
        y={y}
        points={[delayWidth, height, width, height]}
        stroke={isX ? "red" : "black"}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
      {dPre === d ? (
        <>
          <Line
            x={x}
            y={y}
            points={[0, height, delayWidth, 0]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            x={x}
            y={y}
            points={[0, height, delayWidth, height]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        </>
      ) : (
        <>
          <Line
            x={x}
            y={y}
            points={[0, 0, delayWidth / 2, height / 2]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            x={x}
            y={y}
            points={[delayWidth / 2, height / 2, delayWidth, 0]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            x={x}
            y={y}
            points={[0, height, delayWidth / 2, height / 2]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            x={x}
            y={y}
            points={[delayWidth / 2, height / 2, delayWidth, height]}
            stroke={isXPre ? "red" : "black"}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        </>
      )}
    </>
  );
};
