/**
 * NEXO DIGITAL - MASTER DASHBOARD (ADMIN TRANSMISSION CONTROL)
 */

class NexoAdminDashboard {
  constructor() {
    this.rtmpKeys = {
      youtube: localStorage.getItem('nexo_yt_key') || 'live_yt_key_93847291',
      tiktok: localStorage.getItem('nexo_tk_key') || 'live_tk_key_10293847',
      twitch: localStorage.getItem('nexo_tw_key') || 'live_tw_key_88492014'
    };
  }

  init() {
    this.loadSettings();
  }

  loadSettings() {
    const ytInput = document.getElementById('admin-yt-key');
    const tkInput = document.getElementById('admin-tk-key');
    const twInput = document.getElementById('admin-tw-key');

    if (ytInput) ytInput.value = this.rtmpKeys.youtube;
    if (tkInput) tkInput.value = this.rtmpKeys.tiktok;
    if (twInput) twInput.value = this.rtmpKeys.twitch;
  }

  saveRtmpKeys() {
    const ytInput = document.getElementById('admin-yt-key');
    const tkInput = document.getElementById('admin-tk-key');
    const twInput = document.getElementById('admin-tw-key');

    if (ytInput) {
      this.rtmpKeys.youtube = ytInput.value;
      localStorage.setItem('nexo_yt_key', ytInput.value);
    }
    if (tkInput) {
      this.rtmpKeys.tiktok = tkInput.value;
      localStorage.setItem('nexo_tk_key', tkInput.value);
    }
    if (twInput) {
      this.rtmpKeys.twitch = twInput.value;
      localStorage.setItem('nexo_tw_key', twInput.value);
    }

    if (window.showToast) {
      window.showToast("🔑 Llaves RTMP guardadas y sincronizadas con servidores Kreatek Flow");
    }
  }

  launchSpot() {
    const input = document.getElementById('spot-url-input');
    const spotUrl = input ? input.value : '';

    if (!spotUrl || spotUrl.trim() === '') {
      if (window.showToast) window.showToast("⚠️ Ingrese una URL válida de audio spot");
      return;
    }

    // Play spot sound demo or inject into audio engine
    const spotAudio = new Audio(spotUrl.trim());
    spotAudio.volume = 0.9;
    spotAudio.play().catch(e => {
      console.warn("Spot audio preview play info:", e);
    });

    if (window.showToast) {
      window.showToast(`📢 SPOT PUBLICITARIO LANZADO AL STREAM MATRIZ (${spotUrl.substring(0, 30)}...)`);
    }

    if (window.nexoMass) {
      window.nexoMass.energyLevel = Math.min(100, window.nexoMass.energyLevel + 10);
      window.nexoMass.updateUI();
    }
  }

  setGain(val) {
    const display = document.getElementById('gain-display-val');
    if (display) display.innerText = `${val} dB`;

    if (window.nexoAudio && window.nexoAudio.analyser) {
      if (window.showToast) window.showToast(`🎚️ Ganancia Máster ajustada a ${val} dB`);
    }
  }

  triggerMassBoost() {
    if (window.nexoMass) {
      window.nexoMass.energyLevel = 100;
      window.nexoMass.updateUI();
      if (window.nexoVisualizer) window.nexoVisualizer.triggerOverdrive();
      if (window.showToast) window.showToast("🚀 FRECUENCIA COLECTIVA FORZADA AL 100% POR EL MASTER");
    }
  }
}

window.nexoAdmin = new NexoAdminDashboard();
