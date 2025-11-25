const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;

let gameStarted = false;

// Корабль
const ship = {
  x: canvas.width/2,
  y: canvas.height - 100,
  width: 60,
  height: 60,
  speed: 6,
  lives: 3,
  skin: null,
  img: new Image()
};

// Метеориты
let meteors = [];
let meteorSpawnRate = 60;
let frameCount = 0;

// Скины
const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
const skinSelect = document.getElementById('skinSelect');
const skinPreview = document.getElementById('skinPreview');

skins.forEach(s=>{
  const option = document.createElement('option');
  option.value = s;
  option.textContent = s.split('.')[0];
  skinSelect.appendChild(option);
});

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

// Управление
const keys = {};
document.addEventListener('keydown', e=>keys[e.key.toLowerCase()]=true);
document.addEventListener('keyup', e=>keys[e.key.toLowerCase()]=false);

// Мобильные кнопки
['Left','Right','Up','Down'].forEach(dir=>{
  const btn = document.getElementById('btn'+dir);
  btn.addEventListener('touchstart',()=>keys['arrow'+dir.toLowerCase()]=true);
  btn.addEventListener('touchend',()=>keys['arrow'+dir.toLowerCase()]=false);
});

// Кнопка Play
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', ()=>{
  if(!ship.skin){
    ship.skin = skins[0];
    ship.img.src = `images/${ship.skin}`;
  }
  gameStarted = true;
  document.getElementById('startScreen').style.display = 'none';
  requestAnimationFrame(update);
});

// Проверка столкновения
function checkCollision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Основной цикл
function update(){
  if(!gameStarted) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Движение корабля
  if(keys['arrowleft'] && ship.x>0) ship.x -= ship.speed;
  if(keys['arrowright'] && ship.x+ship.width<canvas.width) ship.x += ship.speed;
  if(keys['arrowup'] && ship.y>0) ship.y -= ship.speed;
  if(keys['arrowdown'] && ship.y+ship.height<canvas.height) ship.y += ship.speed;

  // Рисуем корабль
  ctx.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);

  // Спавн метеоритов
  frameCount++;
  if(frameCount % meteorSpawnRate === 0){
    meteors.push({
      x: Math.random()*(canvas.width-40),
      y: -40,
      width: 40,
      height: 40,
      speed: 3 + Math.random()*2,
      hit: false
    });
  }

  // Рисуем метеориты
  meteors.forEach((m,i)=>{
    m.y += m.speed;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(m.x+m.width/2,m.y+m.height/2,m.width/2,0,Math.PI*2);
    ctx.fill();

    if(!m.hit && checkCollision(ship,m)){
      m.hit = true;
      ship.lives--;
      if(ship.lives<0) ship.lives=0;
      document.getElementById('lives').textContent = ship.lives;
    }

    if(m.y>canvas.height || m.hit) meteors.splice(i,1);
  });

  // Проверка конца игры
  if(ship.lives <=0){
    gameStarted = false;
    document.getElementById('startScreen').style.display='flex';
    document.getElementById('startScreen').querySelector('.game-title').textContent='Game Over';
    meteors = [];
    ship.x = canvas.width/2;
    ship.y = canvas.height-100;
    ship.lives = 3;
    document.getElementById('lives').textContent = ship.lives;
  }

  requestAnimationFrame(update);
}
