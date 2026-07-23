/**
 * NEXO DIGITAL - PROGRAMMING SCHEDULE & LIVE BROADCAST TRACKER
 */

const SCHEDULE_DATA = [
  {
    time: "06:00 - 09:00",
    title: "Despertar Distorsionado",
    host: "Carlos 'Viper' Ruiz",
    genre: "Alternative Rock & Grunge Cyber",
    isLive: false,
    focus: "Masa Matutina Sync"
  },
  {
    time: "09:00 - 13:00",
    title: "Sinfonía Disruptiva Live",
    host: "Valeria Vance",
    genre: "Cyber Progressive Rock",
    isLive: false,
    focus: "Composición de Masas & Teoría Sonora"
  },
  {
    time: "13:00 - 17:00",
    title: "Heavy Metal Future",
    host: "Marcus Steele",
    genre: "Cyber Metal / Djent Futurista",
    isLive: false,
    focus: "Moshpit Colectivo Virtual"
  },
  {
    time: "17:00 - 21:00",
    title: "Señal Matriz Nexo: Frecuencia Rock",
    host: "DJ Nexus & Muba Team",
    genre: "Classic Rock Minimalist & Electro-Rock",
    isLive: true, // Currently playing main signal
    focus: "Transmisión Multicanal YouTube & TikTok"
  },
  {
    time: "21:00 - 02:00",
    title: "CyberRock Underground",
    host: "Elena Rostova",
    genre: "Industrial Rock & Darkwave Minimal",
    isLive: false,
    focus: "Pulso Nocturno Colectivo"
  }
];

class NexoSchedule {
  constructor() {
    this.schedule = SCHEDULE_DATA;
  }

  init() {
    this.renderSchedule();
  }

  renderSchedule() {
    const container = document.getElementById('schedule-list');
    if (!container) return;

    container.innerHTML = this.schedule.map(item => `
      <div class="p-4 rounded-xl border ${item.isLive ? 'bg-purple-950/40 border-purple-500/60 brand-glow' : 'bg-slate-950/50 border-slate-800'} transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${item.isLive ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}">
            ${item.time}
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-white">${item.title}</h4>
              ${item.isLive ? '<span class="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-full animate-pulse">● EN VIVO</span>' : ''}
            </div>
            <p class="text-xs text-slate-400">${item.genre} • Con <span class="text-purple-300">${item.host}</span></p>
          </div>
        </div>
        <div class="text-left md:text-right">
          <span class="text-[10px] uppercase font-mono tracking-wider text-purple-400 border border-purple-900/50 px-2 py-1 rounded bg-purple-950/30">
            ${item.focus}
          </span>
        </div>
      </div>
    `).join('');
  }
}

window.nexoSchedule = new NexoSchedule();
