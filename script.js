const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let bgMusic = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9bfa1a.mp3?filename=game-music-loop-2-144037.mp3");

function initAudio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function beep(freq, duration=0.1){
  if(!audioCtx) return;

  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  o.type = "sine";
  o.frequency.value = freq;

  g.gain.setValueAtTime(0.2, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  o.connect(g);
  g.connect(audioCtx.destination);

  o.start();
  o.stop(audioCtx.currentTime + duration);
}

function soundCoin(){ beep(1200,0.08); }
function soundJump(){ beep(400,0.1); }
function soundCorrect(){
  beep(600,0.1);
  setTimeout(()=>beep(900,0.1),100);
}
function soundWrong(){ beep(200,0.2); }

// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 400;

// ================= STATE =================
let player, cameraX = 0;
let coinsArr = [], quizBlocks = [];
let control = {left:false,right:false,up:false};


let coins = 0;
let star = 0;
let inQuiz = false;
let currentQuestion = 0;
let gameFinished = false;

// ================= BANK SOAL (20) =================
const questionBank = [
{q:"Grafik y=x² berbentuk?",a:["Parabola","Garis"],c:0,e:"Fungsi kuadrat berbentuk parabola"},
{q:"Jika a > 0 maka arah grafik ke?",a:["Ke atas","Ke bawah"],c:0,e:"a positif → atas"},
{q:"Jika a < 0 maka arah grafik ke?",a:["Ke bawah","Ke atas"],c:0,e:"a negatif → bawah"},
{q:"Titik puncak grafik fungsi kuadrat di sebut?",a:["Vertex","Gradien"],c:0,e:"Vertex = puncak"},
{q:"Diskriminan > 0 memiliki beraopa akar?",a:["2 akar","0 akar"],c:0,e:"Memotong di 2 titik"},
{q:"jika y=x²+2 maka grafik geser ke arah?",a:["Naik","Turun"],c:0,e:"+2 → ke atas"},
{q:"Grafiky=(x-3)² mengalami pergeseran ke arah?",a:["Kanan","Kiri"],c:0,e:"(x-3)²  → kanan"},
{q:"Berapa banyak akar real yang dimiliki oleh persamaan x²-4x+4=0 ?",a:["1","2"],c:0,e:"D=0 → 1 akar"},
{q:"Sumbu simetri dari persamaan  x²-4x adalah?",a:["x=2","x=4"],c:0,e:"-b/2a"},
{q:"Bagaima karakteristik grafik fungsi kuadrat jika nilai a semakin besar?",a:["Curam","Landai"],c:0,e:"a besar → curam"},

{q:"Berapakah jumlah titik potong grafiky=x²-6x+9 dengan sumbu x?",a:["1 titik","2 titik"],c:0,e:"D=0"},
{q:"Jika grafik Parabola berada sepenuhnya di atas sumbu X (tidak memotong maupun menyentuh) bagaimana kondisi akar-akarnya ?",a:["Tidak ada akar","2 akar"],c:0,e:"Tidak memotong"},
{q:"Kemana arah terbuka grafik fungsi kudrat y=-x² grafik?",a:["Bawah","Atas"],c:0,e:"a negatif"},
{q:"Dimana letak titk puncak dari grafik fungsi kuadrat y=x²+4x+4?",a:["(-2,0)","(2,0)"],c:0,e:"Lengkap kuadrat"},
{q:"Apakah grafik fungsi kuadraty=x²+1 memotong sumbuX?",a:["Tidak","Ya"],c:0,e:"Tidak punya akar"},

{q:"Pada detik ke berapa Bola mencapai titik maksimium jika lintasnya mengikuti persamaan y=-x²+4x?",a:["x=2","x=4"],c:0,e:"-b/2a"},
{q:"Bagaimana bentuk grafik y=2x² jikadibandingkan dengan grafik fungsi induk y=x² ?",a:["Curam","Landai"],c:0,e:"a besar"},
{q:"Bentuk grafik yang di hasilkan dari persamaan y=0x²+2?",a:["Garis","Parabola"],c:0,e:"a=0 → garis"},
{q:"Ada berapa banyak titik potong grafik fungsi y=x²-1 terhadap sumbu x ?",a:["2 titik","1 titik"],c:0,e:"D>0"},
{q:"Bagaimana bentuk lintasan atau gambar daari sebuah grafik fungsi kuadrat (parabola)?",a:["Melengkung","Lurus"],c:0,e:"Parabola melengkung"}
];

// ================= START =================
function startGame(){

  document.getElementById("menu").classList.add("hidden");
  canvas.classList.remove("hidden");
  document.getElementById("controls").classList.remove("hidden");
  document.getElementById("ui").classList.remove("hidden");

  bgMusic.play().catch(()=>{}); // 🔥 MUSIK MULAI

  initGame();
  initAudio();
}

// ================= INIT =================
function initGame(){
  player = {x:50,y:300,w:40,h:40,dx:0,dy:0,gravity:0.8,jump:-12,grounded:true};

  coinsArr = [];
  quizBlocks = [];


 // ================= COINS =================
coinsArr = [];

let totalCoins = 80; // 🔥 lebih banyak & merata
let mapLength = 14000; // panjang map

for(let i=0;i<totalCoins;i++){
  coinsArr.push({
    x: 150 + Math.random()*mapLength, // 🔥 random sepanjang map
    y: Math.random() > 0.5 ? 260 : 220, // tidak terlalu tinggi
    collected:false
  });
}

// ================= QUIZ BLOCK =================
quizBlocks = [];

for(let i=0;i<20;i++){
  quizBlocks.push({
    x: 400 + i*600,
    y: Math.random() > 0.5 ? 260 : 180, // 🔥 atas & bawah
    w:40,
    h:40,
    done:false
  });
}


  setupControls();
  loop();
}

// ================= CONTROL =================
function setupControls(){

  const leftBtn = document.getElementById("left");
  const rightBtn = document.getElementById("right");
  const upBtn = document.getElementById("up");

  // LEFT
  leftBtn.onpointerdown = () => control.left = true;
  leftBtn.onpointerup = () => control.left = false;
  leftBtn.onpointerleave = () => control.left = false;

  // RIGHT
  rightBtn.onpointerdown = () => control.right = true;
  rightBtn.onpointerup = () => control.right = false;
  rightBtn.onpointerleave = () => control.right = false;

  // UP
  upBtn.onpointerdown = () => control.up = true;
  upBtn.onpointerup = () => control.up = false;
  upBtn.onpointerleave = () => control.up = false;

  // 🔥 GLOBAL RESET (ini yang penting banget)
  window.addEventListener("pointerup", ()=>{
    control.left = false;
    control.right = false;
    control.up = false;
  });
}

// ================= LOOP =================
function loop(){

  // 🔥 STOP TOTAL (tidak update & tidak gambar)
  if(gameFinished) return;

  update();
  draw();
  requestAnimationFrame(loop);
}

// ================= UPDATE =================
function update(){
  if(gameFinished) return;

  if(inQuiz) return;

  player.dx=0;
  if(control.right) player.dx=4;
  if(control.left) player.dx=-4;

  player.x+=player.dx;

  if(control.up && player.grounded){
  player.dy=player.jump;
  player.grounded=false;
  soundJump(); // 🔥
}

  player.dy+=player.gravity;
  player.y+=player.dy;

  if(player.y>300){
    player.y=300;
    player.dy=0;
    player.grounded=true;
  }

  // coin
  coinsArr.forEach(c=>{
    if(!c.collected &&
      player.x<c.x+20 &&
      player.x+player.w>c.x &&
      player.y<c.y+20 &&
      player.y+player.h>c.y){
        c.collected=true;
        coins++;
soundCoin();
    }
  });

  // quiz
  quizBlocks.forEach((b,i)=>{
    if(!b.done &&
      player.x<b.x+b.w &&
      player.x+player.w>b.x){
        openQuiz(i);
    }
  });

  cameraX = player.x - 200;
}

// ================= DRAW =================
function draw(){
  ctx.clearRect(0,0,900,400);

  ctx.fillStyle="#87CEEB";
  ctx.fillRect(0,0,900,400);

  ctx.fillStyle="green";
  ctx.fillRect(0,330,2000,70);

  // coin
  ctx.fillStyle="gold";
  coinsArr.forEach(c=>{
    if(!c.collected){
      ctx.beginPath();
      ctx.arc(c.x-cameraX,c.y,8,0,Math.PI*2);
      ctx.fill();
    }
  });

  // quiz
  ctx.fillStyle="red";
  quizBlocks.forEach(b=>{
    if(!b.done){
      ctx.fillRect(b.x-cameraX,b.y,40,40);
    }
  });

  // player kucing animasi
let x = player.x-cameraX;
let y = player.y;

// badan
ctx.fillStyle="orange";
ctx.fillRect(x,y,30,20);

// kepala
ctx.beginPath();
ctx.arc(x+15,y-5,10,0,Math.PI*2);
ctx.fill();

// telinga
ctx.beginPath();
ctx.moveTo(x+8,y-10);
ctx.lineTo(x+12,y-20);
ctx.lineTo(x+16,y-10);
ctx.fill();

ctx.beginPath();
ctx.moveTo(x+18,y-10);
ctx.lineTo(x+22,y-20);
ctx.lineTo(x+26,y-10);
ctx.fill();

// mata
ctx.fillStyle="black";
ctx.fillRect(x+10,y-5,2,2);
ctx.fillRect(x+18,y-5,2,2);

// kaki animasi
let step = Math.sin(Date.now()*0.01)*4;

ctx.fillStyle="#8b5a2b";
ctx.fillRect(x+5,y+20+step,4,8);
ctx.fillRect(x+18,y+20-step,4,8);

// tangan
ctx.fillRect(x-4,y+5,4,3);
ctx.fillRect(x+30,y+5,4,3);

  document.getElementById("coins").innerText=coins;
  document.getElementById("star").innerText=star;
}

// ================= QUIZ =================
function openQuiz(i){
  if(inQuiz || currentQuestion>=20) return;

  inQuiz=true;

  let q = questionBank[currentQuestion];

  document.getElementById("quizBox").classList.remove("hidden");
  document.getElementById("question").innerText=q.q;

  let html="";
  q.a.forEach((opt,idx)=>{
    html+=`<button onclick="answer(${idx},${q.c},'${q.e}',${i})">${opt}</button>`;
  });

  document.getElementById("answers").innerHTML=html;
}

// ================= ANSWER =================
function answer(i,c,exp,blockIndex){

  let q = questionBank[currentQuestion];

  if(i === c){
    star++;
    soundCorrect();

    showFeedback(`
      ✅ Jawaban Benar!<br><br>
      ✔ Pilihan kamu: <b>${q.a[i]}</b><br>
      ✔ Penjelasan: ${exp}
    `);

  }else{
    soundWrong();

    showFeedback(`
      ❌ Jawaban Salah<br><br>
      ✔ Jawaban kamu: <b>${q.a[i]}</b><br>
      ✔ Jawaban benar: <b>${q.a[c]}</b><br><br>
      📘 Penjelasan:<br>${exp}
    `);
  }

  quizBlocks[blockIndex].done = true;
  currentQuestion++;

  document.getElementById("quizBox").classList.add("hidden");
  inQuiz = false;

  if(currentQuestion === 20){
    showResult();
  }
}

// ================= FEEDBACK =================
function showFeedback(text){
  let box = document.getElementById("feedbackBox");

  box.innerHTML = text; // 🔥 bukan innerText lagi
  box.classList.remove("hidden");

  setTimeout(()=>{
    box.classList.add("hidden");
  }, 3000);
}
// ================= RESULT =================
function showResult(){

  gameFinished = true;

  // 🔊 SOUND & MUSIK
  stopBGM();
  soundWin();

  // 🎉 KONFETI
  startConfetti();

  // 🔒 STOP GERAK
  control.left = false;
  control.right = false;
  control.up = false;

  player.dx = 0;
  player.dy = 0;

  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("resultBox").innerHTML=`
    <h2>🎉 GAME SELESAI</h2>
    <p>⭐ Skor: ${star}</p>
    <p>🪙 Koin: ${coins}</p>
    <p style="margin-top:10px;">🔥 Keren! Kamu berhasil menyelesaikan game!</p>
    
  `;
  bgMusic.pause();
bgMusic.currentTime = 0;
}

function playBGM(){
  bgMusic = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9bfa1a.mp3?filename=game-music-loop-2-144037.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0.3;
  bgMusic.play();
}

function stopBGM(){
  if(bgMusic){
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}
function soundWin(){
  beep(600,0.2);
  setTimeout(()=>beep(800,0.2),150);
  setTimeout(()=>beep(1000,0.3),300);
}

bgMusic.loop = true;     // 🔁 ulang terus
bgMusic.volume = 0.4;    // 🔊 volume nyaman

function startConfetti(){
  for(let i=0;i<100;i++){
    let div = document.createElement("div");

    div.style.position = "fixed";
    div.style.top = "-10px";
    div.style.left = Math.random()*100 + "%";
    div.style.width = "8px";
    div.style.height = "8px";
    div.style.background = `hsl(${Math.random()*360},100%,50%)`;
    div.style.zIndex = "9999";
    div.style.borderRadius = "50%";

    div.style.animation = `fall ${Math.random()*2+2}s linear`;

    document.body.appendChild(div);

    setTimeout(()=>div.remove(),4000);
  }
}