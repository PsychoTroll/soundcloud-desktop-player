// Curated high-quality tracks available across SoundCloud genres
const CURATED_TRACKS = [
  {
    id: "lofi-1",
    title: "ChilledCow - Lofi Hip Hop Radio Beats",
    artist: "Lofi Girl / ChilledCow",
    genre: "lofi",
    url: "https://soundcloud.com/chilledcow/beats-to-relax-study-to",
    art: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80",
    duration: 180000
  },
  {
    id: "lofi-2",
    title: "Affection",
    artist: "Jinsang",
    genre: "lofi",
    url: "https://soundcloud.com/jinsangbeats/affection",
    art: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80",
    duration: 134000
  },
  {
    id: "synth-1",
    title: "Resonance",
    artist: "HOME",
    genre: "synthwave",
    url: "https://soundcloud.com/home-2001/resonance",
    art: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    duration: 212000
  },
  {
    id: "synth-2",
    title: "Nightcall (Drive OST)",
    artist: "Kavinsky",
    genre: "synthwave",
    url: "https://soundcloud.com/deadcruiser/nightcall",
    art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    duration: 259000
  },
  {
    id: "edm-1",
    title: "Spectre",
    artist: "Alan Walker",
    genre: "electronic",
    url: "https://soundcloud.com/alanwalker/alan-walker-spectre",
    art: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    duration: 230000
  },
  {
    id: "edm-2",
    title: "Alone",
    artist: "Marshmello",
    genre: "electronic",
    url: "https://soundcloud.com/marshmellomusic/alone",
    art: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
    duration: 273000
  },
  {
    id: "game-1",
    title: "On & On (feat. Daniel Levi)",
    artist: "Cartoon / NCS",
    genre: "gaming",
    url: "https://soundcloud.com/nocopyrightsounds/cartoon-on-on-feat-daniel-levi-ncs-release",
    art: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80",
    duration: 208000
  },
  {
    id: "game-2",
    title: "Unity",
    artist: "TheFatRat",
    genre: "gaming",
    url: "https://soundcloud.com/thefatrat/thefatrat-unity-1",
    art: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80",
    duration: 249000
  },
  {
    id: "hiphop-1",
    title: "Lucid Dreams",
    artist: "Juice WRLD",
    genre: "hiphop",
    url: "https://soundcloud.com/uiceheidd/lucid-dreams-forget-me",
    art: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    duration: 239000
  },
  {
    id: "ambient-1",
    title: "Weightless",
    artist: "Marconi Union",
    genre: "ambient",
    url: "https://soundcloud.com/justambient/marconi-union-weightless",
    art: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80",
    duration: 480000
  }
];

class SoundcloudApp {
  constructor() {
    this.queue = [...CURATED_TRACKS];
    this.currentIndex = 0;
    this.currentTrack = this.queue[0];
    this.favorites = JSON.parse(localStorage.getItem('sc_favorites') || '[]');
    this.history = JSON.parse(localStorage.getItem('sc_history') || '[]');
    this.savedArtists = JSON.parse(localStorage.getItem('sc_saved_artists') || '[]');
    this.activeArtist = null;
    this.isShuffle = false;
    this.repeatMode = 'all'; // 'all', 'one', 'none'
    this.isMuted = false;
    this.lastVolume = 80;
    this.isPlaying = false;
    this.currentPosition = 0;
    this.totalDuration = 0;
    this.isSeeking = false;

    this.initEngine();
    this.initDOMElements();
    this.bindEvents();
    this.renderDiscover(CURATED_TRACKS);
    this.renderSidebarArtists();
    this.updateQueueView();
    this.updateFavoritesView();
    this.updateHistoryView();
    this.updatePlayerUI();
    this.initVisualizer();
  }

  initEngine() {
    const frame = document.getElementById('sc-widget-frame');
    this.sc = new SoundcloudEngine(frame, (eventType, data) => {
      this.handleEngineEvent(eventType, data);
    });
  }

  initDOMElements() {
    // Buttons & Inputs
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.iconPlay = document.getElementById('icon-play');
    this.iconPause = document.getElementById('icon-pause');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');
    this.btnShuffle = document.getElementById('btn-shuffle');
    this.btnRepeat = document.getElementById('btn-repeat');
    this.btnLikeCurrent = document.getElementById('btn-like-current');
    this.btnVolumeIcon = document.getElementById('btn-volume-icon');
    this.volHigh = document.getElementById('vol-high');
    this.volMuted = document.getElementById('vol-muted');
    this.volumeSlider = document.getElementById('volume-slider');

    // Scrubber
    this.currentTimeEl = document.getElementById('current-time');
    this.totalTimeEl = document.getElementById('total-time');
    this.progressWrapper = document.getElementById('progress-wrapper');
    this.progressFill = document.getElementById('progress-fill');
    this.progressHandle = document.getElementById('progress-handle');

    // Track Info
    this.playerTitle = document.getElementById('player-title');
    this.playerArtist = document.getElementById('player-artist');
    this.currentArt = document.getElementById('current-art');
    this.soundWaveAnim = document.getElementById('sound-wave-anim');

    // Mini Player
    this.miniArtwork = document.getElementById('mini-artwork');
    this.miniTitle = document.getElementById('mini-title');
    this.miniArtist = document.getElementById('mini-artist');
    this.miniProgressFill = document.getElementById('mini-progress-fill');
    this.btnMiniPlay = document.getElementById('btn-mini-play');
    this.miniIconPlay = document.getElementById('mini-icon-play');
    this.miniIconPause = document.getElementById('mini-icon-pause');
    this.btnMiniPrev = document.getElementById('btn-mini-prev');
    this.btnMiniNext = document.getElementById('btn-mini-next');
    this.btnMiniRestore = document.getElementById('btn-mini-restore');

    // Search & URL
    this.globalSearchInput = document.getElementById('global-search-input');
    this.btnQuickPlay = document.getElementById('btn-quick-play');
    this.sidebarUrlInput = document.getElementById('sidebar-url-input');
    this.btnSidebarPlayUrl = document.getElementById('btn-sidebar-play-url');

    // Hero & Navigation
    this.btnHeroPlay = document.getElementById('btn-hero-play');
    this.btnHeroQueue = document.getElementById('btn-hero-queue');

    // Artist View Elements
    this.sidebarArtistsList = document.getElementById('sidebar-artists-list');
    this.artistAvatar = document.getElementById('artist-avatar');
    this.artistName = document.getElementById('artist-name');
    this.artistBio = document.getElementById('artist-bio');
    this.artistHeroBackdrop = document.getElementById('artist-hero-backdrop');
    this.artistTracksCount = document.getElementById('artist-tracks-count');
    this.artistTrackList = document.getElementById('artist-track-list');
    this.artistSearchFilter = document.getElementById('artist-search-filter');
    this.btnArtistPlayAll = document.getElementById('btn-artist-play-all');
    this.btnArtistShuffle = document.getElementById('btn-artist-shuffle');
    this.btnArtistQueueAll = document.getElementById('btn-artist-queue-all');
    this.toastNotify = document.getElementById('toast-notify');
  }

  bindEvents() {
    // Titlebar Window Controls
    document.getElementById('btn-win-min')?.addEventListener('click', () => window.electronAPI?.minimize());
    document.getElementById('btn-win-max')?.addEventListener('click', () => window.electronAPI?.maximize());
    document.getElementById('btn-win-close')?.addEventListener('click', () => window.electronAPI?.close());
    document.getElementById('btn-mini-mode')?.addEventListener('click', () => window.electronAPI?.toggleMiniPlayer());
    this.btnMiniRestore?.addEventListener('click', () => window.electronAPI?.toggleMiniPlayer());

    // Mini player state update from main process
    window.electronAPI?.onMiniPlayerChanged((isMini) => {
      if (isMini) {
        document.body.classList.add('mini-mode');
      } else {
        document.body.classList.remove('mini-mode');
      }
    });

    // Global media shortcuts from Electron main process
    window.electronAPI?.onMediaControl((action) => {
      if (action === 'toggle-play') this.togglePlay();
      if (action === 'next') this.playNext();
      if (action === 'prev') this.playPrev();
    });

    // Playback Controls
    this.btnPlayPause.addEventListener('click', () => this.togglePlay());
    this.btnMiniPlay.addEventListener('click', () => this.togglePlay());
    this.btnNext.addEventListener('click', () => this.playNext());
    this.btnMiniNext.addEventListener('click', () => this.playNext());
    this.btnPrev.addEventListener('click', () => this.playPrev());
    this.btnMiniPrev.addEventListener('click', () => this.playPrev());

    this.btnShuffle.addEventListener('click', () => {
      this.isShuffle = !this.isShuffle;
      this.btnShuffle.classList.toggle('active', this.isShuffle);
    });

    this.btnRepeat.addEventListener('click', () => {
      if (this.repeatMode === 'all') {
        this.repeatMode = 'one';
        this.btnRepeat.classList.add('active');
        this.btnRepeat.title = 'Repeat One Track';
      } else if (this.repeatMode === 'one') {
        this.repeatMode = 'none';
        this.btnRepeat.classList.remove('active');
        this.btnRepeat.title = 'Repeat Off';
      } else {
        this.repeatMode = 'all';
        this.btnRepeat.classList.add('active');
        this.btnRepeat.title = 'Repeat All Queue';
      }
    });

    this.btnLikeCurrent.addEventListener('click', () => this.toggleFavorite(this.currentTrack));
    document.getElementById('btn-queue-current')?.addEventListener('click', () => {
      if (this.currentTrack) {
        this.addToQueue(this.currentTrack, false);
        this.showToast(`Added "${this.currentTrack.title}" to Queue`);
      }
    });

    // Scrubber click & drag
    this.progressWrapper.addEventListener('click', (e) => this.handleSeek(e));

    // Volume Controls
    this.volumeSlider.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value);
      this.setVolume(vol);
    });

    this.btnVolumeIcon.addEventListener('click', () => {
      if (this.isMuted) {
        this.setVolume(this.lastVolume || 80);
      } else {
        this.lastVolume = parseInt(this.volumeSlider.value);
        this.setVolume(0);
      }
    });

    // Navigation Switcher
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.clearActiveNav();
        btn.classList.add('active');
        const viewName = btn.dataset.view;
        this.switchView(viewName);
      });
    });

    // Genre filter pills
    document.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const genre = pill.dataset.genre;
        if (genre === 'all') {
          this.renderDiscover(CURATED_TRACKS);
        } else {
          this.renderDiscover(CURATED_TRACKS.filter((t) => t.genre === genre));
        }
      });
    });

    // URL & Search Submissions
    this.btnQuickPlay.addEventListener('click', () => this.handleSearchOrUrl(this.globalSearchInput.value));
    this.globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSearchOrUrl(this.globalSearchInput.value);
    });

    this.btnSidebarPlayUrl.addEventListener('click', () => {
      if (this.sidebarUrlInput.value.trim()) {
        this.handleUrlInput(this.sidebarUrlInput.value.trim());
        this.sidebarUrlInput.value = '';
      }
    });
    this.sidebarUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.sidebarUrlInput.value.trim()) {
        this.handleUrlInput(this.sidebarUrlInput.value.trim());
        this.sidebarUrlInput.value = '';
      }
    });

    // Hero buttons
    this.btnHeroPlay.addEventListener('click', () => {
      this.playTrackAtIndex(0);
    });
    this.btnHeroQueue.addEventListener('click', () => {
      this.addToQueue(CURATED_TRACKS[0]);
    });

    // Artist View Actions
    this.btnArtistPlayAll?.addEventListener('click', () => {
      if (!this.activeArtist || !this.activeArtist.tracks || this.activeArtist.tracks.length === 0) return;
      this.queue = [...this.activeArtist.tracks];
      this.updateQueueView();
      this.playTrackAtIndex(0);
      this.showToast(`Playing all tracks from ${this.activeArtist.name}`);
    });

    this.btnArtistShuffle?.addEventListener('click', () => {
      if (!this.activeArtist || !this.activeArtist.tracks || this.activeArtist.tracks.length === 0) return;
      const shuffled = [...this.activeArtist.tracks].sort(() => Math.random() - 0.5);
      this.queue = shuffled;
      this.updateQueueView();
      this.playTrackAtIndex(0);
      this.showToast(`Shuffling tracks from ${this.activeArtist.name}`);
    });

    this.btnArtistQueueAll?.addEventListener('click', () => {
      if (!this.activeArtist || !this.activeArtist.tracks || this.activeArtist.tracks.length === 0) return;
      this.activeArtist.tracks.forEach((t) => {
        if (!this.queue.some((q) => q.url === t.url)) {
          this.queue.push(t);
        }
      });
      this.updateQueueView();
      this.showToast(`Added ${this.activeArtist.tracks.length} tracks to queue`);
    });

    this.artistSearchFilter?.addEventListener('input', (e) => {
      if (!this.activeArtist) return;
      const filter = e.target.value.toLowerCase().trim();
      const filtered = this.activeArtist.tracks.filter((t) => t.title.toLowerCase().includes(filter));
      this.artistTracksCount.textContent = filtered.length;
      this.renderTrackList(this.artistTrackList, filtered);
    });

    // Queue button toggle
    document.getElementById('btn-toggle-queue')?.addEventListener('click', () => {
      document.querySelector('.nav-item[data-view="queue"]')?.click();
    });

    document.getElementById('btn-clear-queue')?.addEventListener('click', () => {
      this.queue = [];
      this.updateQueueView();
    });

    document.getElementById('btn-clear-history')?.addEventListener('click', () => {
      this.history = [];
      localStorage.setItem('sc_history', JSON.stringify([]));
      this.updateHistoryView();
    });

    // Keyboard Shortcuts (Space, Arrow Keys, M, N, P)
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.seekRelative(5000);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.seekRelative(-5000);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        this.setVolume(Math.min(100, parseInt(this.volumeSlider.value) + 5));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        this.setVolume(Math.max(0, parseInt(this.volumeSlider.value) - 5));
      } else if (e.key === 'm' || e.key === 'M') {
        this.btnVolumeIcon.click();
      } else if (e.key === 'n' || e.key === 'N') {
        this.playNext();
      } else if (e.key === 'p' || e.key === 'P') {
        this.playPrev();
      }
    });
  }

  handleEngineEvent(eventType, data) {
    if (eventType === 'play') {
      this.isPlaying = true;
      this.updatePlayStateUI(true);
      this.addToHistory(this.currentTrack);
      this.notifyNative();
    } else if (eventType === 'pause') {
      this.isPlaying = false;
      this.updatePlayStateUI(false);
      this.notifyNative();
    } else if (eventType === 'progress') {
      this.currentPosition = data.position;
      this.totalDuration = data.duration;
      this.updateScrubber(data.position, data.duration);
    } else if (eventType === 'finish') {
      this.handleTrackFinish();
    } else if (eventType === 'trackinfo' && data) {
      if (data.title) {
        this.currentTrack.title = data.title;
      }
      if (data.user && data.user.username) {
        this.currentTrack.artist = data.user.username;
      }
      if (data.artwork_url) {
        this.currentTrack.art = data.artwork_url.replace('-large', '-t500x500');
      }
      if (data.duration) {
        this.currentTrack.duration = data.duration;
      }
      this.updatePlayerUI();
      this.notifyNative();
    }
  }

  handleTrackFinish() {
    if (this.repeatMode === 'one') {
      this.sc.seekTo(0);
      this.sc.play();
    } else {
      this.playNext();
    }
  }

  togglePlay() {
    if (!this.currentTrack) {
      if (this.queue.length > 0) this.playTrackAtIndex(0);
      return;
    }
    this.sc.toggle();
  }

  playTrackAtIndex(index) {
    if (index < 0 || index >= this.queue.length) return;
    this.currentIndex = index;
    this.currentTrack = this.queue[index];
    this.updatePlayerUI();
    this.sc.load(this.currentTrack.url, true);
  }

  playNext() {
    if (this.queue.length === 0) return;
    let nextIndex;
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * this.queue.length);
    } else {
      nextIndex = this.currentIndex + 1;
      if (nextIndex >= this.queue.length) {
        if (this.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // end of queue
        }
      }
    }
    this.playTrackAtIndex(nextIndex);
  }

  playPrev() {
    if (this.queue.length === 0) return;
    // If more than 3 seconds in, restart track
    if (this.currentPosition > 3000) {
      this.sc.seekTo(0);
      return;
    }
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) prevIndex = this.queue.length - 1;
    this.playTrackAtIndex(prevIndex);
  }

  handleSeek(e) {
    const rect = this.progressWrapper.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetMs = ratio * (this.totalDuration || this.currentTrack.duration || 180000);
    this.sc.seekTo(targetMs);
  }

  seekRelative(msDelta) {
    const target = Math.max(0, Math.min(this.totalDuration, this.currentPosition + msDelta));
    this.sc.seekTo(target);
  }

  setVolume(val) {
    this.volumeSlider.value = val;
    this.isMuted = val === 0;
    this.sc.setVolume(val);

    if (this.isMuted) {
      this.volHigh.style.display = 'none';
      this.volMuted.style.display = 'block';
    } else {
      this.volHigh.style.display = 'block';
      this.volMuted.style.display = 'none';
    }
  }

  updatePlayStateUI(isPlaying) {
    this.isPlaying = isPlaying;
    if (isPlaying) {
      this.iconPlay.style.display = 'none';
      this.iconPause.style.display = 'block';
      this.miniIconPlay.style.display = 'none';
      this.miniIconPause.style.display = 'block';
      this.soundWaveAnim.classList.add('playing');
    } else {
      this.iconPlay.style.display = 'block';
      this.iconPause.style.display = 'none';
      this.miniIconPlay.style.display = 'block';
      this.miniIconPause.style.display = 'none';
      this.soundWaveAnim.classList.remove('playing');
    }
  }

  updateScrubber(positionMs, durationMs) {
    const total = durationMs || this.currentTrack?.duration || 1;
    const pct = Math.min(100, Math.max(0, (positionMs / total) * 100));

    this.progressFill.style.width = pct + '%';
    this.progressHandle.style.left = pct + '%';
    this.miniProgressFill.style.width = pct + '%';

    this.currentTimeEl.textContent = this.formatTime(positionMs);
    this.totalTimeEl.textContent = this.formatTime(total);
  }

  updatePlayerUI() {
    if (!this.currentTrack) return;
    this.playerTitle.textContent = this.currentTrack.title;
    this.playerArtist.textContent = this.currentTrack.artist;
    this.currentArt.src = this.currentTrack.art;

    this.miniTitle.textContent = this.currentTrack.title;
    this.miniArtist.textContent = this.currentTrack.artist;
    this.miniArtwork.src = this.currentTrack.art;

    const isFav = this.favorites.some((f) => f.url === this.currentTrack.url);
    this.btnLikeCurrent.classList.toggle('liked', isFav);

    this.updateQueueHighlight();
  }

  notifyNative() {
    window.electronAPI?.updatePlaybackState({
      title: this.currentTrack ? this.currentTrack.title : 'SoundCloud Player',
      artist: this.currentTrack ? this.currentTrack.artist : 'Idle',
      isPlaying: this.isPlaying
    });
  }

  formatTime(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  clearActiveNav() {
    document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.artist-nav-item').forEach((b) => b.classList.remove('active'));
  }

  showToast(msg) {
    if (!this.toastNotify) return;
    this.toastNotify.textContent = msg;
    this.toastNotify.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastNotify.classList.remove('show');
    }, 3500);
  }

  isArtistUrl(url) {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (!u.hostname.includes('soundcloud.com')) return false;
      const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/');
      // e.g. ["chilledcow"] or ["chilledcow", "tracks"] or ["chilledcow", "albums"]
      if (parts.length === 1 && !['discover', 'stream', 'upload', 'you', 'search'].includes(parts[0])) {
        return true;
      }
      if (parts.length === 2 && ['tracks', 'albums', 'sets', 'popular-tracks'].includes(parts[1])) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async handleUrlInput(url) {
    if (this.isArtistUrl(url)) {
      await this.loadArtistProfile(url);
    } else {
      this.loadSoundCloudTrackUrl(url);
    }
  }

  async loadArtistProfile(url) {
    this.showToast('Fetching artist profile & tracks...');
    let artistData = null;

    if (window.electronAPI?.resolveArtistProfile) {
      const res = await window.electronAPI.resolveArtistProfile(url);
      if (res && res.success) {
        artistData = res;
      }
    }

    if (!artistData) {
      this.showToast('Could not load artist profile.');
      return;
    }

    // Save to savedArtists if not already present
    const existingIdx = this.savedArtists.findIndex((a) => a.url === artistData.url);
    if (existingIdx >= 0) {
      this.savedArtists[existingIdx] = artistData;
    } else {
      this.savedArtists.unshift(artistData);
    }

    localStorage.setItem('sc_saved_artists', JSON.stringify(this.savedArtists));
    this.renderSidebarArtists();
    this.openArtistView(artistData);
    this.showToast(`Added ${artistData.name} to ARTISTS on the left!`);
  }

  renderSidebarArtists() {
    this.sidebarArtistsList.innerHTML = '';
    if (this.savedArtists.length === 0) {
      this.sidebarArtistsList.innerHTML = `
        <div class="empty-artists-hint">Paste an artist link to pin them here</div>
      `;
      return;
    }

    this.savedArtists.forEach((artist, index) => {
      const btn = document.createElement('button');
      btn.className = `artist-nav-item ${this.activeArtist && this.activeArtist.url === artist.url ? 'active' : ''}`;
      btn.dataset.artistUrl = artist.url;
      btn.innerHTML = `
        <img class="artist-nav-avatar" src="${artist.avatar}" alt="${artist.name}" />
        <span class="artist-nav-name" title="${artist.name}">${artist.name}</span>
        <span class="artist-unpin-btn" title="Unpin Artist">&times;</span>
      `;

      btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('artist-unpin-btn')) return;
        this.openArtistView(artist);
      });

      const unpinBtn = btn.querySelector('.artist-unpin-btn');
      unpinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.savedArtists.splice(index, 1);
        localStorage.setItem('sc_saved_artists', JSON.stringify(this.savedArtists));
        if (this.activeArtist && this.activeArtist.url === artist.url) {
          document.querySelector('.nav-item[data-view="discover"]')?.click();
        }
        this.renderSidebarArtists();
        this.showToast(`Removed ${artist.name}`);
      });

      this.sidebarArtistsList.appendChild(btn);
    });
  }

  openArtistView(artist) {
    this.activeArtist = artist;
    this.clearActiveNav();

    // Highlight active artist in sidebar
    document.querySelectorAll('.artist-nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.artistUrl === artist.url);
    });

    // Populate Artist Hero
    this.artistAvatar.src = artist.avatar;
    this.artistName.textContent = artist.name;
    this.artistBio.textContent = artist.bio || 'SoundCloud Creator & Musician';
    this.artistHeroBackdrop.style.backgroundImage = `url(${artist.avatar})`;
    this.artistTracksCount.textContent = artist.tracks ? artist.tracks.length : 0;
    this.artistSearchFilter.value = '';

    // Render artist track list
    this.artistTrackList.innerHTML = '';
    if (!artist.tracks || artist.tracks.length === 0) {
      this.artistTrackList.innerHTML = `
        <div class="empty-state">
          <h3>No tracks found for this artist</h3>
          <p>SoundCloud did not list any public tracks on this profile.</p>
        </div>
      `;
    } else {
      this.renderTrackList(this.artistTrackList, artist.tracks);
    }

    this.switchView('artist');
  }

  switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach((panel) => panel.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add('active');
  }

  renderDiscover(tracks) {
    const grid = document.getElementById('discover-track-grid');
    grid.innerHTML = '';
    tracks.forEach((track) => {
      const card = document.createElement('div');
      card.className = 'track-card';
      card.innerHTML = `
        <div class="card-art-wrap">
          <img class="card-art" src="${track.art}" alt="${track.title}" loading="lazy" />
          <button class="card-play-btn" title="Play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="card-queue-btn" title="Add to Queue">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z"/></svg>
          </button>
        </div>
        <div class="card-title" title="${track.title}">${track.title}</div>
        <div class="card-artist">${track.artist}</div>
        <div class="card-duration">${this.formatTime(track.duration)}</div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-queue-btn')) return;
        this.addToQueue(track, true);
      });

      const cardQueueBtn = card.querySelector('.card-queue-btn');
      cardQueueBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToQueue(track, false);
        this.showToast(`Added "${track.title}" to Queue`);
      });

      grid.appendChild(card);
    });
  }

  handleSearchOrUrl(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('soundcloud.com')) {
      this.handleUrlInput(trimmed);
      return;
    }

    // Switch to search view
    this.clearActiveNav();
    document.querySelector('.nav-item[data-view="search"]')?.classList.add('active');
    document.getElementById('search-results-heading').textContent = `Search Results for "${trimmed}"`;

    const filtered = CURATED_TRACKS.filter(
      (t) => t.title.toLowerCase().includes(trimmed.toLowerCase()) || t.artist.toLowerCase().includes(trimmed.toLowerCase())
    );

    const listEl = document.getElementById('search-results-list');
    listEl.innerHTML = '';

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <h3>No matching curated tracks found</h3>
          <p>Paste any direct SoundCloud track or artist link to load and play immediately!</p>
        </div>
      `;
      this.switchView('search');
      return;
    }

    this.renderTrackList(listEl, filtered);
    this.switchView('search');
  }

  async loadSoundCloudTrackUrl(url) {
    // Attempt oEmbed resolution for title and artwork
    let title = 'SoundCloud Track';
    let artist = 'SoundCloud Artist';
    let art = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80';

    try {
      const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        title = data.title || title;
        artist = data.author_name || artist;
        art = data.thumbnail_url || art;
      }
    } catch (e) {
      console.warn('oEmbed fetch error:', e);
    }

    const newTrack = {
      id: 'sc-custom-' + Date.now(),
      title,
      artist,
      url,
      art,
      duration: 180000
    };

    this.addToQueue(newTrack, true);
    this.showToast(`Playing: ${title}`);
  }

  loadSoundCloudUrl(url) {
    return this.handleUrlInput(url);
  }

  addToQueue(track, playImmediately = false) {
    const existsIndex = this.queue.findIndex((t) => t.url === track.url);
    let targetIndex;
    if (existsIndex >= 0) {
      targetIndex = existsIndex;
    } else {
      this.queue.push(track);
      targetIndex = this.queue.length - 1;
    }

    this.updateQueueView();
    if (playImmediately) {
      this.playTrackAtIndex(targetIndex);
    }
  }

  updateQueueView() {
    const listEl = document.getElementById('queue-track-list');
    document.getElementById('sidebar-queue-count').textContent = this.queue.length;
    listEl.innerHTML = '';

    if (this.queue.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <h3>Your queue is empty</h3>
          <p>Add tracks from Discover or paste a link to get started.</p>
        </div>
      `;
      return;
    }

    this.renderTrackList(listEl, this.queue, true);
  }

  updateQueueHighlight() {
    const rows = document.querySelectorAll('#queue-track-list .list-row');
    rows.forEach((r, idx) => {
      r.classList.toggle('active', idx === this.currentIndex);
    });
  }

  renderTrackList(containerEl, tracks, isQueue = false) {
    tracks.forEach((track, index) => {
      const isCurrent = isQueue && index === this.currentIndex;
      const isFav = this.favorites.some((f) => f.url === track.url);
      const row = document.createElement('div');
      row.className = `list-row ${isCurrent ? 'active' : ''}`;
      row.innerHTML = `
        <div class="row-index">${index + 1}</div>
        <img class="row-art" src="${track.art}" alt="Art" />
        <div class="row-info">
          <div class="row-title">${track.title}</div>
          <div class="row-artist">${track.artist}</div>
        </div>
        <div class="row-duration">${this.formatTime(track.duration)}</div>
        <div class="row-actions">
          <button class="row-action-btn fav-btn ${isFav ? 'liked' : ''}" title="${isFav ? 'Remove from Liked' : 'Save to Liked Tracks'}">
            <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="row-action-btn add-queue-btn" title="Add to Queue">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z"/>
            </svg>
          </button>
          ${isQueue ? `<button class="row-action-btn remove-btn" title="Remove from Queue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>` : ''}
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.row-action-btn')) return;
        if (isQueue) {
          this.playTrackAtIndex(index);
        } else {
          this.addToQueue(track, true);
        }
      });

      const favBtn = row.querySelector('.fav-btn');
      favBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFavorite(track);
      });

      const queueBtn = row.querySelector('.add-queue-btn');
      queueBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addToQueue(track, false);
        this.showToast(`Added "${track.title}" to Queue`);
      });

      const removeBtn = row.querySelector('.remove-btn');
      removeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.queue.splice(index, 1);
        if (this.currentIndex >= this.queue.length) this.currentIndex = Math.max(0, this.queue.length - 1);
        this.updateQueueView();
      });

      containerEl.appendChild(row);
    });
  }

  toggleFavorite(track) {
    if (!track) return;
    const idx = this.favorites.findIndex((f) => f.url === track.url);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(track);
    }
    localStorage.setItem('sc_favorites', JSON.stringify(this.favorites));
    this.updateFavoritesView();
    this.updatePlayerUI();
  }

  updateFavoritesView() {
    const listEl = document.getElementById('favorites-track-list');
    document.getElementById('sidebar-liked-count').textContent = this.favorites.length;
    listEl.innerHTML = '';

    if (this.favorites.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <h3>No liked tracks yet</h3>
          <p>Click the heart icon on any song you enjoy to save it here.</p>
        </div>
      `;
      return;
    }

    this.renderTrackList(listEl, this.favorites);
  }

  addToHistory(track) {
    if (!track) return;
    this.history = this.history.filter((t) => t.url !== track.url);
    this.history.unshift(track);
    if (this.history.length > 30) this.history.pop();
    localStorage.setItem('sc_history', JSON.stringify(this.history));
    this.updateHistoryView();
  }

  updateHistoryView() {
    const listEl = document.getElementById('history-track-list');
    listEl.innerHTML = '';
    if (this.history.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <h3>No recent history</h3>
          <p>Songs you listen to will appear here automatically.</p>
        </div>
      `;
      return;
    }
    this.renderTrackList(listEl, this.history);
  }

  initVisualizer() {
    const canvas = document.getElementById('visualizer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const barCount = 10;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = 4;
      const gap = 3;
      const startX = (canvas.width - (barCount * (barWidth + gap))) / 2;

      for (let i = 0; i < barCount; i++) {
        let height = 3;
        if (this.isPlaying) {
          const t = Date.now() / 150 + i * 0.8;
          height = 4 + Math.abs(Math.sin(t)) * (canvas.height - 6);
        }
        ctx.fillStyle = '#ff5500';
        ctx.fillRect(startX + i * (barWidth + gap), canvas.height - height, barWidth, height);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new SoundcloudApp();
});
