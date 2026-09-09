const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isMiniPlayer = false;
let normalBounds = { width: 1120, height: 740 };
let currentTrackInfo = { title: 'SoundCloud Player', artist: 'Idle', isPlaying: false };

// Generate simple SoundCloud cloud icon as data URL (16x16 / 32x32)
function getTrayIcon() {
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhH7ZY/aBRBHMV/s7t7l1xyiUZRI6I/oI02VlpY2ImNpY2tKNYWgoWFtXawUAQrCwsrCwsrhVjoB6wtFEVEjVEQ0UQCycXlbu92Z3zfe8d7sXeXk0vu4Qe/2bvd2fdm39u9233l2f4/Yg22e1oDrcH/dEAHoA5AHYA6AHUA6gDUAagDUAegDkAdoHYN8PnCqR5Zlh96rv8qjmN726L3c59G52Ym50sD7D/cebV78Ph9y3K2xXE867rRfd8PXtu2c6V/6PDp2em5qTID7Nl/ZNT23DFlVb/j+eFl3/d2V9Xb29q8F7sPnZ2bnJ2qNMD2/j0jtu0c8/3oUhyFvUWhd/f29p3e1n/g4m/z4q8D2wY6Lti28zKKgqGqWts8b8vQzs4vF67f7K4rAHw5f6JH2c6w44Q7qwrt7u3Z0d994kttAc5eGL3sONuHozB4WVVp799z7Fj74KmrVQXo27n7vG1v7fG88H5Vpc31D79pHzy9p6oAvu8fsl3/4Z9w+17+d7W+3s739B8/e29ybrraB8A51f28bXv/34q2jG8f7Bqavj17r9bfa3w/2NHzqK5C6b7lW7dtG9737+7WQH1A1/39e9sHj9+pVbptYf7Wn8uLiyeq3jT6bvf1N9N/KkCd/gUo3190AOoA1AGoA1AHoA5AHYA6AHUA6gDUAagDcJcA2P0G21Y+oY2/0xIAAAAASUVORK5CYII=';
  return nativeImage.createFromDataURL('data:image/png;base64,' + iconBase64);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: normalBounds.width,
    height: normalBounds.height,
    minWidth: 850,
    minHeight: 580,
    backgroundColor: '#111114',
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Global Media Shortcuts
  try {
    globalShortcut.register('MediaPlayPause', () => {
      if (mainWindow) mainWindow.webContents.send('media-control', 'toggle-play');
    });
    globalShortcut.register('MediaNextTrack', () => {
      if (mainWindow) mainWindow.webContents.send('media-control', 'next');
    });
    globalShortcut.register('MediaPreviousTrack', () => {
      if (mainWindow) mainWindow.webContents.send('media-control', 'prev');
    });
  } catch (err) {
    console.error('Failed to register global shortcuts', err);
  }
}

function updateTrayMenu() {
  if (!tray) return;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: currentTrackInfo.title.length > 28 ? currentTrackInfo.title.substring(0, 25) + '...' : currentTrackInfo.title,
      sublabel: currentTrackInfo.artist,
      enabled: false
    },
    { type: 'separator' },
    {
      label: currentTrackInfo.isPlaying ? 'Pause' : 'Play',
      click: () => {
        if (mainWindow) mainWindow.webContents.send('media-control', 'toggle-play');
      }
    },
    {
      label: 'Next Track',
      click: () => {
        if (mainWindow) mainWindow.webContents.send('media-control', 'next');
      }
    },
    {
      label: 'Previous Track',
      click: () => {
        if (mainWindow) mainWindow.webContents.send('media-control', 'prev');
      }
    },
    { type: 'separator' },
    {
      label: isMiniPlayer ? 'Standard Mode' : 'Mini Player Mode',
      click: () => {
        toggleMiniPlayer();
      }
    },
    {
      label: mainWindow && mainWindow.isVisible() ? 'Hide to Tray' : 'Show Player',
      click: () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit SoundCloud Player',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip(`SoundCloud Player: ${currentTrackInfo.title} - ${currentTrackInfo.artist}`);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  const icon = getTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('SoundCloud Desktop Player');
  tray.on('double-click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.focus();
      } else {
        mainWindow.show();
      }
    }
  });
  updateTrayMenu();
}

function toggleMiniPlayer() {
  if (!mainWindow) return;
  isMiniPlayer = !isMiniPlayer;

  if (isMiniPlayer) {
    normalBounds = mainWindow.getBounds();
    mainWindow.setMinimumSize(340, 140);
    mainWindow.setSize(380, 150);
    mainWindow.setResizable(false);
    mainWindow.setAlwaysOnTop(true, 'floating');
  } else {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setResizable(true);
    mainWindow.setMinimumSize(850, 580);
    mainWindow.setBounds(normalBounds);
  }

  mainWindow.webContents.send('mini-player-changed', isMiniPlayer);
  updateTrayMenu();
}

// IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('toggle-mini-player', () => {
  toggleMiniPlayer();
});

ipcMain.on('update-playback-state', (event, info) => {
  currentTrackInfo = { ...currentTrackInfo, ...info };
  updateTrayMenu();
});

// Resolve artist profile and tracklist
ipcMain.handle('resolve-artist-profile', async (event, inputUrl) => {
  try {
    let cleanUrl = inputUrl.trim().split('?')[0].replace(/\/+$/, '');
    if (cleanUrl.endsWith('/tracks') || cleanUrl.endsWith('/albums') || cleanUrl.endsWith('/popular-tracks')) {
      cleanUrl = cleanUrl.substring(0, cleanUrl.lastIndexOf('/'));
    }

    // 1. Fetch oEmbed metadata
    let oembed = {};
    try {
      const oembedRes = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(cleanUrl)}`);
      if (oembedRes.ok) {
        oembed = await oembedRes.json();
      }
    } catch (e) {
      console.warn('oEmbed fetch error:', e);
    }

    // 2. Fetch tracks list from user profile HTML
    const tracksRes = await fetch(`${cleanUrl}/tracks`);
    const html = await tracksRes.text();

    const tracks = [];
    const regex = /<article[^>]*itemtype="http:\/\/schema\.org\/MusicRecording"[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    const artistName = oembed.author_name || oembed.title || cleanUrl.split('/').pop();
    const artistAvatar = oembed.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80';

    while ((match = regex.exec(html)) !== null) {
      const aMatch = match[1].match(/<a[^>]*itemprop="url"[^>]*href="([^"]+)">([^<]+)<\/a>/);
      const timeMatch = match[1].match(/<time[^>]*pubdate>([^<]+)<\/time>/);
      if (aMatch) {
        let trackUrl = aMatch[1];
        if (!trackUrl.startsWith('http')) trackUrl = `https://soundcloud.com${trackUrl}`;
        tracks.push({
          id: 'sc-tr-' + Math.random().toString(36).substr(2, 9),
          title: aMatch[2].replace(/&amp;/g, '&').replace(/&#39;/g, "'"),
          artist: artistName,
          url: trackUrl,
          art: artistAvatar,
          duration: 180000,
          pubDate: timeMatch ? timeMatch[1] : null
        });
      }
    }

    return {
      success: true,
      name: artistName,
      url: cleanUrl,
      avatar: artistAvatar,
      bio: oembed.description || '',
      tracks
    };
  } catch (err) {
    console.error('Failed to resolve artist profile:', err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
