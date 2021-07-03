import path from "path";
import os from "os";
import { ipcRenderer } from "electron";

export const VHOME = path.join(os.homedir(), ".vrun");

export const [screenWidth, screenHeight] = ipcRenderer.sendSync(
  "getScreenSize"
) as [number, number];
