document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');
  const startScreen = document.getElementById('startScreen');

  const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
  const skinSelect = document.getElementById('skinSelect');
  const skinPreview = document.getElementById('skinPreview');
  let currentSkin = skins[0];

  // заполнение выбора скинов
  skins.forEach(skin => {
    const option = document.createElement('option');
    option.value = skin;
    option.text = skin;
    skinSelect.appendChild(option);
  });

  skinSelect.addEventListener('change', e => {
    currentSkin = e.target.value;
    skinPreview.innerHTML = `<img src='images/${currentSkin}' alt='Skin' style='height:80px;'>`;
  });

  skinPreview.innerHTML = `<img src='images/${currentSkin}' alt='Skin' style='height:80px;'>`;

  playBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    startGame(currentSkin);
  });

  function startGame(selectedSkin) {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const player = new Image();
    player.src = `images/${selectedSkin}`;
    let playerX = canvas.width/2;
    let playerY = canvas.height - 120;

    let lives = 3;
    document.getElementById('lives').textContent = lives;

    const keys = {};
    const meteors = [];

    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    // мобильные кнопки
    document.getElementById('btnLeft').addEventListener('click', ()=>playerX-=10);
    document.getElementById('btnRight').addEventListener('click', ()=>playerX+=10);
    document.getElementById('btnUp').addEventListener('click', ()=>playerY-=10);
    document.getElementById('btnDown').addEventListener('click', ()=>playerY+=10);

    function spawnMeteor() {
      meteors.push({
        x: Math.random()*canvas.width,
        y: -50,
        size: 20 + Math.random()*30,
        speed: 2 + Math.random()*3
      });
    }

    function checkCollision(px, py, size, meteor) {
      const dx = px - meteor.x;
      const dy = py - meteor.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      return distance < size + meteor.size;
    }

    function gameLoop() {
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // фон
      ctx.fillStyle = 'rgba(5,6,16,0.6)';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // движение игрока
      if(keys['ArrowLeft']) playerX -= 5;
      if(keys['ArrowRight']) playerX +=5;
      if(keys['ArrowUp']) playerY -=5;
      if(keys['ArrowDown']) playerY +=5;

      // рисуем игрока
      ctx.drawImage(player, playerX-32, playerY-32, 64,64);

      // спавн метеоритов
      if(Math.random()<0.03) spawnMeteor();

      // рисуем метеориты и проверяем столкновения
      ctx.fillStyle = '#ff5e5e';
      for(let i=meteors.length-1;i>=0;i--){
        const m = meteors[i];
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
        ctx.fill();
        m.y += m.speed;

        if(checkCollision(playerX, playerY, 32, m)){
          meteors.splice(i,1);
          lives--;
          document.getElementById('lives').textContent = lives;
          if(lives <= 0){
            alert('Game Over!');
            window.location.reload();
          }
        } else if(m.y>canvas.height+50) {
          meteors.splice(i,1);
        }
      }

      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }
});
