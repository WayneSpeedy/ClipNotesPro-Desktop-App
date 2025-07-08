const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electron',
    {
        onUpdateAvailable: (callback) => ipcRenderer.on('update_available', () => {
            callback();
        }),
        onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', () => {
            callback();
        }),
        restartApp: () => {
            ipcRenderer.send('restart_app');
        }
    }
);
