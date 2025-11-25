// game.js — Twine Space

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let ship = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 64,
  height: 64,
  img: new Image(),
  speed: 6,
  lives: 3
};

const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
const skinSelect = document.getElementById('skinSelect');
const skinPreview = document.getElementById('skinPreview');
const playBtn = document.getElementById('playBtn');
const livesDisplay = document.getElementById('lives');

let meteors = [];
let keys = {};
let gameStarted = false;

// Инициализация селекта с скинами
skins.forEach((s,i)=>{
  const opt = document.createElement('option');
  opt.value = s;
  opt.textContent = `Skin ${i+1}`;
  skinSelect.appendChild(opt);
});
ship.img.src = skins[0];
skinPreview.style.backgroundImage = `url('images/${skins[0]}')`;
skinPreview.style.backgroundSize = 'contain';
skinPreview.style.backgroundRepeat = 'no-repeat';
skinPreview.style.backgroundPosition = 'center';

// Обновление превью при выборе скина
skinSelect.addEventListener('change', ()=>{
  const sel = skinSelect.value;
  skinPreview.style.backgroundImage = `url('images/${sel}')`;
  ship.img.src = 'images/' + sel;
});

// Кнопки управления для ПК
document.addEventListener('keydown', e=> keys[e.key] = true);
document.addEventListener('keyup', e=> keys[e.key] = false);

// Мобильные кнопки
['btnLeft','btnRight','btnUp','btnDown'].forEach(id=>{
  const btn = document.getElementById(id);
  btn.addEventListener('touchstart', ()=> keys[id]=true);
  btn.addEventListener('touchend', ()=> keys[id]=false);
});

// Создание метеоритов
function spawnMeteor(){
  const size = Math.random()*40 + 30;
  meteors.push({
    x: Math.random()*(canvas.width-size),
    y: -size,
    width: size,
    height: size,
    speed: Math.random()*3 + 2
  });
}

// Проверка столкновения
function checkCollision(a,b){
  return !(a.x+a.width < b.x || a.x > b.x+b.width || a.y+a.height < b.y || a.y > b.y+b.height);
}

// Игровой цикл
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Движение корабля
  if(keys['ArrowLeft'] || keys['btnLeft']) ship.x -= ship.speed;
  if(keys['ArrowRight'] || keys['btnRight']) ship.x += ship.speed;
  if(keys['ArrowUp'] || keys['btnUp']) ship.y -= ship.speed;
  if(keys['ArrowDown'] || keys['btnDown']) ship.y += ship.speed;

  // Ограничения по экрану
  ship.x = Math.max(0, Math.min(canvas.width-ship.width, ship.x));
  ship.y = Math.max(0, Math.min(canvas.height-ship.height, ship.y));

  // Рисуем корабль
  ctx.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);

  // Метеориты
  if(gameStarted && Math.random() < 0.02) spawnMeteor();
  meteors.forEach((m, i)=>{
    m.y += m.speed;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(m.x+m.width/2, m.y+m.height/2, m.width/2, 0, Math.PI*2);
    ctx.fill();

    // Проверка столкновения
    if(checkCollision(ship, m)){
      meteors.splice(i,1);
      ship.lives--;
      livesDisplay.textContent = ship.lives;
    }

    // Удаление за экраном
    if(m.y > canvas.height) meteors.splice(i,1);
  });

  requestAnimationFrame(update);
}

// Старт игры
playBtn.addEventListener('click', ()=>{
  document.getElementById('startScreen').style.display = 'none';
  gameStarted = true;
  update();
});

// Отображение жизней сразу
livesDisplay.textContent = ship.lives;
