// Confetti system for all quiz pages
(function() {
  let confettiCanvas, ctx, confettiParticles = [], animationFrameId;

  function randomColor() {
    const colors = [
      '#ff69b4', '#ffd700', '#00e6e6', '#ff6347', '#7cfc00', '#ffb347', '#b19cd9', '#fff', '#ffecb3', '#ffb6c1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createConfettiParticle(x, y) {
    const shapes = ['rect', 'circle', 'triangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
      x: x,
      y: y,
      r: Math.random() * 8 + 6,
      d: Math.random() * 100 + 80,
      color: randomColor(),
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 3 + 2,
      shape: shape,
      alpha: 1,
      sparkle: Math.random() > 0.7 // 30% chance to sparkle
    };
  }

  function drawConfettiParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    if (p.shape === 'rect') {
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = p.sparkle ? 24 : 8;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
      if (p.sparkle) {
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, p.r/3, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff8';
        ctx.shadowBlur = 32;
        ctx.fill();
      }
    } else if (p.shape === 'circle') {
      ctx.arc(0, 0, p.r/2, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = p.sparkle ? 24 : 8;
      ctx.fill();
      if (p.sparkle) {
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, p.r/3, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff8';
        ctx.shadowBlur = 32;
        ctx.fill();
      }
    } else if (p.shape === 'triangle') {
      ctx.moveTo(0, -p.r/2);
      ctx.lineTo(p.r/2, p.r/2);
      ctx.lineTo(-p.r/2, p.r/2);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = p.sparkle ? 24 : 8;
      ctx.fill();
      if (p.sparkle) {
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, p.r/3, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff8';
        ctx.shadowBlur = 32;
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < confettiParticles.length; i++) {
      let p = confettiParticles[i];
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + 1.5;
      p.tiltAngle += p.tiltAngleIncremental;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      p.alpha -= 0.008;
      drawConfettiParticle(p);
    }
    confettiParticles = confettiParticles.filter(p => p.alpha > 0 && p.y < confettiCanvas.height + 40);
    if (confettiParticles.length > 0) {
      animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.display = 'none';
      cancelAnimationFrame(animationFrameId);
    }
  }

  window.launchConfetti = function(x, y) {
    if (!confettiCanvas) {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confetti-canvas';
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.left = 0;
      confettiCanvas.style.top = 0;
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = 9999;
      document.body.appendChild(confettiCanvas);
      ctx = confettiCanvas.getContext('2d');
      function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeConfettiCanvas);
      window.addEventListener('orientationchange', resizeConfettiCanvas);
      resizeConfettiCanvas();
    } else {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    confettiCanvas.style.display = 'block';
    let burstX = typeof x === 'number' ? x : window.innerWidth / 2;
    let burstY = typeof y === 'number' ? y : window.innerHeight * 0.25;
    for (let i = 0; i < 60; i++) {
      confettiParticles.push(createConfettiParticle(burstX, burstY));
    }
    animateConfetti();
  };
})(); 
