const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('app', {
  getWatchDir: () => ipcRenderer.invoke("getWatchDir"),
  selectWatchDir: () => ipcRenderer.invoke("selectWatchDir"),
  startWatch: () => ipcRenderer.invoke("startWatch"),
  stopWatch: () => ipcRenderer.invoke("stopWatch"),
  isWatching: () => ipcRenderer.invoke("isWatching"),
  onFileChanged: (callback) => ipcRenderer.on("file-changed", (_event, value) => callback(value)),
});