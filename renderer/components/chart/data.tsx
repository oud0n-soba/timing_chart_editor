import { Stage, Text, Layer, Rect, Line } from "react-konva";

export const Data = ({
  x,
  y,
  strobe,
  d,
  dPre,
  width,
  height,
}: {
  x: number;
  y: number;
  strobe: signalData["strobe"];
  d: string;
  dPre: string;
  width: number;
  height: number;
}) => {
  const getYpos = (d: string) => {};

  return (
    <>
      <Line
        x={x}
        y={y}
        points={(() => {
          const point1 = (width * strobe[0]) / 100;
          const point2 = (width * strobe[1]) / 100;

          const yPre = ((dPre) => {
            switch (dPre) {
              case "P":
                return height;
              case "0":
                return height;
              case "1":
                return 0;
              case "X":
                return height / 2;
              case "":
                return height / 2;
              default:
                return height / 2;
            }
          })(dPre);

          switch (d) {
            case "P":
              const startEdge =
                yPre === height
                  ? []
                  : yPre === height / 2
                  ? [0, height / 2, point1, height / 2]
                  : [0, 0, point1, 0];
              return [
                0,
                yPre,
                ...startEdge,
                point1,
                0,
                point2,
                0,
                point2,
                height,
                width,
                height,
              ];
            case "0":
              return [0, yPre, 0, height, width, height];
            case "1":
              return [0, yPre, 0, 0, width, 0];
            case "X":
              return [0, yPre, 0, height / 2, width, height / 2];
            default:
              return [0, yPre, 0, height / 2, width, height / 2];
          }
        })()}
        stroke={"X" === d || "" === d ? "red" : "black"}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
};
