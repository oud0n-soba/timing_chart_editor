import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { NextPage } from "next/types";

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
import { WidthNormal } from "@mui/icons-material";

// type ChartData = 0 | 1 | "x" | "";
// type NameData = string;
// type SignalType = "clock" | "data" | "busData";

// let patternSource: HTMLCanvasElement | null = null;

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
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

const drawName = (
  ctx: CanvasRenderingContext2D,
  nameData: string[],
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#000";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  for (let i = 0; i < nameData.length; i++) {
    ctx.fillText(nameData[i], 5, i * CELL_HEIGHT + CELL_HEIGHT / 2);
  }
};

const drawScale = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  widthStart: number,
  scale: number
) => {
  ctx.clearRect(0, 0, width, height);

  ctx.font = "10px sans-serif";
  ctx.fillStyle = "#000";
  // ctx.strokeStyle = "#e0e0e0";
  ctx.strokeStyle = "#ec3f3fff";
  ctx.lineWidth = 0.8;

  for (let i = 0; i <= (width - widthStart) / CELL_WIDTH; i++) {
    if (i < (width - widthStart) / CELL_WIDTH - 1) {
      // ctx.fillText(
      //   (i * scale).toString(),
      //   i * CELL_WIDTH + widthStart,
      //   height,
      //   CELL_WIDTH - 2
      // );

      ctx.save();
      ctx.translate(i * CELL_WIDTH + widthStart, height);
      // ctx.rotate(Math.PI / 2);
      ctx.rotate(-Math.PI / 2);
      // ctx.textAlign = "right";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      // ctx.fillText((i * scale).toString(), -2, 0);
      ctx.fillText((i * scale).toString(), 2, 0);
      ctx.restore();

      // ctx.beginPath();
      // ctx.moveTo(i * CELL_WIDTH + widthStart, 0);
      // ctx.lineTo(i * CELL_WIDTH + widthStart, height);
      // ctx.stroke();
    }
  }
};

const drawChart = (
  ctx: CanvasRenderingContext2D,
  chartData: ChartData[][],
  signalType: SignalType[],
  width: number,
  height: number
) => {
  drawGrid(ctx, width, height);

  for (let i = 0; i < chartData.length; i++) {
    if ("clock" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        if (0 === chartData[i][j]) {
          drawClockCell0(ctx, j, i);
        } else if (1 === chartData[i][j]) {
          drawClockCell1(ctx, j, i);
        } else if ("x" === chartData[i][j]) {
          drawClockCellx(ctx, j, i);
        }
      }
    } else if ("data" == signalType[i]) {
      for (let j = 0; j < chartData[i].length; j++) {
        if (0 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto0(ctx, j, i);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to0(ctx, j, i);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to0(ctx, j, i);
          }
        } else if (1 === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxto1(ctx, j, i);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0to1(ctx, j, i);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1to1(ctx, j, i);
          }
        } else if ("x" === chartData[i][j]) {
          if (0 === j || "x" === chartData[i][j - 1]) {
            drawDataCellxtox(ctx, j, i);
          } else if (0 === chartData[i][j - 1]) {
            drawDataCell0tox(ctx, j, i);
          } else if (1 === chartData[i][j - 1]) {
            drawDataCell1tox(ctx, j, i);
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

  const chartHeight = CELL_HEIGHT * chartData.length;
  const chartWidth =
    CELL_WIDTH * chartData[getLongestRowIndex(chartData)].length;

  const nameHeight = CELL_HEIGHT * chartData.length;
  const nameWidth =
    CELL_WIDTH * nameData[getLongestNameIndex(nameData)].length + 2;

  const scaleHeight = CELL_HEIGHT;
  const scaleWidth = nameWidth + chartWidth + 1;

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial draw
    drawChart(ctx, chartData, signalType, chartWidth, chartHeight);
  }, [chartData, signalType, chartWidth, chartHeight]);

  useEffect(() => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial draw
    drawName(ctx, nameData, chartWidth, chartHeight);
  }, [nameData, chartWidth, chartHeight]);

  useEffect(() => {
    const canvas = scaleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial draw
    drawScale(ctx, scaleWidth, scaleHeight, nameWidth, period);
  }, [chartData, nameData, period]);

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNameValue, setNameEditingValue] = useState<NameData>("");
  const [editingSignalTypeValue, setEditingSignalTypeValue] =
    useState<SignalType>("data");

  const handleNameMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = nameCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    const row = Math.floor(mouseY / CELL_HEIGHT);

    if (row >= 0 && row < nameData.length) {
      setEditingIndex(row);
      setNameEditingValue(nameData[row]);
      setEditingSignalTypeValue(signalType[row]);
      setIsNameModalOpen(true);
    }
  };

  const handleScaleMouseDown = () => {
    setIsScaleModalOpen(true);
  };

  const saveNameEdit = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      newNameData[editingIndex] = editingNameValue;
      newSignalTypeData[editingIndex] = editingSignalTypeValue;
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
    }
  };

  const deleteSignal = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];
      newNameData.splice(editingIndex, 1);
      newSignalTypeData.splice(editingIndex, 1);
      newChartData.splice(editingIndex, 1);
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
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

  const moveSignalUp = () => {
    if (editingIndex !== null && editingIndex > 0) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      // Swap with index - 1
      [newNameData[editingIndex], newNameData[editingIndex - 1]] = [
        newNameData[editingIndex - 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex - 1]] = [
        newSignalTypeData[editingIndex - 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex - 1]] = [
        newChartData[editingIndex - 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveSignalDown = () => {
    if (editingIndex !== null && editingIndex < nameData.length - 1) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      // Swap with index + 1
      [newNameData[editingIndex], newNameData[editingIndex + 1]] = [
        newNameData[editingIndex + 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex + 1]] = [
        newSignalTypeData[editingIndex + 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex + 1]] = [
        newChartData[editingIndex + 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex + 1);
    }
  };

  const cancelNameEdit = () => {
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  const saveScaleEdit = (period: number) => {
    setIsScaleModalOpen(false);
  };

  const cancelScaleEdit = () => {
    setIsScaleModalOpen(false);
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
    const row = Math.floor(mouseY / CELL_HEIGHT);

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

  const handleSave = async () => {
    const data = {
      nameData,
      signalType,
      chartData,
    };
    try {
      const result = await (window as any).electron.saveJson(data);
      if (result.success) {
        setStatus("保存しました");
      } else if (result.error) {
        setStatus(`保存に失敗しました: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      setStatus("保存エラー");
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
        setStatus(`読み込みに失敗しました: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      setStatus("読み込みエラー");
    }
  };

  return (
    <Layout title="Timing Chart Grid">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          fontFamily: "sans-serif",
          backgroundColor: "#f0f0f0",
          minHeight: "calc(100vh - 64px)", // Adjust for layout header if needed
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ fontWeight: "bold", flexGrow: 1 }}>{status}</div>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save JSON
          </button>
          <button
            onClick={handleLoad}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#17a2b8",
              color: "white",
              cursor: "pointer",
            }}
          >
            Load JSON
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content 2fr",
            gridTemplateRows: "max-content 2fr",
            alignItems: "start",
            padding: "20px",
            fontFamily: "sans-serif",
            backgroundColor: "#f0f0f0",
            width: "100%",
          }}
        >
          <div />
          <div
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
              height={scaleHeight}
              onMouseDown={handleScaleMouseDown}
            />
          </div>
          <div
            style={{
              overflowX: "hidden",
              overflowY: "hidden",
              gridColumn: "1 / 2",
              gridRow: "2 / 3",
            }}
          >
            <canvas
              ref={nameCanvasRef}
              width={nameWidth}
              height={nameHeight}
              onMouseDown={handleNameMouseDown}
            />
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
        <button
          onClick={addNewSignal}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#fe5884ff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add New Signal
        </button>
      </div>
      {isNameModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              minWidth: "300px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Edit Signal Name</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "8px",
                }}
              >
                <button
                  onClick={moveSignalUp}
                  disabled={editingIndex === 0}
                  style={{
                    marginBottom: "2px",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  ▲
                </button>
                <button
                  onClick={moveSignalDown}
                  disabled={editingIndex === nameData.length - 1}
                  style={{ cursor: "pointer", padding: "2px 6px" }}
                >
                  ▼
                </button>
              </div>
              <input
                type="text"
                value={editingNameValue}
                onChange={(e) => setNameEditingValue(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: "8px",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                autoFocus
              />
            </div>

            <h3 style={{ marginTop: 0 }}>Edit Signal Type</h3>
            <select
              value={editingSignalTypeValue}
              onChange={(e) =>
                setEditingSignalTypeValue(e.target.value as SignalType)
              }
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "16px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="data">Data</option>
              <option value="clock">Clock</option>
            </select>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={deleteSignal}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#ff0051ff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete Signal
              </button>
              <button
                onClick={cancelNameEdit}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveNameEdit}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isScaleModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              minWidth: "300px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Edit Signal Name</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <input
                type="number"
                min={1}
                step={1}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                style={{
                  flexGrow: 1,
                  padding: "8px",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                autoFocus
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={cancelScaleEdit}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveScaleEdit}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
