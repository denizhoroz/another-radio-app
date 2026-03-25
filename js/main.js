const btn = document.getElementById('btn');
const stream = document.getElementById('stream');
const volume = document.getElementById('volume');

stream.volume = volume.value;
volume.addEventListener('input', () => {
  stream.volume = volume.value;
});

let flickerInterval = null;

function setNeedleSpeed(duration) {
  const needle = document.querySelector('#gauge-svg g');
  needle.style.transition = `transform ${duration}s cubic-bezier(0.25, 1.1, 0.5, 1)`;
}

function startFlicker() {
  setNeedleSpeed(0.05);
  setGaugeValue(0.9 + Math.random() * 0.1);
  flickerInterval = setInterval(() => {
    setGaugeValue(0.9 + Math.random() * 0.1);
  }, 50);
}

function stopFlicker() {
  clearInterval(flickerInterval);
  flickerInterval = null;
  setNeedleSpeed(1.5);
  setGaugeValue(0.02);
}

fetch('data/stations.json')
  .then(res => res.json())
  .then(data => {
    stream.src = data.station.url;
  });

// Start flickering by default (idle state)
startFlicker();

btn.addEventListener('click', () => {
  if (stream.paused) {
    btn.textContent = 'LOWERING...';
    btn.classList.add('connecting');
    btn.disabled = true;
    stream.play().then(() => {
      btn.textContent = 'STOP';
      btn.classList.remove('connecting');
      btn.classList.add('playing');
      btn.disabled = false;
      document.body.style.background = '#284d28';
      stopFlicker();
    }).catch((err) => {
      console.error('Playback failed:', err);
      btn.textContent = 'LOWER CORTISOL';
      btn.classList.remove('connecting');
      btn.disabled = false;
      stream.load();
    });
  } else {
    stream.pause();
    stream.load();
    btn.textContent = 'LOWER CORTISOL';
    btn.classList.remove('playing');
    document.body.style.background = '#4d2828';
    startFlicker();
  }
});
