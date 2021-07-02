import path from "path";
import { app, BrowserWindow, Tray, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

// avoid tray object dispear against garbage collection
let tray: Tray;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    frame: false,
    movable: false,
    skipTaskbar: true,
    hasShadow: true,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // linux need reset this option
  win.setSkipTaskbar(true);

  // switch window to show or hide
  const switchWindow = () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  };

  // ipcMain

  // create a tray object
  tray = new Tray(path.join(__static, "vrun-tray.png"));
  tray.setToolTip("jrun");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show / Hide",
        click: switchWindow,
      },
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
    ])
  );

  // window event
  win.on("close", () => {
    win.webContents.send("close");
  });

  // win.on("blur", () => {
  //   win.hide();
  // });

  win.on("show", () => {
    win.webContents.send("show");
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
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
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Exit cleanly on request from parent process in development mode.
if (process.env.NODE_ENV === "development") {
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
