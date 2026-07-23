/**
 * NEXO DIGITAL - MAIN APPLICATION CONTROLLER
 */

// Toast Utility
window.showToast = function(msg) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 3500);
};

// Navigation Tab Switcher
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.app-section');

  tabs.forEach(tab => {
    if (tab.dataset.target === tabId) {
      tab.classList.add('active', 'text-purple-400');
      tab.classList.remove('text-slate-400');
    } else {
      tab.classList.remove('active', 'text-purple-400');
      tab.classList.add('text-slate-400');
    }
  });

  sections.forEach(sec => {
    if (sec.id === `section-${tabId}`) {
      sec.classList.remove('hidden');
    } else {
      sec.classList.add('hidden');
    }
  });

  // Re-trigger visualizer canvas size on tab switch
  if (tabId === 'live' && window.nexoVisualizer) {
    setTimeout(() => window.nexoVisualizer.resize(), 50);
  }
}

// Authentication Modal Logic
function toggleAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.toggle('hidden');
}

function handleAuth(e) {
  e.preventDefault();
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;

  const user = { name, email };
  localStorage.setItem('nexo_user', JSON.stringify(user));

  updateAuthStatus(user);
  toggleAuthModal();

  window.showToast(`Bienvenido a Nexo Digital, ${name}!`);
}

function logout() {
  localStorage.removeItem('nexo_user');
  updateAuthStatus(null);
  window.showToast("Sesión cerrada.");
}

function updateAuthStatus(user) {
  const authBtn = document.getElementById('auth-btn');
  const adminTab = document.getElementById('tab-admin');
  const adminPanel = document.getElementById('admin-panel');

  if (user) {
    authBtn.innerHTML = `👤 ${user.name}`;
    authBtn.onclick = logout;

    const isAdmin = user.email.includes('admin') || user.email.includes('kreatek') || user.email.includes('master');
    if (isAdmin) {
      if (adminTab) adminTab.classList.remove('hidden');
      if (adminPanel) adminPanel.classList.remove('hidden');
      window.showToast("⚡ Modo Administrador activado");
    } else {
      if (adminTab) adminTab.classList.add('hidden');
      if (adminPanel) adminPanel.classList.add('hidden');
    }
  } else {
    authBtn.innerText = "Ingresar";
    authBtn.onclick = toggleAuthModal;
    if (adminTab) adminTab.classList.add('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
  }
}

// Global App Initialization
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Submodules
  if (window.nexoAudio) window.nexoAudio.init('radio-stream');
  if (window.nexoVisualizer) window.nexoVisualizer.init('visualizer-canvas');
  if (window.nexoMass) window.nexoMass.init();
  if (window.nexoPodcasts) window.nexoPodcasts.init();
  if (window.nexoSchedule) window.nexoSchedule.init();
  if (window.nexoAdmin) window.nexoAdmin.init();

  // Restore User Auth State
  const savedUser = localStorage.getItem('nexo_user');
  if (savedUser) {
    try {
      updateAuthStatus(JSON.parse(savedUser));
    } catch (e) {
      localStorage.removeItem('nexo_user');
    }
  }

  // Audio Player State Listener
  if (window.nexoAudio) {
    window.nexoAudio.onStateChange((engine) => {
      const btn = document.getElementById('main-play-btn');
      const trackTitle = document.getElementById('track-title');
      const trackArtist = document.getElementById('track-artist');

      if (btn) {
        btn.innerText = engine.isPlaying ? '⏸ PAUSAR' : '▶ TRANSMITIR';
        btn.className = engine.isPlaying 
          ? 'px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition brand-glow-crimson flex items-center gap-2'
          : 'px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg transition brand-glow flex items-center gap-2';
      }

      if (trackTitle) trackTitle.innerText = engine.currentTrack.title;
      if (trackArtist) trackArtist.innerText = engine.currentTrack.artist;
    });
  }
});
