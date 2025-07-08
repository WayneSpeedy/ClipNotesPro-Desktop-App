const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build/icon.png')
  });

  // Load the ClipNotesPro web app
  mainWindow.loadURL('https://clipnotespro.net');

  // Inject CSS to hide scrollbars
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS('::-webkit-scrollbar { display: none; }');
  });

  // Remove the default menu
  Menu.setApplicationMenu(null);

  // Open the DevTools in development
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  // Check for updates after the window is created
  autoUpdater.checkForUpdatesAndNotify();
});

let updateWindow = null;

function showUpdateNotification() {
  if (updateWindow) {
    updateWindow.focus();
    return;
  }

  updateWindow = new BrowserWindow({
    width: 500,
    height: 300,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    parent: mainWindow,
    modal: true,
    icon: path.join(__dirname, 'build/icon.png')
  });

  updateWindow.loadFile('update.html');
  updateWindow.once('ready-to-show', () => {
    updateWindow.show();
  });

  updateWindow.on('closed', () => {
    updateWindow = null;
  });
}

// Auto-updater events
autoUpdater.on('update-available', () => {
  log.info('Update available');
  // Optional: Show a notification that an update is being downloaded
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  // Show the update notification window
  showUpdateNotification();
  mainWindow.webContents.send('update_downloaded');
});

// Listen for the restart_app event from the renderer process
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
