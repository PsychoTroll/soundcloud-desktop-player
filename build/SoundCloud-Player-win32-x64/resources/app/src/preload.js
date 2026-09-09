const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  toggleMiniPlayer: () => ipcRenderer.send('toggle-mini-player'),
  onMiniPlayerChanged: (callback) => ipcRenderer.on('mini-player-changed', (_, isMini) => callback(isMini)),
  onMediaControl: (callback) => ipcRenderer.on('media-control', (_, action) => callback(action)),
  updatePlaybackState: (state) => ipcRenderer.send('update-playback-state', state),
  resolveArtistProfile: (url) => ipcRenderer.invoke('resolve-artist-profile', url)
});
