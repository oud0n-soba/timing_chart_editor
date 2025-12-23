import React, { useEffect, useRef, useState } from "react";
// import Layout from "../../components/Layout";
import Layout from "./Layout";
import { NextPage } from "next/types";
import { NameModal } from "../../utils/chart/NameModal";

import { CELL_HEIGHT, CELL_WIDTH } from "../../utils/chart/variable";
import {
  drawClockCell0,
  drawClockCell1,
  drawClockCellx,
} from "../../utils/chart/drawClock";

import {
  drawDataCell0to1,
  drawDataCell0to0,
  drawDataCell0tox,
  drawDataCellxto0,
  drawDataCell1to0,
  drawDataCell1to1,
  drawDataCell1tox,
  drawDataCellxto1,
  drawDataCellxtox,
} from "../../utils/chart/drawData";

const getLongestRowIndex = (data: ChartData[][]): number => {
  return data.reduce(
    (maxIdx, row, idx, arr) => (row.length > arr[maxIdx].length ? idx : maxIdx),
    0
  );
};

const getLongestNameIndex = (data: NameData[]): number => {
  return data.reduce(
    (maxIdx, row, idx, arr) => (row.length > arr[maxIdx].length ? idx : maxIdx),
    0
  );
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;

  for (let x = CELL_WIDTH; x <= width; x += CELL_WIDTH) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += CELL_HEIGHT) {
    if (CELL_HEIGHT === y) {
      ctx.strokeStyle = "#b9b3b3ff";
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
    }

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const drawName = (
  ctx: CanvasRenderingContext2D,
  nameData: string[],
  currentY: number,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.font = "14px SourceHanCodeJP-Normal";
  ctx.fillStyle = "#000";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  for (let i = 0; i < nameData.length; i++) {
    ctx.fillText(nameData[i], 5, i * CELL_HEIGHT + CELL_HEIGHT / 2 + currentY);
  }
};

const drawScale = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  period: number
) => {
  // ctx.clearRect(0, 0, width, height);

  ctx.font = "10px SourceHanCodeJP-Normal";
  ctx.fillStyle = "#000";
  // ctx.strokeStyle = "#e0e0e0";
  // ctx.strokeStyle = "#ec3f3fff";
  // ctx.lineWidth = 0.8;

  for (let i = 0; i <= width / CELL_WIDTH; i++) {
    if (i < width / CELL_WIDTH) {
      ctx.fillText(
        (i * period).toString(),
        i * CELL_WIDTH + 2,
        height - 5,
        CELL_WIDTH - 2
      );
    }
  }
};

const drawChart = (
  ctx: CanvasRenderingContext2D,
  chartData: ChartData[][],
  signalType: SignalType[],
  currentY: number
  // width: number,
  // height: number
) => {
  // drawGrid(ctx, width, height);

  for (let i = 0; i <= chartData.length; i++) {
    const y = i * CELL_HEIGHT + currentY;

    if ("clock" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        const x = j * CELL_WIDTH;

        if (0 === chartData[i][j]) {
          drawClockCell0(ctx, x, y);
        } else if (1 === chartData[i][j]) {
          drawClockCell1(ctx, x, y);
        } else if ("x" === chartData[i][j]) {
          drawClockCellx(ctx, x, y);
        }
      }
    } else if ("data" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        const x = j * CELL_WIDTH;

        if (0 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto0(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to0(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to0(ctx, x, y);
          }
        } else if (1 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto1(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to1(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to1(ctx, x, y);
          }
        } else if ("x" === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxtox(ctx, x, y);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0tox(ctx, x, y);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1tox(ctx, x, y);
          }
        }
      }
    }
  }
};

export default function ChartPage() {
  const nameCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const scaleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("マス目をクリックしてください");
  const [nameData, setNameData] = useState<NameData[]>([
    "RESET",
    "CLOCK",
    "DATA0",
    "DATA1",
    "DATA2",
    "DATA3",
    "DATA4",
    "DATA5",
    "DATA6",
  ]);

  const [signalType, setSignalType] = useState<SignalType[]>([
    "data",
    "clock",
    "data",
    "data",
    "data",
    "data",
    "data",
    "data",
    "data",
  ]);

  const [chartData, setChartData] = useState<ChartData[][]>([
    [1, 1, 1, 0, 0, 0, 1, ""],
    [0, 0, 1, 1, 1, 1, 1, ""],
    [1, 0, 0, 1, 1, 0, 0, ""],
    [1, 1, 1, 1, 1, 1, 1, ""],
    [0, 0, 0, 0, 0, 0, 0, ""],
    [1, 0, 1, 0, 1, 0, 1, ""],
    [0, 1, 0, 1, 0, 1, 0, ""],
    [1, 0, 1, 0, 1, 0, 1, ""],
    [1, 0, 1, 0, 1, 0, 1, ""],
  ]);

  const [period, setPeriod] = useState<number>(40);

  const tmpnameWidth = 10 * nameData[getLongestNameIndex(nameData)].length + 10;
  const nameWidth = tmpnameWidth < 100 ? 100 : tmpnameWidth;

  const chartWidth =
    CELL_WIDTH * chartData[getLongestRowIndex(chartData)].length;

  const chartHeight = CELL_HEIGHT * chartData.length + CELL_HEIGHT;

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Initial draw
      drawGrid(ctx, chartWidth, chartHeight);
      // drawChart(ctx, chartData, signalType, CELL_HEIGHT, chartWidth, chartHeight);
      drawScale(ctx, chartWidth, CELL_HEIGHT, period);
      drawChart(ctx, chartData, signalType, CELL_HEIGHT);
    };

    // render();
    document.fonts.ready.then(render);
  }, [chartData, nameData, period, signalType, chartWidth, chartHeight]);

  useEffect(() => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      drawName(ctx, nameData, CELL_HEIGHT, nameWidth, chartHeight);
    };

    // render();
    document.fonts.ready.then(render);
  }, [nameData, nameWidth, chartHeight]);

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNameValue, setNameEditingValue] = useState<NameData>("");
  const [editingSignalTypeValue, setEditingSignalTypeValue] =
    useState<SignalType>("data");

  const handleNameMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const row = Math.floor((mouseY - CELL_HEIGHT) / CELL_HEIGHT);

    // TODO: out of bounds : chart folding
    if (row < 0 || row >= nameData.length) return;

    if (row >= 0 && row < nameData.length) {
      setEditingIndex(row);
      setNameEditingValue(nameData[row]);
      setEditingSignalTypeValue(signalType[row]);
      setIsNameModalOpen(true);
    }
  };

  const addNewSignal = () => {
    const newNameData = [...nameData];
    const newSignalTypeData = [...signalType];
    const newChartData = [...chartData];
    newNameData.push("NEW_DATA");
    newSignalTypeData.push("data");
    newChartData.push([0]);
    setNameData(newNameData);
    setSignalType(newSignalTypeData);
    setChartData(newChartData);
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  const handleChartMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / CELL_WIDTH);
    const row = Math.floor((mouseY - CELL_HEIGHT) / CELL_HEIGHT);

    // TODO: out of bounds : chart folding
    if (row < 0 || row >= chartData.length) return;

    // 新規値を設定
    const newData = [...chartData];
    newData[row] = [...newData[row]];
    newData[row][col] =
      newData[row][col] === 0
        ? 1
        : newData[row][col] === 1
        ? "x"
        : newData[row][col] === "x" && col === newData[row].length - 2
        ? ""
        : 0;

    if (col === newData[row].length - 1 && "" !== newData[row][col]) {
      // current element not empty, add empty element
      newData[row].push("");
    } else if (col === newData[row].length - 2 && "" === newData[row][col]) {
      // set current element to "", remove last empty element
      newData[row].pop();
    }
    setChartData(newData);

    setStatus(`クリック位置: 列 ${col}, 行 ${row}, 値: ${newData[row][col]}`);
  };

  return (
    <Layout title="Timing Chart Grid">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          fontFamily: "SourceHanCodeJP-Normal",
          backgroundColor: "#f0f0f0",
          minHeight: "calc(100vh - 64px)", // Adjust for layout header if needed
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content 2fr",
            gridTemplateRows: "max-content 2fr",
            alignItems: "start",
            padding: "20px",
            fontFamily: "SourceHanCodeJP-Normal",
            backgroundColor: "#f0f0f0",
            width: "100%",
          }}
        >
          <div />
          {/* <div
            style={{
              overflowX: "hidden",
              overflowY: "hidden",
              gridColumn: "1 / 3",
              gridRow: "1 / 2",
            }}
          >
            <canvas
              ref={scaleCanvasRef}
              width={scaleWidth}
              height={CELL_HEIGHT}
              onMouseDown={handleScaleMouseDown}
            />
          </div> */}
          <div
            style={{
              overflowX: "hidden",
              overflowY: "hidden",
              gridColumn: "1 / 2",
              gridRow: "2 / 3",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                // gridTemplateColumns: "max-content 2fr",
                // gridTemplateRows: "max-content 2fr",
                // alignItems: "start",
                // padding: "20px",
                // fontFamily: "sans-serif",
                // backgroundColor: "#f0f0f0",
                // width: "100%",
              }}
            >
              <canvas
                ref={nameCanvasRef}
                width={nameWidth}
                height={chartHeight}
                onMouseDown={handleNameMouseDown}
              />
              <button
                onClick={addNewSignal}
                style={{
                  padding: "8px 14px 8px 14px",
                  margin: "8px",
                  borderRadius: "4px",
                  width: "80px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fe5884ff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                ADD
              </button>
            </div>
          </div>
          <div
            style={{
              overflowX: "scroll",
              overflowY: "hidden",
              gridColumn: "2 / 3",
              gridRow: "2 / 3",
            }}
          >
            <canvas
              ref={chartCanvasRef}
              width={chartWidth}
              height={chartHeight}
              onMouseDown={handleChartMouseDown}
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                cursor: "crosshair",
              }}
            />
          </div>
        </div>
      </div>
      {isNameModalOpen && (
        <NameModal
          nameData={nameData}
          setNameData={setNameData}
          signalType={signalType}
          setSignalType={setSignalType}
          chartData={chartData}
          setChartData={setChartData}
          setIsNameModalOpen={setIsNameModalOpen}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          editingNameValue={editingNameValue}
          setNameEditingValue={setNameEditingValue}
          editingSignalTypeValue={editingSignalTypeValue}
          setEditingSignalTypeValue={setEditingSignalTypeValue}
        />
      )}
    </Layout>
  );
}
