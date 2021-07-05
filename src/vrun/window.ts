import { ipcRenderer } from "electron";
import { focusTypeInput, typeInputStr } from "./input";
import { setItems } from "./item";
import { get } from "./config";

export function hideWindow(): void {
  ipcRenderer.send("hideWindow");
}

export function showWindow(): void {
  ipcRenderer.send("showWindow");
}

export function switchWindow(): void {
  ipcRenderer.send("switchWindow");
}

// whether show the window on startup
if (get("app.showOnStartup")) {
  showWindow();
}

ipcRenderer.on("show", () => {
  focusTypeInput();
});

ipcRenderer.on("hide", () => {
  if (get("app.clearOnHide")) {
    typeInputStr.value = "";
    setItems([]);
  }
});
