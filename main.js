const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const audioFolderPath = path.join(__dirname, '/src/assets/audio/lofi-hip-hop');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
    },
  });

  win.loadFile('./dist/desktop_pomodoro_timer/index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('list:audioFiles', async () => {
    const files = await getAllAudioFiles();
    return files;
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit();
  }
});

async function getAllAudioFiles() {
  try {
    const files = await readdir(audioFolderPath);
    return files;
  } catch (err) {
    console.log(err);
    return [];
  }
}
