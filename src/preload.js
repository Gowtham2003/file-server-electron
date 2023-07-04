// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { getAddresses } from "./main/server";

const api = {
  openDirectory: () => ipcRenderer.invoke("dialog:select-dir"),
  startServer: (path) => ipcRenderer.invoke("server:start", path),
  stopServer: () => ipcRenderer.invoke("server:stop"),
  hosts: () => getAddresses(),
  getHosts: () => ipcRenderer.invoke("app:get-hosts"),
};
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
