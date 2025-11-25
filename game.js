const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let lives = 3;
let shipX = canvas.width/2;
let shipY = canvas.height - 100;
let shipWidth = 50;
let shipHeight = 50;
let speed = 5;
let keys = {};
let meteors = [];
let shipImg = new Image();

const skins = ['twine_1.png','twine_2.png','twine_3.png','twine_4.png','twine_5.png'];
const skinSelect = document.getElementById('skinSelect');
const skinPreview = document.getElementById('skinPreview');

// Populate skin selector
skins.forEach(skin => {
  let opt = document.createElement('option');
  opt.value = skin;
  opt.text = skin;
  skinSelect.appendChild(opt);
});

// Update preview when selecting skin
skinSelect.addEventListener('change', ()=>{
  shipImg.src = 'images/'+skinSelect.value;
  skinPreview.innerHTML = '';
  let previewImg = new Image();
  previewImg.src = 'images/'+skinSelect.value;
  previewImg.style.maxHeight='70px';
  skinPreview.appendChild(previewImg);
});

// Default skin
shipImg.src = 'images/'+skins[0];
let previewImg = new Image();
previewImg.src = 'images/'+skins[0];
previewImg.style.maxHeight='70px';
skinPreview.appendChild(previewImg);

// Start Screen
const startScreen = document.getElementById('startScreen');
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', ()=>{
  shipImg.src = 'images/'+skinSelect.value;
  startScreen.style.display='none';
  animate();
});

// Keyboard
window.addEventListener('keydown',(e)=>{keys[e.key]=true});
window.addEventListener('keyup',(e)=>{keys[e.key]=false});

// Touch buttons
['btnLeft','btnRight','btnUp','btnDown'].forEach(id=>{
  const btn = document.getElementById(id);
  btn.addEventListener('touchstart', ()=>{keys[id]=true});
  btn.addEventListener('touchend', ()=>{keys[id]=false});
});

function spawnMeteor(){
  let size = Math.random()*40 + 20;
  meteors.push({x:Math.random()*canvas.width, y:-size, w:size, h:size, speed:Math.random()*3+2});
}

function update(){
  // Ship movement
  if(keys['ArrowLeft'] || keys['btnLeft']) shipX-=speed;
  if(keys['ArrowRight'] || keys['btnRight']) shipX+=speed;
  if(keys['ArrowUp'] || keys['btnUp']) shipY-=speed;
  if(keys['ArrowDown'] || keys['btnDown']) shipY+=speed;

  shipX = Math.max(0, Math.min(canvas.width-shipWidth, shipX));
  shipY = Math.max(0, Math.min(canvas.height-shipHeight, shipY));

  if(Math.random()<0.02) spawnMeteor();

  meteors.forEach(m=>{ m.y += m.speed; });

  // Remove off-screen meteors
  meteors = meteors.filter(m=> m.y < canvas.height + 50);

  // Collision
  meteors.forEach((m,i)=>{
    if(shipX < m.x + m.w && shipX + shipWidth > m.x && shipY < m.y + m.h && shipY + shipHeight > m.y){
      lives--;
      document.getElementById('lives').textContent = lives;
      meteors.splice(i,1);
      if(lives<=0){ alert('Game Over!'); window.location.reload(); }
    }
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw ship
  ctx.drawImage(shipImg,shipX,shipY,shipWidth,shipHeight);

  // Draw meteors
  meteors.forEach(m=>{
    ctx.fillStyle='rgba(255,100,100,0.8)';
    ctx.beginPath();
    ctx.arc(m.x + m.w/2, m.y + m.h/2, m.w/2, 0, Math.PI*2);
    ctx.fill();
  });
}

function animate(){
  update();
  draw();
  requestAnimationFrame(animate);
}
