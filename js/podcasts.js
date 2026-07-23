/**
 * NEXO DIGITAL - PODCAST & EPISODE CATALOG
 */

const PODCAST_DATA = [
  {
    id: 1,
    title: "Ep. 42: La Física de la Distorsión & Composición de Masas",
    show: "Sinfonía Disruptiva",
    category: "Cyber Rock",
    duration: "45 min",
    date: "22 Julio 2026",
    host: "Valeria Vance & DJ Nexus",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Análisis profundo de cómo las frecuencias de distorsión pesada influyen en la sincronización emocional colectiva de grandes multitudes."
  },
  {
    id: 2,
    title: "Ep. 39: Cyberpunk Synthesizers & Heavy Metal Wave",
    show: "Heavy Metal Future",
    category: "Cyber Metal",
    duration: "58 min",
    date: "18 Julio 2026",
    host: "Marcus Steele",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "La fusión entre guitarras octavadas de 8 cuerdas y sintetizadores analógicos de sub-graves."
  },
  {
    id: 3,
    title: "Ep. 15: Historia Secreta del Rock Progresivo Minimalista",
    show: "CyberRock Underground",
    category: "Rock Clásico",
    duration: "38 min",
    date: "12 Julio 2026",
    host: "Elena Rostova",
    cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "De King Crimson a las bandas cyber-prog de la década 2020: estructuras complejas con empaque minimalista."
  },
  {
    id: 4,
    title: "Ep. 08: Entrevista Exclusiva: Kreatek Sound OS Team",
    show: "Mass Media Talks",
    category: "Masterclass",
    duration: "50 min",
    date: "05 Julio 2026",
    host: "Javier Directo",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description: "Cómo la IA y la radiodifusión multicanal están revolucionando la entrega de audio en alta fidelidad."
  }
];

class NexoPodcasts {
  constructor() {
    this.podcasts = PODCAST_DATA;
    this.activeFilter = "Todos";
    this.currentPlayingPodcast = null;
  }

  init() {
    this.renderPodcasts();
  }

  setFilter(category) {
    this.activeFilter = category;
    this.renderPodcasts();
  }

  renderPodcasts() {
    const gridEl = document.getElementById('podcasts-grid');
    if (!gridEl) return;

    const filtered = this.activeFilter === "Todos" 
      ? this.podcasts 
      : this.podcasts.filter(p => p.category === this.activeFilter);

    gridEl.innerHTML = filtered.map(p => `
      <div class="glass-panel rounded-xl overflow-hidden border border-slate-800 glow-border-hover flex flex-col justify-between">
        <div>
          <div class="relative h-44 overflow-hidden">
            <img src="${p.cover}" alt="${p.title}" class="w-full h-full object-cover transition transform hover:scale-105 duration-500">
            <span class="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur text-[10px] font-bold text-purple-400 border border-purple-500/30 rounded-full">
              ${p.category}
            </span>
            <button onclick="nexoPodcasts.playPodcast(${p.id})" class="absolute bottom-3 right-3 w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110">
              ▶
            </button>
          </div>
          <div class="p-4">
            <p class="text-[11px] text-purple-400 font-semibold mb-1">${p.show} • ${p.duration}</p>
            <h4 class="font-bold text-sm text-white mb-2 line-clamp-2">${p.title}</h4>
            <p class="text-xs text-slate-400 line-clamp-2">${p.description}</p>
          </div>
        </div>
        <div class="p-4 pt-0 border-t border-slate-800/60 mt-2 flex justify-between items-center text-[10px] text-slate-500">
          <span>${p.host}</span>
          <span>${p.date}</span>
        </div>
      </div>
    `).join('');
  }

  playPodcast(id) {
    const pod = this.podcasts.find(p => p.id === id);
    if (!pod) return;

    this.currentPlayingPodcast = pod;

    // Show Podcast Modal / Player overlay
    const modal = document.getElementById('podcast-modal');
    if (modal) {
      document.getElementById('podcast-modal-title').innerText = pod.title;
      document.getElementById('podcast-modal-show').innerText = `${pod.show} • ${pod.host}`;
      document.getElementById('podcast-modal-img').src = pod.cover;
      document.getElementById('podcast-modal-audio').src = pod.audioSrc;
      document.getElementById('podcast-modal-desc').innerText = pod.description;

      modal.classList.remove('hidden');
      document.getElementById('podcast-modal-audio').play();
    }
  }

  closeModal() {
    const modal = document.getElementById('podcast-modal');
    if (modal) {
      const audio = document.getElementById('podcast-modal-audio');
      if (audio) audio.pause();
      modal.classList.add('hidden');
    }
  }
}

window.nexoPodcasts = new NexoPodcasts();
