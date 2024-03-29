"use strict";

import { app, protocol, BrowserWindow, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
const { autoUpdater } = require("electron-updater");
import log from "electron-log";

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

const isDevelopment = process.env.NODE_ENV !== "production";

const fixPath = require("fix-path");
fixPath();
import { spawn } from "child_process";

//const test = spawn('node', [process.resourcePath + '/extra/server.js']);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  const isWin = process.platform === "win32";

  const apiLocation = isWin ? path.join(
    path.dirname(__dirname),
    "extra",
    "ceres-api",
    "dist",
    "index-win.js"
  ) : path.join(
    path.dirname(__dirname),
    "extra",
    "ceres-api",
    "dist",
    "index.js"
  );
  console.log(`Starting ceres-api from ${apiLocation}`);
  let ceresApi = spawn("node", [apiLocation]);
  // Create the browser window.
  win = new BrowserWindow({
    width: 980,
    height: 800,
    backgroundColor: "#222",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegrationInWorker: true,
      // devTools: false
    },
    icon: path.join(__dirname, "../build/512x512.png"),
  });

  win.show();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  console.log("checking for update");

  const updateExists = await autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.once("update-downloaded", async (info) => {
    let options = {
      title: "Ceres Update available to install",
      buttons: ["Yes", "Cancel"],
      message: `A new Ceres update has been downloaded and is available for you to install. (${info.version} - ${info.releaseName}). You have to restart the app to apply the update. Do you want to update to the newest version?`,
    };

    let dialogResponse = await dialog.showMessageBox(options);

    console.log(dialogResponse.response);
    if (dialogResponse.response === 0) {
      setImmediate(() => {
        app.removeAllListeners("window-all-closed");
        if (win != null) {
          win.destroy();
        }
        autoUpdater.quitAndInstall(false);
      });
    }
  });

  console.log("update-exists", updateExists);

  win.on("closed", () => {
    ceresApi.kill();
    win = null;
  });
  ceresApi.stdout.on("data", (data) => {
    console.log(data.toString());
    win.show();
  });

  ceresApi.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  ceresApi.on("close", (code) => {
    console.log(`ceresApi process exited with code ${code}`);
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
