// Корабль
const ship = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 60,
  height: 60,
  speed: 6,
  lives: 3,
  skin: null,
  img: new Image()
};

// Выбор скина
skinSelect.addEventListener('change', e=>{
  ship.skin = e.target.value;
  ship.img.src = `images/${ship.skin}`;
  skinPreview.innerHTML = '';
  const img = new Image();
  img.src = ship.img.src;
  img.style.width = '80px';
  img.style.height = '80px';
  skinPreview.appendChild(img);
});

// Кнопка Play
playBtn.addEventListener('click', ()=>{
  if(!ship.skin){
    ship.skin = skins[0];
    ship.img.src = `images/${ship.skin}`;
  }
  gameStarted = true;
  document.getElementById('startScreen').style.display = 'none';
});

// Рисуем корабль в update()
ctx.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);

// Рисуем метеориты
meteors.forEach((m,i)=>{
  m.y += m.speed;
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(m.x + m.width/2, m.y + m.height/2, m.width/2, 0, Math.PI*2);
  ctx.fill();

  if(!m.hit && checkCollision(ship,m)){
    m.hit = true;
    ship.lives--;
    if(ship.lives < 0) ship.lives = 0;
    document.getElementById('lives').textContent = ship.lives;
  }

  if(m.y > canvas.height || m.hit) meteors.splice(i,1);
});
