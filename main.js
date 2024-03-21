const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("node:path");
const Watcher = require('./watcher');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  const watcher = new Watcher();

  ipcMain.handle("selectWatchDir", async () => {
    return watcher.selectDir(win);
  });
  ipcMain.handle("getWatchDir", async () => watcher.getDir());
  ipcMain.handle("startWatch", () => watcher.startWatch(win));
  ipcMain.handle("stopWatch", () => watcher.stopWatch());
  ipcMain.handle("isWatching", async () => {
    const result = await watcher.isWatching()
    return result;
  });

  win.loadFile('dist/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})