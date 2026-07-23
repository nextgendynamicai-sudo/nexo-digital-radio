/**
 * NEXO DIGITAL - COMPOSICIÓN DE MASAS & CROWD FREQUENCY ENGINE
 * Real-time Mass Synchronization, Energy Pulse Gauge, Crowd Triggers & Live Audience Feed
 */

class NexoMassComposition {
  constructor() {
    this.energyLevel = 68; // Starting energy percentage
    this.listenersCount = 14280; // Base live listeners
    this.userMessages = [];
    this.simulatedComments = [
      { user: "RockFuturo_99", text: "¡El riff distorsionado de las 21:00 es increíble! 🤘⚡", timestamp: "Hace 1m" },
      { user: "CyberVocalist", text: "Sincronizado desde Santiago de Chile. Frecuencia al 100%", timestamp: "Hace 2m" },
      { user: "MoshpitZero", text: "¡Suelten el pulso de distorsión masiva!", timestamp: "Hace 3m" },
      { user: "SinfoniaDigital", text: "Composición de masas activada. Transmisión impecable en 320kbps.", timestamp: "Hace 4m" },
      { user: "TokyoCyberRock", text: "Listening live from Tokyo night line 🌌", timestamp: "Hace 5m" }
    ];
  }

  init() {
    this.updateUI();
    this.startAutoSurge();
    this.renderComments();
  }

  updateUI() {
    // Energy Bar fill
    const fillEl = document.getElementById('mass-energy-fill');
    const valEl = document.getElementById('mass-energy-val');
    const countEl = document.getElementById('listeners-count');

    if (fillEl) fillEl.style.width = `${Math.min(100, this.energyLevel)}%`;
    if (valEl) valEl.innerText = `${Math.min(100, Math.floor(this.energyLevel))}%`;
    if (countEl) countEl.innerText = this.listenersCount.toLocaleString('es-CL');
  }

  triggerAction(actionType) {
    this.energyLevel = Math.min(100, this.energyLevel + 4.5);
    this.listenersCount += Math.floor(Math.random() * 12) + 3;
    this.updateUI();

    // Trigger visualizer reactions
    if (window.nexoVisualizer) {
      if (actionType === 'overdrive') window.nexoVisualizer.triggerOverdrive();
      if (actionType === 'laser') window.nexoVisualizer.triggerLaser();
      if (actionType === 'vortex') window.nexoVisualizer.triggerVortex();
    }

    // Spawn floating emoji particles on main player container
    this.spawnParticle(actionType);

    // Toast Notification
    const messages = {
      overdrive: "⚡ ¡DISTORSIÓN COLECTIVA ACTIVADA POR LA MASA!",
      laser: "🌌 ¡PULSO LÁSER ENVIADO A LA SEÑAL MATRIZ!",
      vortex: "🔥 ¡MOSHPIT VORTEX DESATADO EN EL STREAM!",
      applause: "👏 ¡OVACIÓN MASIVA REGISTRADA EN LA RED!"
    };

    if (window.showToast) {
      window.showToast(messages[actionType] || "Sincronía colectiva amplificada");
    }
  }

  spawnParticle(actionType) {
    const container = document.getElementById('particle-container');
    if (!container) return;

    const emojiMap = {
      overdrive: '⚡',
      laser: '🌌',
      vortex: '🔥',
      applause: '🤘'
    };

    const emoji = emojiMap[actionType] || '💜';
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.innerText = emoji;
    el.style.left = `${Math.random() * 80 + 10}%`;

    container.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2000);
  }

  addComment(text) {
    if (!text || text.trim() === '') return;

    const userObj = JSON.parse(localStorage.getItem('nexo_user') || '{"name":"Oyente Anónimo"}');
    const newComment = {
      user: userObj.name || "Oyente Nexo",
      text: text.trim(),
      timestamp: "Ahora mismo"
    };

    this.simulatedComments.unshift(newComment);
    this.energyLevel = Math.min(100, this.energyLevel + 2);
    this.updateUI();
    this.renderComments();
  }

  renderComments() {
    const listEl = document.getElementById('mass-chat-list');
    if (!listEl) return;

    listEl.innerHTML = this.simulatedComments.map(c => `
      <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-purple-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> ${this.escapeHtml(c.user)}
          </span>
          <span class="text-[10px] text-slate-500">${c.timestamp}</span>
        </div>
        <p class="text-slate-300">${this.escapeHtml(c.text)}</p>
      </div>
    `).join('');
  }

  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  startAutoSurge() {
    // Dynamic periodic fluctuations
    setInterval(() => {
      const delta = (Math.random() - 0.45) * 1.5;
      this.energyLevel = Math.max(30, Math.min(99.5, this.energyLevel + delta));
      this.listenersCount += Math.floor((Math.random() - 0.4) * 8);
      this.updateUI();
    }, 4500);
  }
}

window.nexoMass = new NexoMassComposition();
