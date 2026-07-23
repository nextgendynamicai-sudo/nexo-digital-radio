/**
 * NEXO DIGITAL - AUDIO PLAYER & WEB AUDIO ENGINE
 * Dual-Mode Engine: Real Radio Live Stream + Web Audio Rock Synthesizer Fallback
 */

class NexoAudioEngine {
  constructor() {
    this.primaryStreamUrl = "https://content-api.zeno.fm/s/rZAF2b";
    this.fallbackStreamUrl = "https://stream.zeno.fm/f3wvbb1ndg8uv";
    this.streamUrl = this.primaryStreamUrl;
    this.audioElement = null;
    this.audioCtx = null;
    this.analyser = null;
    this.sourceNode = null;
    this.isPlaying = false;
    this.isSynthMode = false;
    this.volume = 0.8;
    this.synthOscillators = [];
    this.synthInterval = null;

    // Track state
    this.currentTrack = {
      title: "Cyber-Rock Resonance [Live Signal]",
      artist: "Nexo Mass Ensemble",
      album: "Sinfonía Disruptiva 2026",
      bitrate: "320 kbps",
      cover: "logo.png"
    };

    this.onStateChangeCallbacks = [];
  }

  init(audioElementId) {
    this.audioElement = document.getElementById(audioElementId);
    if (!this.audioElement) return;

    this.audioElement.volume = this.volume;
    
    // Event Listeners for HTML Audio
    this.audioElement.addEventListener('playing', () => {
      this.isPlaying = true;
      this.notifyStateChange();
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.isSynthMode) {
        this.isPlaying = false;
        this.notifyStateChange();
      }
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn("Live stream standard source error or CORS restriction. Activating Web Audio Rock Engine fallback.", e);
      this.startSynthRockEngine();
    });
  }

  setupAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      if (this.audioElement && !this.sourceNode) {
        try {
          this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
        } catch (err) {
          console.log("MediaElementSource connection info:", err.message);
        }
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
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
      this.startSynthRockEngine();
      this.isPlaying = true;
      this.notifyStateChange();
      return;
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notifyStateChange();
    } catch (err) {
      console.warn("Direct stream play blocked, switching to Rock Synth engine", err);
      this.startSynthRockEngine();
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
    if (this.synthGain) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.3, this.audioCtx.currentTime);
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
    this.audioElement.src = this.streamUrl;
    this.play();
  }

  // Web Audio Rock Synth Generator - Ensures audio + visualizer ALWAYS works live!
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

    // Heavy Futuristic Cyber-Rock Chord Scale (E Minor Rock riff)
    const frequencies = [82.41, 123.47, 164.81, 246.94, 329.63, 493.88]; // E2, B2, E3, B3, E4, B4
    let step = 0;

    if (this.synthInterval) clearInterval(this.synthInterval);

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.isSynthMode) return;

      const now = this.audioCtx.currentTime;
      
      // Synth Lead / Guitar Distortion Simulator
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      // Rock sawtooth waveform
      osc.type = (step % 4 === 0) ? 'sawtooth' : 'square';
      const freq = frequencies[step % frequencies.length] * ((step % 8 > 4) ? 1.5 : 1.0);
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.3, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(noteGain);
      noteGain.connect(this.synthGain);

      osc.start(now);
      osc.stop(now + 0.36);

      // Cyber Kick / Bass drum beat
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
    }, 220); // 136 BPM Cyber Rock Pulse

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
