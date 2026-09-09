class SoundcloudEngine {
  constructor(iframeElement, onEventCallback) {
    this.iframe = iframeElement;
    this.widget = null;
    this.onEvent = onEventCallback || (() => {});
    this.isReady = false;
    this.currentTrack = null;
    this.duration = 0;
    this.position = 0;
    this.isPlaying = false;
    this.volume = 80;
    this.init();
  }

  init() {
    if (typeof window.SC === 'undefined') {
      console.warn('SoundCloud Widget API not yet loaded, waiting...');
      setTimeout(() => this.init(), 250);
      return;
    }

    try {
      this.widget = window.SC.Widget(this.iframe);
      this.bindEvents();
    } catch (err) {
      console.error('Failed to initialize SC Widget:', err);
    }
  }

  bindEvents() {
    if (!this.widget) return;
    const SC = window.SC;

    this.widget.bind(SC.Widget.Events.READY, () => {
      this.isReady = true;
      this.widget.setVolume(this.volume);
      this.onEvent('ready');
    });

    this.widget.bind(SC.Widget.Events.PLAY, () => {
      this.isPlaying = true;
      this.widget.getCurrentSound((sound) => {
        if (sound) {
          this.currentTrack = sound;
          this.duration = sound.duration || this.duration;
          this.onEvent('trackinfo', sound);
        }
      });
      this.onEvent('play');
    });

    this.widget.bind(SC.Widget.Events.PAUSE, () => {
      this.isPlaying = false;
      this.onEvent('pause');
    });

    this.widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
      this.position = data.currentPosition;
      this.duration = data.relativePosition > 0 ? data.currentPosition / data.relativePosition : this.duration;
      this.onEvent('progress', {
        position: this.position,
        duration: this.duration,
        percent: data.relativePosition * 100
      });
    });

    this.widget.bind(SC.Widget.Events.FINISH, () => {
      this.isPlaying = false;
      this.onEvent('finish');
    });

    this.widget.bind(SC.Widget.Events.ERROR, (err) => {
      console.error('SC Widget Error:', err);
      this.onEvent('error', err);
    });
  }

  load(url, autoPlay = true) {
    if (!this.widget) {
      setTimeout(() => this.load(url, autoPlay), 300);
      return;
    }

    this.widget.load(url, {
      auto_play: autoPlay,
      show_artwork: false,
      buying: false,
      sharing: false,
      download: false,
      show_comments: false,
      show_playcount: false,
      show_user: false,
      callback: () => {
        this.widget.getCurrentSound((sound) => {
          if (sound) {
            this.currentTrack = sound;
            this.duration = sound.duration || 0;
            this.onEvent('trackinfo', sound);
          }
        });
        if (autoPlay) {
          this.widget.play();
        }
      }
    });
  }

  play() {
    if (this.widget) {
      this.widget.play();
    }
  }

  pause() {
    if (this.widget) {
      this.widget.pause();
    }
  }

  toggle() {
    if (this.widget) {
      this.widget.toggle();
    }
  }

  seekTo(ms) {
    if (this.widget) {
      this.widget.seekTo(ms);
    }
  }

  setVolume(volPercent) {
    this.volume = Math.max(0, Math.min(100, volPercent));
    if (this.widget) {
      this.widget.setVolume(this.volume);
    }
  }
}
