const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  getAudioFiles: () => {
    return ipcRenderer.invoke('list:audioFiles');
  }
});
