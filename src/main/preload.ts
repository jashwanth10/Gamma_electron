// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('api', {
  getData: (db: string, query: any) => ipcRenderer.invoke('get-data', db, query),
  insertData: (db: string, data: any) => ipcRenderer.invoke('insert-data', db, data),
  updateData: (db: string, query: any, update: any) => ipcRenderer.invoke('update-data', db, query, update),
  deleteData: (db: string, query: any) => ipcRenderer.invoke('delete-data', db, query),
  readCsv: (filePath: any) => ipcRenderer.invoke('read-csv', filePath),
  fetchCsvData: () => ipcRenderer.invoke('fetch-csv-data'),
  writeCsv: (filePath: any, content: any) => ipcRenderer.invoke('write-csv', filePath, content),
  getCsvPath: () => ipcRenderer.invoke('get-csv-path')
});

export type ElectronHandler = typeof electronHandler;
