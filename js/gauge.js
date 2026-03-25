(function () {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('gauge-svg');

  const cx = 210, cy = 220;
  const arcR = 155;

  const segments = [
    { from: 180, to: 144, color: '#4caf50' },
    { from: 144, to: 108, color: '#8bc34a' },
    { from: 108, to: 72,  color: '#ffc107' },
    { from: 72,  to: 36,  color: '#ff9800' },
    { from: 36,  to: 0,   color: '#f44336' },
  ];

  const labels = [
    { text: 'LOW',    angle: 162, r: 200, rotate: -72 },
    { text: 'NORMAL', angle: 90,  r: 185, rotate: 0  },
    { text: 'HIGH',   angle: 18,  r: 200, rotate: 72 },
  ];

  function polar(r, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  }

  function el(tag, attrs) {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  // Semicircle arc segments
  const gap = 1.5;
  segments.forEach(({ from, to, color }) => {
    const a1 = from - gap, a2 = to + gap;
    const p1 = polar(arcR, a1), p2 = polar(arcR, a2);
    const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${arcR} ${arcR} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    svg.appendChild(el('path', {
      d,
      fill: 'none',
      stroke: color,
      'stroke-width': '6',
      'stroke-linecap': 'round'
    }));
  });

  // Labels
  labels.forEach(({ text, angle, r, rotate }) => {
    const pos = polar(r, angle);
    const t = el('text', {
      x: pos.x.toFixed(1),
      y: pos.y.toFixed(1),
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: '#888',
      'font-size': '20',
      'font-weight': 'bold',
      'font-family': 'sans-serif',
      'letter-spacing': '0.1em',
      transform: `rotate(${rotate}, ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`
    });
    t.textContent = text;
    svg.appendChild(t);
  });

  // Needle (pointer only — rotates)
  const needle = el('g', {});

  needle.appendChild(el('polygon', {
    points: `${cx - 152},${cy} ${cx + 15},${cy - 5} ${cx + 15},${cy + 5}`,
    fill: '#ddd'
  }));

  svg.appendChild(needle);

  // Pivot circles (fixed on top)
  svg.appendChild(el('circle', { cx, cy, r: 14, fill: '#1a1a1a', stroke: '#555', 'stroke-width': '2' }));
  svg.appendChild(el('circle', { cx, cy, r: 5,  fill: '#eee' }));

  needle.style.transformBox = 'view-box';
  needle.style.transformOrigin = `${cx}px ${cy}px`;
  needle.style.transition = 'transform 0.6s cubic-bezier(0.25, 1.1, 0.5, 1)';

  window.setGaugeValue = function (value) {
    const v = Math.max(0, Math.min(1, value));
    needle.style.transform = `rotate(${v * 180}deg)`;
  };

  window.setGaugeValue(0);
})();
