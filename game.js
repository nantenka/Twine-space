const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let ship = { x: canvas.width/2, y: canvas.height-100, width:64, height:64, img:new Image(), speed:6, lives:3 };
const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
const skinSelect = document.getElementById('skinSelect');
const skinPreview = document.getElementById('skinPreview');
const playBtn = document.getElementById('playBtn');
const livesDisplay = document.getElementById('lives');

let meteors = [];
let keys = {};
let gameStarted = false;

// Скины
skins.forEach((s,i)=>{
  const opt = document.createElement('option');
  opt.value = s;
  opt.textContent = `Skin ${i+1}`;
  skinSelect.appendChild(opt);
});
ship.img.src = 'images/' + skins[0];
skinPreview.style.backgroundImage = `url('images/${skins[0]}')`;
skinPreview.style.backgroundSize = 'contain';
skinPreview.style.backgroundRepeat = 'no-repeat';
skinPreview.style.backgroundPosition = 'center';

skinSelect.addEventListener('change', ()=>{
  const sel = skinSelect.value;
  skinPreview.style.backgroundImage = `url('images/${sel}')`;
  ship.img.src = 'images/' + sel;
});

// Управление
document.addEventListener('keydown', e=> keys[e.key]=true);
document.addEventListener('keyup', e=> keys[e.key]=false);
['btnLeft','btnRight','btnUp','btnDown'].forEach(id=>{
  const btn = document.getElementById(id);
  btn.addEventListener('touchstart', ()=> keys[id]=true);
  btn.addEventListener('touchend', ()=> keys[id]=false);
});

// Метеориты
function spawnMeteor(){
  const size = Math.random()*40+30;
  meteors.push({ x:Math.random()*(canvas.width-size), y:-size, width:size, height:size, speed:Math.random()*3+2, hit:false });
}

// Столкновения
function checkCollision(a,b){
  return !(a.x+a.width < b.x || a.x > b.x+b.width || a.y+a.height < b.y || a.y > b.y+b.height);
}

// Игровой цикл
function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(ship.lives <= 0){
    gameStarted = false;
    document.getElementById('startScreen').style.display = 'flex';
    ship.lives = 3;
    livesDisplay.textContent = ship.lives;
    meteors=[];
    ship.x = canvas.width/2;
    ship.y = canvas.height-100;
    return;
  }

  if(keys['ArrowLeft'] || keys['btnLeft']) ship.x -= ship.speed;
  if(keys['ArrowRight'] || keys['btnRight']) ship.x += ship.speed;
  if(keys['ArrowUp'] || keys['btnUp']) ship.y -= ship.speed;
  if(keys['ArrowDown'] || keys['btnDown']) ship.y += ship.speed;

  ship.x = Math.max(0, Math.min(canvas.width-ship.width, ship.x));
  ship.y = Math.max(0, Math.min(canvas.height-ship.height, ship.y));

  ctx.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);

  if(gameStarted && Math.random() < 0.02) spawnMeteor();
  meteors.forEach((m,i)=>{
    m.y += m.speed;
    ctx.fillStyle='red';
    ctx.beginPath();
    ctx.arc(m.x+m.width/2, m.y+m.height/2, m.width/2,0,Math.PI*2);
    ctx.fill();

    if(!m.hit && checkCollision(ship,m)){
      m.hit=true;
      ship.lives--;
      if(ship.lives<0) ship.lives=0;
      livesDisplay.textContent = ship.lives;
    }

    if(m.y>canvas.height || m.hit) meteors.splice(i,1);
  });

  if(gameStarted) requestAnimationFrame(update);
}

// Старт
playBtn.addEventListener('click', ()=>{
  gameStarted=true;
  document.getElementById('startScreen').style.display='none';
  update();
});

livesDisplay.textContent = ship.lives;
