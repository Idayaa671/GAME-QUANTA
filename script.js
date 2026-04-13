document.addEventListener("DOMContentLoaded", function(){

let nama="";
let currentQuestion=0;
let benar=0;
let salah=0;
let isAnswered=false;

const bgm=document.getElementById("bgm");


document.getElementById("startBtn").addEventListener("click", startGame);

const questions=[

{question:"f(x)=x² grafiknya?", options:["Ke atas","Ke bawah"], answer:0,
explainCorrect:"a>0 → ke atas", explainWrong:"a positif → ke atas"},

{question:"f(x)=-x² grafiknya?", options:["Ke atas","Ke bawah"], answer:1,
explainCorrect:"a<0 → ke bawah", explainWrong:"a negatif → ke bawah"},

{question:"Bentuk grafik fungsi kuadrat?", options:["Garis","Parabola","Lingkaran"], answer:1,
explainCorrect:"Bentuknya parabola", explainWrong:"Bukan garis/lingkaran"},

{question:"f(x)=2x² dibanding x²?", options:["Lebih sempit","Lebih lebar","Sama"], answer:0,
explainCorrect:"|a|>1 → sempit", explainWrong:"Semakin besar a makin sempit"},

{question:"f(x)=0.5x²?", options:["Lebih sempit","Lebih lebar","Sama"], answer:1,
explainCorrect:"0<|a|<1 → lebar", explainWrong:"Nilai kecil → lebar"},

{question:"f(x)=x²+3 geser?", options:["Atas","Bawah","Kiri"], answer:0,
explainCorrect:"+3 → atas", explainWrong:"Konstanta + geser atas"},

{question:"f(x)=x²-4 geser?", options:["Atas","Bawah","Kanan"], answer:1,
explainCorrect:"-4 → bawah", explainWrong:"Konstanta - geser bawah"},

{question:"Grafik terbuka ke atas & puncak (0,0)?", options:["x²","-x²","x²+3"], answer:0,
explainCorrect:"Tidak geser dan a positif", explainWrong:"Perhatikan puncak"},

{question:"Bentuk ∩ berarti?", options:["Ke atas","Ke bawah"], answer:1,
explainCorrect:"∩ → bawah", explainWrong:"Lengkungan ke bawah"},

{question:"Puncak di atas (0,0)?", options:["Naik","Turun","Tetap"], answer:0,
explainCorrect:"Geser atas", explainWrong:"Bandingkan posisi"},

{question:"Jika a<0?", options:["Atas","Bawah"], answer:1,
explainCorrect:"Negatif → bawah", explainWrong:"Ini aturan dasar"},

{question:"|a| besar?", options:["Sempit","Lebar"], answer:0,
explainCorrect:"Makin curam", explainWrong:"Lebar jika kecil"},

{question:"x² dan x²+2 beda?", options:["Arah","Posisi","Bentuk"], answer:1,
explainCorrect:"Hanya geser", explainWrong:"Bentuk sama"},

{question:"-x² dan x² beda?", options:["Arah","Lebar","Potong"], answer:0,
explainCorrect:"Arah berbeda", explainWrong:"Bukan lebar"},

{question:"Yang paling mempengaruhi bentuk?", options:["a","warna","nama"], answer:0,
explainCorrect:"a menentukan bentuk", explainWrong:"Bukan itu"}
];

function startGame(){

  nama = document.getElementById("namaInput").value.trim();

  if(nama === ""){
    alert("Isi nama dulu ya 😊");
    return;
  }

  // 🔥 AUTO PLAY MUSIK
  const bgm = document.getElementById("bgm");
  bgm.volume = 0.4;
  bgm.currentTime = 0;

  bgm.play().then(()=>{
    console.log("Musik jalan");
  }).catch(err=>{
    console.log("Autoplay diblok:", err);
  });

  // pindah screen
  document.getElementById("start-screen").style.display="none";
  document.getElementById("game-screen").style.display="block";

  showQuestion();
}

function showQuestion(){
  isAnswered=false;

  document.getElementById("feedback").innerHTML="";

  let q=questions[currentQuestion];

  document.getElementById("progress").innerText=
    "Soal "+(currentQuestion+1)+" / "+questions.length;

  document.getElementById("question").innerText=q.question;

  let html="";

  q.options.forEach(function(opt,i){
    html += '<button onclick="checkAnswer('+i+')">'+opt+'</button>';
  });

  document.getElementById("options").innerHTML=html;
}

window.checkAnswer=function(i){
  if(isAnswered)return;
  isAnswered=true;

  let q=questions[currentQuestion];
  let f=document.getElementById("feedback");

  const soundBenar = document.getElementById("soundBenar");
const soundSalah = document.getElementById("soundSalah");

if(i===q.answer){
  benar++;

  soundBenar.currentTime = 0;
  soundBenar.play();

  f.innerHTML='<div class="correct">Benar! 🎉</div><div>'+q.explainCorrect+'</div>';

}else{
  salah++;

  soundSalah.currentTime = 0;
  soundSalah.play();

  f.innerHTML='<div class="wrong">Belum tepat 😊</div><div>'+q.explainWrong+'</div>';
}

  setTimeout(function(){
    currentQuestion++;
    if(currentQuestion<questions.length){
      showQuestion();
    }else{
      showResult();
    }
  },1500);
}

function showResult(){

  // 🔥 STOP MUSIK
  const bgm = document.getElementById("bgm");
  bgm.pause();
  bgm.currentTime = 0;
  
  document.getElementById("game-screen").style.display="none";
  document.getElementById("result-screen").style.display="block";

  document.getElementById("resultNama").innerText =
    "Hasil " + nama;

  document.getElementById("stars").innerText =
    "⭐".repeat(benar);

  document.getElementById("resultScore").innerText =
    "Benar: " + benar + " | Salah: " + salah;

  // 🔥 PESAN DINAMIS
  let pesan = "";
  let skor = (benar / questions.length) * 100;

  if(skor >= 80){
    pesan = "🔥 Luar biasa! Kamu sudah paham konsep dasar grafik!";
  } else if(skor >= 60){
    pesan = "👍 Bagus! Tinggal sedikit lagi kamu akan semakin paham!";
  } else if(skor >= 40){
    pesan = "😊 Semangat! Kamu sudah mulai memahami, ayo lanjut belajar!";
  } else {
    pesan = "💪 Jangan menyerah! Ini baru awal, kita belajar bersama ya!";
  }

  document.getElementById("resultMessage").innerText = pesan;

  // simpan data tetap jalan
  simpanData();
}

function simpanData(){
  let data = JSON.parse(localStorage.getItem("hasilGame")) || [];

  let skor = Math.round((benar / questions.length) * 100);

  data.push({
    nama: nama,
    benar: benar,
    salah: salah,
    skor: skor
  });

  localStorage.setItem("hasilGame", JSON.stringify(data));
}

window.lihatDashboard = function(){

  document.getElementById("result-screen").style.display="none";
  document.getElementById("dashboard-screen").style.display="block";

  let data = JSON.parse(localStorage.getItem("hasilGame")) || [];
  let tbody = document.querySelector("#dataTable tbody");

  tbody.innerHTML = "";

  if(data.length === 0){
    tbody.innerHTML = "<tr><td colspan='4'>Belum ada data</td></tr>";
    return;
  }

  data.forEach(d => {
    let row = `
      <tr>
        <td>${d.nama}</td>
        <td>${d.benar}</td>
        <td>${d.salah}</td>
        <td>${d.skor}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

window.downloadExcel = function(){

  let data = JSON.parse(localStorage.getItem("hasilGame")) || [];

  let csv = "Nama,Benar,Salah,Skor\n";

  data.forEach(d => {
    csv += `${d.nama},${d.benar},${d.salah},${d.skor}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "hasil_pretest.csv";
  a.click();
}

window.resetDashboard = function(){

  let konfirmasi = confirm("Yakin ingin menghapus semua data?");

  if(konfirmasi){
    localStorage.removeItem("hasilGame");

    alert("Data berhasil dihapus!");

    // refresh tabel
    let tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "<tr><td colspan='4'>Belum ada data</td></tr>";
  }
}

window.kembaliKeAwal = function(){

  // reset tampilan saja (bukan data)
  document.getElementById("dashboard-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";

  // reset variabel game (biar mulai dari awal lagi)
  currentQuestion = 0;
  benar = 0;
  salah = 0;
  isAnswered = false;

  // stop musik
  const bgm = document.getElementById("bgm");
  if(bgm){
    bgm.pause();
    bgm.currentTime = 0;
  }
}

let musicPlaying = false;

window.toggleMusic = function(){
  const bgm = document.getElementById("bgm");

  if(musicPlaying){
    bgm.pause();
    musicPlaying = false;
  } else {
    bgm.play().catch(()=>{});
    musicPlaying = true;
  }
}

});