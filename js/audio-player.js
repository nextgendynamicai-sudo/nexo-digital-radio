/**
 * NEXO DIGITAL - AUDIO PLAYER & LIVE STREAM ENGINE
 * Direct Stream Engine for Zeno Media Radio Stream (Station: rZAF2b / 7d4wxyy8g0hvv)
 */

class NexoAudioEngine {
  constructor() {
    // Exact audio stream URL for Zeno Media Station rZAF2b
    this.primaryStreamUrl = localStorage.getItem('nexo_custom_stream_url') || "https://stream.zeno.fm/7d4wxyy8g0hvv";
    this.zenoPortalUrl = "https://content-api.zeno.fm/s/rZAF2b";
    
    this.audioElement = null;
    this.audioCtx = null;
    this.analyser = null;
    this.isPlaying = false;
    this.isSynthMode = false;
    this.volume = 0.8;
    this.synthInterval = null;

    // Track state
    this.currentTrack = {
      title: "Señal Matriz Nexo Digital Live",
      artist: "Transmisión en Vivo Zeno Media (rZAF2b)",
      album: "Rock & Podcast HQ 320 kbps",
      bitrate: "320 kbps",
      cover: "logo.png"
    };

    this.onStateChangeCallbacks = [];
  }

  init(audioElementId) {
    this.audioElement = document.getElementById(audioElementId);
    if (!this.audioElement) return;

    this.audioElement.volume = this.volume;
    this.audioElement.src = this.primaryStreamUrl;
    
    // HTML5 Audio Event Listeners
    this.audioElement.addEventListener('playing', () => {
      this.isPlaying = true;
      this.isSynthMode = false;
      this.currentTrack.title = "Señal Matriz Nexo Digital Live";
      this.currentTrack.artist = "Transmisión en Vivo (content-api.zeno.fm/s/rZAF2b)";
      this.notifyStateChange();
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.isSynthMode) {
        this.isPlaying = false;
        this.notifyStateChange();
      }
    });

    this.audioElement.addEventListener('waiting', () => {
      console.log("Cargando señal matriz de Zeno Media...");
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn("Reintentando conexión con la señal matriz...", e);
      if (this.isPlaying && !this.isSynthMode) {
        setTimeout(() => {
          this.audioElement.src = this.primaryStreamUrl;
          this.audioElement.play().catch(err => console.log("Stream retry info:", err));
        }, 1500);
      }
    });
  }

  setupAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setCustomStreamUrl(url) {
    if (!url || url.trim() === '') return;
    let target = url.trim();

    // Auto-resolve Zeno portal link to direct MP3 stream endpoint if needed
    if (target.includes('content-api.zeno.fm') || target.includes('zeno.fm/s/rZAF2b')) {
      target = "https://stream.zeno.fm/7d4wxyy8g0hvv";
    }

    this.primaryStreamUrl = target;
    localStorage.setItem('nexo_custom_stream_url', target);

    if (this.audioElement) {
      const wasPlaying = this.isPlaying;
      this.pause();
      this.audioElement.src = target;
      if (wasPlaying) this.play();
    }
  }

  async togglePlay() {
    this.setupAudioContext();

    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  async play() {
    this.setupAudioContext();

    if (this.isSynthMode) {
      this.stopSynthRockEngine();
      this.isSynthMode = false;
    }

    if (!this.audioElement.src || this.audioElement.src === '' || this.audioElement.src.includes('content-api.zeno.fm')) {
      this.audioElement.src = this.primaryStreamUrl;
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notifyStateChange();
    } catch (err) {
      console.warn("Error reproduciendo stream directo:", err);
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.isSynthMode) {
      this.stopSynthRockEngine();
    }
    this.isPlaying = false;
    this.notifyStateChange();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  switchToSynthMode() {
    this.pause();
    this.isSynthMode = true;
    this.startSynthRockEngine();
  }

  switchToLiveStream() {
    this.stopSynthRockEngine();
    this.isSynthMode = false;
    this.audioElement.src = this.primaryStreamUrl;
    this.play();
  }

  // Web Audio Synth Generator (Only activated when user explicitly clicks Synth mode button)
  startSynthRockEngine() {
    this.setupAudioContext();
    this.isSynthMode = true;
    this.isPlaying = true;

    if (!this.synthGain) {
      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.value = this.volume * 0.25;
      this.synthGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    const frequencies = [82.41, 123.47, 164.81, 246.94, 329.63, 493.88];
    let step = 0;

    if (this.synthInterval) clearInterval(this.synthInterval);

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.isSynthMode) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = (step % 4 === 0) ? 'sawtooth' : 'square';
      const freq = frequencies[step % frequencies.length] * ((step % 8 > 4) ? 1.5 : 1.0);
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.3, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(this.synthGain);

      osc.start(now);
      osc.stop(now + 0.36);

      if (step % 2 === 0) {
        const kickOsc = this.audioCtx.createOscillator();
        const kickGain = this.audioCtx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        kickGain.gain.setValueAtTime(0.6, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        kickOsc.connect(kickGain);
        kickGain.connect(this.synthGain);

        kickOsc.start(now);
        kickOsc.stop(now + 0.16);
      }

      step++;
    }, 220);

    this.currentTrack.title = "Sintetizador Rock Futurista [Modo Malla]";
    this.currentTrack.artist = "Nexo Synth-Engine AI";
    this.notifyStateChange();
  }

  stopSynthRockEngine() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(64);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyStateChange() {
    this.onStateChangeCallbacks.forEach(cb => cb(this));
  }
}

window.nexoAudio = new NexoAudioEngine();
