// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, dialog } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

// Save JSON handler
ipcMain.handle("save-json", async (_event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (canceled || !filePath) {
    return { success: false };
  }

  try {
    const fs = require("fs");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Failed to save file:", error);
    return { success: false, error: (error as Error).message };
  }
});

// Load JSON handler
ipcMain.handle("load-json", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"],
  });

  if (canceled || filePaths.length === 0) {
    return { success: false };
  }

  try {
    const fs = require("fs");
    const content = fs.readFileSync(filePaths[0], "utf-8");
    const data = JSON.parse(content);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to load file:", error);
    return { success: false, error: (error as Error).message };
  }
});
