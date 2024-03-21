const { watch } = require('node:fs');
const path = require("node:path");
const {Storage} = require('@google-cloud/storage');
const CREDENTIALS = require("./credentials/windview-windsond-upload.json");
const { dialog } = require('electron');
const Store = require('electron-store');

const EVENT_IGNORE_TIMEOUT = 1000;
const BUCKET_NAME = "windview-windsond-data1";

class Watcher {
  constructor() {
    this.store = new Store();
    this.dir = this.store.get("watch-dir") || "";
    this.watching = false;
    this.ac = null;
    this.ignoreFiles = {};
  }

  async selectDir(win) {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    if(!result.canceled) {
      const dir = result.filePaths[0];
      this.setDir(dir);
    }
    return this.dir;
  }

  async setDir(value) {
    this.dir = value;
    this.store.set("watch-dir", this.dir);
    return this.dir;
  }

  async getDir() {
    return this.dir;
  }

  isWatching() {
    return this.watching;
  }

  startWatch(win) {
    if(!this.watching) {
      this.ignoreFiles = {};
      this.ac = new AbortController();
      const { signal } = this.ac;
    
      try {
        watch(this.dir, {
          recursive: false,
          signal,
        }, (eventType, filename) => {
          if(eventType !== "change") {
            return ;
          }
          const fullpath = path.join(this.dir, filename);

          if(!this.ignoreFiles[fullpath]) {
            this.ignoreFiles[fullpath] = true;
            uploadFileToGcs(this.dir, filename);
            win.webContents.send("file-changed", fullpath);

            setTimeout(() => {
              this.ignoreFiles[fullpath] = false;
            }, EVENT_IGNORE_TIMEOUT);
          }    
        });
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("abort")
          return ;
        }
        throw err;
      }    

      this.watching = true;
    }
  }

  stopWatch() {
    if(this.ac) {
      this.ac.abort();
    }
    this.watching = false;
  }
}

const uploadFileToGcs = async (dir, file) => {
  const storage = new Storage({credentials: CREDENTIALS});
  const options = {
    destination: file,
  };
  const fullpath = path.join(dir, file);
  await storage.bucket(BUCKET_NAME).upload(fullpath, options);
};

module.exports = Watcher;