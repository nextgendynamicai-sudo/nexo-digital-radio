/**
 * NEXO DIGITAL - FUTURISTIC AUDIO VISUALIZER
 * HTML5 Canvas Audio Wave & Crowd Mass Pulse Generator
 */

class NexoVisualizer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.overdriveMode = false;
    this.laserMode = false;
    this.vortexMode = false;
    this.vortexAngle = 0;
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.createParticles(40);
    this.startLoop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = (rect.height || 140) * (window.devicePixelRatio || 1);
  }

  createParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas ? this.canvas.width : 800),
        y: Math.random() * (this.canvas ? this.canvas.height : 140),
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? '#A855F7' : (i % 3 === 0 ? '#06B6D4' : '#F43F5E'),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  triggerOverdrive() {
    this.overdriveMode = true;
    setTimeout(() => { this.overdriveMode = false; }, 4000);
  }

  triggerLaser() {
    this.laserMode = true;
    setTimeout(() => { this.laserMode = false; }, 3500);
  }

  triggerVortex() {
    this.vortexMode = true;
    setTimeout(() => { this.vortexMode = false; }, 5000);
  }

  startLoop() {
    const render = () => {
      this.draw();
      this.animationId = requestAnimationFrame(render);
    };
    render();
  }

  draw() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    // Background Clear
    ctx.clearRect(0, 0, width, height);

    if (this.overdriveMode) {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.fillRect(0, 0, width, height);
    }

    // Get Frequency Data from Audio Engine
    let freqData = window.nexoAudio ? window.nexoAudio.getFrequencyData() : new Uint8Array(64);
    
    // Synthetic fallback values if audio is paused
    if (!window.nexoAudio || !window.nexoAudio.isPlaying) {
      const time = Date.now() * 0.003;
      freqData = new Uint8Array(48);
      for (let i = 0; i < 48; i++) {
        freqData[i] = Math.floor(Math.sin(time + i * 0.2) * 30 + 40);
      }
    }

    // 1. Draw Particle Field (Composición de Masas)
    ctx.save();
    this.particles.forEach((p, idx) => {
      if (this.vortexMode) {
        this.vortexAngle += 0.001;
        const centerX = width / 2;
        const centerY = height / 2;
        const dist = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
        const angle = Math.atan2(p.y - centerY, p.x - centerX) + 0.05;
        p.x = centerX + Math.cos(angle) * dist;
        p.y = centerY + Math.sin(angle) * dist;
      } else {
        p.x += p.vx * (this.overdriveMode ? 3 : 1);
        p.y += p.vy * (this.overdriveMode ? 3 : 1);
      }

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const audioBoost = (freqData[idx % freqData.length] || 30) / 255;
      const currentRadius = p.radius * (1 + audioBoost * 2);

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.restore();

    // 2. Draw Futuristic Cyber-Rock Equalizer Spectrum
    const barCount = Math.min(48, freqData.length);
    const barWidth = (width / barCount) * 0.7;
    const barGap = (width / barCount) * 0.3;

    for (let i = 0; i < barCount; i++) {
      const val = freqData[i] || 10;
      const barHeight = (val / 255) * (height * 0.75);
      const x = i * (barWidth + barGap) + barGap / 2;
      const y = height - barHeight;

      // Gradient Color Logic
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      if (this.overdriveMode) {
        gradient.addColorStop(0, '#F43F5E');
        gradient.addColorStop(1, '#FFD166');
      } else if (this.laserMode) {
        gradient.addColorStop(0, '#06B6D4');
        gradient.addColorStop(1, '#A855F7');
      } else {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
        gradient.addColorStop(0.6, '#A855F7');
        gradient.addColorStop(1, '#F43F5E');
      }

      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.overdriveMode ? '#F43F5E' : '#A855F7';
      ctx.fillStyle = gradient;

      // Rounded Top Bar
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Top Highlight Dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x + barWidth / 2, Math.max(10, y - 4), barWidth * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Laser Sweep Effect
    if (this.laserMode) {
      const laserX = (Date.now() * 0.5) % width;
      ctx.save();
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06B6D4';
      ctx.beginPath();
      ctx.moveTo(laserX, 0);
      ctx.lineTo(laserX, height);
      ctx.stroke();
      ctx.restore();
    }
  }
}

window.nexoVisualizer = new NexoVisualizer();
