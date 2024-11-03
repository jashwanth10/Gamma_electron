const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const Datastore = require('nedb')
const startUrl = url.format({
  pathname: path.join(__dirname, './gamma/build/index.html'),
  protocol: 'file',
})

const datastore = {
  "profilesDb": new Datastore({ filename: './db/profiles.db', autoload: true }),
  "peaksDb": new Datastore({filename: './db/peaks.db', autoload: true}),
  "activityPeaksDb": new Datastore({filename: './db/activityPeaks.db', autoload: true})
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Point to your preload script
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  })
  win.removeMenu()
  win.loadURL("http://localhost:3000")
  win.openDevTools();

  ipcMain.handle('get-data', async (event, db, query) => {
    return new Promise((resolve, reject) => {
      datastore[db].find(query, (err, docs) => {
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
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })