const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
  });

  win.webContents.openDevTools();

  win.loadFile('./dist/desktop_pomodoro_timer/index.html');
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit();
  }
});
