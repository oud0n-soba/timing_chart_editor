import { CELL_HEIGHT, CELL_WIDTH } from "./variable";

let patternSource: HTMLCanvasElement | null = null;

export const drawDataCell0to1 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  // ctx.beginPath();
  // ctx.moveTo(x, y + 5);
  // ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  // ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  // ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
  // ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH, y + 5);
  ctx.stroke();
};

export const drawDataCell0to0 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
  ctx.stroke();
};

export const drawDataCell0tox = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.stroke();

  ctx.strokeStyle = "#ff55ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(x + CELL_WIDTH, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);

  // 斜線パターンの作成と塗りつぶし
  if (!patternSource) {
    patternSource = document.createElement("canvas");
    patternSource.width = 10;
    patternSource.height = 10;
    const pCtx = patternSource.getContext("2d");
    if (pCtx) {
      pCtx.strokeStyle = "#ff55ff";
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      // 左下から右上への斜線
      pCtx.moveTo(0, 10);
      pCtx.lineTo(10, 0);
      pCtx.stroke();
    }
  }

  const pattern = ctx.createPattern(patternSource, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fill();
  }

  ctx.stroke();
};

export const drawDataCellxto0 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#ff55ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x, y + CELL_HEIGHT - 5);

  // 斜線パターンの作成と塗りつぶし
  if (!patternSource) {
    patternSource = document.createElement("canvas");
    patternSource.width = 10;
    patternSource.height = 10;
    const pCtx = patternSource.getContext("2d");
    if (pCtx) {
      pCtx.strokeStyle = "#ff55ff";
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      // 左下から右上への斜線
      pCtx.moveTo(0, 10);
      pCtx.lineTo(10, 0);
      pCtx.stroke();
    }
  }

  const pattern = ctx.createPattern(patternSource, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fill();
  }

  ctx.stroke();

  ctx.strokeStyle = "#0055ff";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);

  ctx.stroke();
};

export const drawDataCell1to0 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
  ctx.stroke();
};

export const drawDataCell1to1 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH, y + 5);
  ctx.stroke();
};

export const drawDataCell1tox = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#0055ff";
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.stroke();

  ctx.strokeStyle = "#ff55ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(x + CELL_WIDTH, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);

  // 斜線パターンの作成と塗りつぶし
  if (!patternSource) {
    patternSource = document.createElement("canvas");
    patternSource.width = 10;
    patternSource.height = 10;
    const pCtx = patternSource.getContext("2d");
    if (pCtx) {
      pCtx.strokeStyle = "#ff55ff";
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      // 左下から右上への斜線
      pCtx.moveTo(0, 10);
      pCtx.lineTo(10, 0);
      pCtx.stroke();
    }
  }

  const pattern = ctx.createPattern(patternSource, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fill();
  }

  ctx.stroke();
};

export const drawDataCellxto1 = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  ctx.strokeStyle = "#ff55ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH / 2, y + CELL_HEIGHT - 5);
  ctx.lineTo(x, y + CELL_HEIGHT - 5);

  // 斜線パターンの作成と塗りつぶし
  if (!patternSource) {
    patternSource = document.createElement("canvas");
    patternSource.width = 10;
    patternSource.height = 10;
    const pCtx = patternSource.getContext("2d");
    if (pCtx) {
      pCtx.strokeStyle = "#ff55ff";
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      // 左下から右上への斜線
      pCtx.moveTo(0, 10);
      pCtx.lineTo(10, 0);
      pCtx.stroke();
    }
  }

  const pattern = ctx.createPattern(patternSource, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fill();
  }

  ctx.stroke();

  ctx.strokeStyle = "#0055ff";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(x + CELL_WIDTH / 2, y + 5);
  ctx.lineTo(x + CELL_WIDTH, y + 5);

  ctx.stroke();
};

export const drawDataCellxtox = (
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number
) => {
  const x = col * CELL_WIDTH;
  const y = row * CELL_HEIGHT;

  // 斜線パターンの作成
  if (!patternSource) {
    patternSource = document.createElement("canvas");
    patternSource.width = 10;
    patternSource.height = 10;
    const pCtx = patternSource.getContext("2d");
    if (pCtx) {
      pCtx.strokeStyle = "#ff55ff";
      pCtx.lineWidth = 1;
      pCtx.beginPath();
      // 左下から右上への斜線
      pCtx.moveTo(0, 10);
      pCtx.lineTo(10, 0);
      pCtx.stroke();
    }
  }

  // 塗りつぶし
  const pattern = ctx.createPattern(patternSource, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.beginPath();
    ctx.rect(x, y + 5, CELL_WIDTH, CELL_HEIGHT - 10);
    ctx.fill();
  }

  // 枠線の描画
  ctx.strokeStyle = "#ff55ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(x + CELL_WIDTH, y + CELL_HEIGHT - 5);
  ctx.lineTo(x, y + CELL_HEIGHT - 5);
  ctx.moveTo(x, y + 5);
  ctx.lineTo(x + CELL_WIDTH, y + 5);
  ctx.stroke();
};
