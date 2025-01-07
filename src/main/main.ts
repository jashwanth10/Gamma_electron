/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs, { PathLike } from 'fs'
const Datastore = require('nedb');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'db');
let csvPath: PathLike = "";

if (process.env.NODE_ENV === 'production') {
  csvPath = path.join(userDataPath, 'csv');
  if (!fs.existsSync(csvPath)) {
    fs.mkdirSync(csvPath, { recursive: true });
  }
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
  csvPath = path.join(__dirname, "../../csv");
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};



const datastore = {
  "profilesDb": new Datastore({ filename: path.join(dbPath, 'profiles.db'), autoload: true }),
  "peaksDb": new Datastore({ filename: path.join(dbPath, 'peaks.db'), autoload: true }),
  "activityPeaksDb": new Datastore({ filename: path.join(dbPath, 'activityPeaks.db'), autoload: true })
};

const csvFiles = ["background.csv",  "efficiency.csv", "count_rate.csv", "efficiency_v2.csv", "emission_rate.csv"]


function copyDatabaseFiles() {
  const resourcePath = process.env.NODE_ENV === 'development' 
    ? path.join(__dirname, '../..', 'db') 
    : path.join(process.resourcesPath, 'db');
  
  const csvResourcePath = process.env.NODE_ENV === 'development' 
  ? path.join(__dirname, '../..', 'csv') 
  : path.join(process.resourcesPath, 'csv');

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }
  
  ['profiles.db', 'peaks.db', 'activityPeaks.db'].forEach(file => {
    const src = path.join(resourcePath, file);
    const dest = path.join(dbPath, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  });

  ["background.csv",  "efficiency.csv", "count_rate.csv", "efficiency_v2.csv", "emission_rate.csv"].forEach(file => {
    const src = path.join(csvResourcePath, file);
    const dest = path.join(csvPath.toString(), file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  })
}

copyDatabaseFiles();

ipcMain.handle('get-data', async (event, db, query) => {
  return new Promise((resolve, reject) => {
    datastore[db].find(query, (err: any, docs: any) => {
      if (err) {
        return reject(err);
      }
      resolve(docs);
    });
  });
});

ipcMain.handle('insert-data', async (event, db, data) => {
  return new Promise((resolve, reject) => {
    datastore[db].insert(data, (err, newDoc) => {
      if (err) {
        return reject(err);
      }
      resolve(newDoc);
    });
  });
});

ipcMain.handle('update-data', async (event, db, query, update) => {
  return new Promise((resolve, reject) => {
    datastore[db].update(query, update, { multi: true }, (err, numAffected) => {
      if (err) {
        return reject(err);
      }
      resolve(numAffected);
    });
  });
});

ipcMain.handle('delete-data', async (event, db, query) => {
  return new Promise((resolve, reject) => {
    datastore[db].remove(query, { multi: true }, (err, numRemoved) => {
      if (err) {
        return reject(err);
      }
      resolve(numRemoved);
    });
  });
});

ipcMain.handle('read-csv', async (event, fileName) => {
  return new Promise((resolve, reject) => {
      const filePath = path.join(csvPath, fileName);
      fs.open(filePath, 'r', (err, fd) => { // Open the file in read mode
        if (err) {
          return reject(err);
        }
  
        fs.readFile(fd, 'utf-8', (readErr, data) => {
          fs.close(fd, (closeErr) => { // Close the file descriptor after reading
            if (closeErr) {
              console.error('Error closing file:', closeErr);
            }
          });
  
          if (readErr) {
            return reject(readErr);
          }
          resolve(data);
        });
      });
  });
});

ipcMain.handle('fetch-csv-data', async (event) => {
  try {
    const filePromises = csvFiles.map(fileName => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(csvPath, fileName);
        fs.open(filePath, 'r', (err, fd) => { // Open the file in read mode
          if (err) {
            return reject(err);
          }

          fs.readFile(fd, 'utf-8', (readErr, data) => {
            fs.close(fd, (closeErr) => { // Close the file descriptor after reading
              if (closeErr) {
                console.error('Error closing file:', closeErr);
              }
            });

            if (readErr) {
              return reject(readErr);
            }
            resolve(data);
          });
        });
      });
    });
  
    // Wait for all files to be read
    const allFilesData = await Promise.all(filePromises);
    return allFilesData; // Return an array of all the CSV file data
  
  } catch (error) {
   
    console.error("Error reading CSV files:", error);
    throw error; // Propagate error to the renderer process
  
  }
});

ipcMain.handle('write-csv', async (event, fileName, content) => {
  return new Promise((resolve, reject) => {
      const filePath = path.join(csvPath, fileName);
      fs.open(filePath, 'w', (err, fd) => { // Open the file in write mode
        if (err) {
          return reject(err);
        }
  
        fs.writeFile(fd, content, 'utf-8', (writeErr) => {
          fs.close(fd, (closeErr) => { // Close the file descriptor after writing
            if (closeErr) {
              console.error('Error closing file:', closeErr);
            }
          });
  
          if (writeErr) {
            return reject(writeErr);
          }
          resolve(null);
        });
      });
  });
});

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });


  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  mainWindow.removeMenu()


  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
