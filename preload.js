const { contextBridge, ipcRenderer } = require('electron');

// Expose only what you need in the renderer process

contextBridge.exposeInMainWorld('api', {
  getData: (db, query) => ipcRenderer.invoke('get-data', db, query),
  insertData: (db, data) => ipcRenderer.invoke('insert-data', db, data),
  updateData: (db, query, update) => ipcRenderer.invoke('update-data', db, query, update),
  deleteData: (db, query) => ipcRenderer.invoke('delete-data', db, query)
});