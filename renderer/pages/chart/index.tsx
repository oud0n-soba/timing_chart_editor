import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { NextPage } from "next/types";

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;

type ChartData = (number | "z" | "x")[][];

export default function ChartPage() {
  const getLongestRowIndex = (data: ChartData): number => {
    return data.reduce(
      (maxIdx, row, idx, arr) =>
        row.length > arr[maxIdx].length ? idx : maxIdx,
      0
    );
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("マス目をクリックしてください");
  const [chartData, setChartData] = useState<ChartData>([
    [0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1],
  ]);

  const [height, setHeight] = useState(CELL_HEIGHT * chartData.length);
  const [width, setWidth] = useState(
    CELL_WIDTH * chartData[getLongestRowIndex(chartData)].length
  );

  const drawCell0to1 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#0055ff";

    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
    ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
    ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
    ctx.stroke();
  };

  const drawCell0to0 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#0055ff";

    ctx.beginPath();
    ctx.moveTo(x, y + CELL_HEIGHT - 5);
    ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
    ctx.stroke();
  };

  const drawCellxto0 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#ff55ff";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(x, y + CELL_HEIGHT / 2);
    ctx.lineTo(x, y + CELL_HEIGHT - 5);
    ctx.stroke();

    ctx.strokeStyle = "#0055ff";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(x, y + CELL_HEIGHT - 5);
    ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
    ctx.stroke();
  };

  const drawCell1to0 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#0055ff";

    ctx.beginPath();
    ctx.moveTo(x, y + CELL_HEIGHT - 5);
    ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
    ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
    ctx.lineTo(x + CELL_WIDTH, y + 5);
    ctx.stroke();
  };

  const drawCell1to1 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#0055ff";

    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x + CELL_WIDTH, y + 5);
    ctx.stroke();
  };

  const drawCellxto1 = (
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number
  ) => {
    const x = col * CELL_WIDTH;
    const y = row * CELL_HEIGHT;

    ctx.strokeStyle = "#ff55ff";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(x, y + CELL_HEIGHT / 2);
    ctx.lineTo(x, y + 5);
    ctx.stroke();

    ctx.strokeStyle = "#0055ff";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x + CELL_WIDTH, y + 5);
    ctx.stroke();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += CELL_WIDTH) {
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

  const drawChart = (ctx: CanvasRenderingContext2D) => {
    drawGrid(ctx);

    for (let i = 0; i < chartData.length; i++) {
      for (let j = 0; j < chartData[i].length; j++) {
        if (0 === chartData[i][j]) {
          if (0 === j) {
            drawCellxto0(ctx, j, i);
          } else if (0 === chartData[i][j - 1]) {
            drawCell0to0(ctx, j, i);
          } else {
            drawCell0to1(ctx, j, i);
          }
        } else if (1 === chartData[i][j]) {
          if (0 === j) {
            drawCellxto1(ctx, j, i);
          } else if (1 === chartData[i][j - 1]) {
            drawCell1to1(ctx, j, i);
          } else {
            drawCell1to0(ctx, j, i);
          }
        }
        // else if ("z" === chartData[i][j]) {
        //   //   drawCellZ(ctx, j, i);
        // }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial draw
    // drawGrid(ctx);
    drawChart(ctx);
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
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
    newData[row][col] =
      newData[row][col] === 0
        ? 1
        : newData[row][col] === 1
        ? "z"
        : newData[row][col] === "z"
        ? "x"
        : 0;
    setChartData(newData);

    setStatus(`クリック位置: 列 ${col}, 行 ${row}, 値: ${chartData[row][col]}`);

    drawChart(ctx);
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
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>{status}</div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            cursor: "crosshair",
          }}
        />
      </div>
    </Layout>
  );
}

// // 1. HTML要素を取得し、具体的な型としてキャスト(as ...)します
// // これにより .width や .getContext() が補完されるようになります
// const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
// const statusDiv = document.getElementById('status') as HTMLDivElement;

// // Contextの取得（nullの可能性があるのでチェックを入れるのが安全です）
// const ctx = canvas.getContext('2d');

// if (!ctx) {
//     console.error('Canvas context not found');
//     throw new Error('Canvas context not found');
// }

// // 2. 定数の型定義（推論されるので必須ではありませんが、明示すると丁寧です）
// const CELL_WIDTH: number = 40;
// const CELL_HEIGHT: number = 30;

// // 3. 関数の引数と戻り値に型をつけます
// function drawGrid(): void {
//     // 画面クリア
//     ctx!.clearRect(0, 0, canvas.width, canvas.height);

//     ctx!.strokeStyle = '#e0e0e0';
//     ctx!.lineWidth = 1;

//     // 縦線
//     for (let x = 0; x <= canvas.width; x += CELL_WIDTH) {
//         ctx!.beginPath();
//         ctx!.moveTo(x, 0);
//         ctx!.lineTo(x, canvas.height);
//         ctx!.stroke();
//     }

//     // 横線
//     for (let y = 0; y <= canvas.height; y += CELL_HEIGHT) {
//         ctx!.beginPath();
//         ctx!.moveTo(0, y);
//         ctx!.lineTo(canvas.width, y);
//         ctx!.stroke();
//     }
// }

// function highlightCell(col: number, row: number): void {
//     // グリッド再描画
//     drawGrid();

//     const x: number = col * CELL_WIDTH;
//     const y: number = row * CELL_HEIGHT;

//     // 非nullアサーション演算子 (!) を使って ctx が null でないことを伝えます
//     ctx!.fillStyle = 'rgba(0, 120, 255, 0.5)';
//     ctx!.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);

//     ctx!.strokeStyle = '#0055ff';
//     ctx!.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT);
// }

// // 4. イベントの型指定 (MouseEvent)
// canvas.addEventListener('mousedown', (event: MouseEvent) => {
//     const rect = canvas.getBoundingClientRect();

//     // event.clientX などのプロパティが安全に使えます
//     const mouseX: number = event.clientX - rect.left;
//     const mouseY: number = event.clientY - rect.top;

//     const col: number = Math.floor(mouseX / CELL_WIDTH);
//     const row: number = Math.floor(mouseY / CELL_HEIGHT);

//     if (statusDiv) {
//         statusDiv.textContent = `クリック位置: 列 ${col}, 行 ${row}`;
//     }

//     highlightCell(col, row);
// });

// // 初期描画
// drawGrid();
