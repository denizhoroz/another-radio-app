const btn = document.getElementById('btn');
const stream = document.getElementById('stream');

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
    stream.play();
    btn.textContent = 'STOP';
    btn.classList.add('playing');
    stopFlicker();
  } else {
    stream.pause();
    stream.load();
    btn.textContent = 'LOWER CORTISOL';
    btn.classList.remove('playing');
    startFlicker();
  }
});
