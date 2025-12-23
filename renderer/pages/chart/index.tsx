import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button";
import { NextPage } from "next/types";
import { NameModal } from "../../components/chart/NameModal";

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

  const handleSave = async () => {
    const data = {
      nameData,
      signalType,
      chartData,
    };
    try {
      const result = await (window as any).electron.saveJson(data);
      if (result.success) {
        // setStatus("保存しました");
      } else if (result.error) {
        // setStatus(`保存に失敗しました: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      // setStatus("保存エラー");
    }
  };

  const handleLoad = async () => {
    try {
      const result = await (window as any).electron.loadJson();
      if (result.success && result.data) {
        const validatedChartData = result.data.chartData.map(
          (row: ChartData[]) => {
            if (row.length === 0 || row[row.length - 1] !== "") {
              return [...row, ""];
            }
            return row;
          }
        );

        setNameData(result.data.nameData);
        setSignalType(result.data.signalType);
        setChartData(validatedChartData);
        setStatus("読み込みました");
      } else if (result.error) {
        // setStatus(`読み込みに失敗しました: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      // setStatus("読み込みエラー");
    }
  };

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
    <div>
      <header>
        <nav>
          {/* <Link href="/">Home</Link> | <Link href="/about">About</Link> |{" "} */}
          {/* <Link href="/initial-props">With Initial Props</Link> */}
          <div
            style={{
              // marginBottom: "10px",
              // marginRight: "10px",
              // marginLeft: "10px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#333",
              color: "white",
              padding: "10px",
              borderRadius: "4px",
              // margin: "10px ",
            }}
          >
            Timing Chart Editor
            <Button
              onClick={handleSave}
              style={{
                marginLeft: "auto",
                padding: "8px 14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#28a745",
                color: "white",
                cursor: "pointer",
              }}
            >
              Save JSON
            </Button>
            <Button
              onClick={handleLoad}
              style={{
                marginRight: "20px",
                padding: "8px 14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#17a2b8",
                color: "white",
                cursor: "pointer",
              }}
            >
              Load JSON
            </Button>
          </div>
        </nav>
      </header>
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
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            marginBottom: "10px",
            padding: "0 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px 10px",
              }}
            >
              <span style={{ marginRight: "5px" }}>Step:</span>
              <input
                type="number"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                style={{
                  border: "none",
                  outline: "none",
                  width: "50px",
                  fontSize: "14px",
                  textAlign: "right",
                }}
              />
            </div>
            <button
              onClick={() => setPeriod((p) => p + 10)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #ccc",
                backgroundColor: "white",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              +
            </button>
            <button
              onClick={() => setPeriod((p) => Math.max(10, p - 10))}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #ccc",
                backgroundColor: "white",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              -
            </button>
          </div>
        </div>
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
    </div>
  );
}
