document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');
  const startScreen = document.getElementById('startScreen');
  const skinSelect = document.getElementById('skinSelect');
  const skinPreview = document.getElementById('skinPreview');

  const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
  let selectedSkin = skins[0];

  // Заполняем селект
  skins.forEach(skin => {
    const option = document.createElement('option');
    option.value = skin;
    option.text = skin;
    skinSelect.appendChild(option);
  });

  function updatePreview() {
    skinPreview.innerHTML = `<img src="images/${selectedSkin}" alt="Skin" style="height:80px;">`;
  }

  skinSelect.addEventListener('change', e => {
    selectedSkin = e.target.value;
    updatePreview();
  });

  updatePreview();

  playBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    startGame(selectedSkin);
  });

  function startGame(skin) {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const playerImg = new Image();
    playerImg.src = `images/${skin}`;
    let player = {
      x: canvas.width / 2,
      y: canvas.height - 100,
      width: 64,
      height: 64,
      lives: 3
    };

    const meteors = [];
    const keys = {};

    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    // кнопки для мобильных
    document.getElementById('btnLeft').addEventListener('mousedown', ()=>keys['ArrowLeft']=true);
    document.getElementById('btnLeft').addEventListener('mouseup', ()=>keys['ArrowLeft']=false);
    document.getElementById('btnRight').addEventListener('mousedown', ()=>keys['ArrowRight']=true);
    document.getElementById('btnRight').addEventListener('mouseup', ()=>keys['ArrowRight']=false);
    document.getElementById('btnUp').addEventListener('mousedown', ()=>keys['ArrowUp']=true);
    document.getElementById('btnUp').addEventListener('mouseup', ()=>keys['ArrowUp']=false);
    document.getElementById('btnDown').addEventListener('mousedown', ()=>keys['ArrowDown']=true);
    document.getElementById('btnDown').addEventListener('mouseup', ()=>keys['ArrowDown']=false);

    function spawnMeteor() {
      meteors.push({
        x: Math.random() * canvas.width,
        y: -50,
        size: 20 + Math.random()*30,
        speed: 2 + Math.random()*3
      });
    }

    function rectCircleColliding(circle, rect) {
      const distX = Math.abs(circle.x - rect.x - rect.width/2);
      const distY = Math.abs(circle.y - rect.y - rect.height/2);

      if(distX > (rect.width/2 + circle.size)) return false;
      if(distY > (rect.height/2 + circle.size)) return false;

      if(distX <= (rect.width/2)) return true;
      if(distY <= (rect.height/2)) return true;

      const dx=distX-rect.width/2;
      const dy=distY-rect.height/2;
      return (dx*dx + dy*dy <= circle.size*circle.size);
    }

    function gameLoop() {
      ctx.clearRect(0,0,canvas.width,canvas.height);

      // фон
      ctx.fillStyle = 'rgba(5,6,16,0.6)';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      // движение игрока
      if(keys['ArrowLeft']) player.x -= 5;
      if(keys['ArrowRight']) player.x +=5;
      if(keys['ArrowUp']) player.y -=5;
      if(keys['ArrowDown']) player.y +=5;

      // рисуем игрока
      ctx.drawImage(playerImg, player.x - player.width/2, player.y - player.height/2, player.width, player.height);

      // спавн метеоритов
      if(Math.random() < 0.03) spawnMeteor();

      // рисуем метеориты и проверяем столкновения
      ctx.fillStyle = '#ff5e5e';
      for(let i=meteors.length-1;i>=0;i--){
        const m = meteors[i];
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
        ctx.fill();
        m.y += m.speed;

        if(rectCircleColliding(m, player)){
          meteors.splice(i,1);
          player.lives--;
          document.getElementById('lives').textContent = player.lives;
          if(player.lives <= 0){
            alert('Game Over!');
            window.location.reload();
          }
        } else if(m.y > canvas.height + 50){
          meteors.splice(i,1);
        }
      }

      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }
});
