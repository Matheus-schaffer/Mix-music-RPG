let trackCount = 0;

// Lista fixa de músicas
const musicas = [
  { nome: "Som do Mar", arquivo: "sons/mar.mp3" },
  { nome: "Som do Vento", arquivo: "sons/vento.mp3" },
  { nome: "Navio", arquivo: "sons/navio completo.mp3" }
];

// Função para criar um novo player
function addTrack() {
  trackCount++;
  const div = document.createElement("div");
  div.classList.add("track");

  const selectId = `select${trackCount}`;
  const playerId = `player${trackCount}`;
  const btnId = `btn${trackCount}`;

  div.innerHTML = `
    🎵 Trilha ${trackCount}
    <br>
    <select id="${selectId}" onchange="loadTrack('${playerId}','${btnId}', this.value)">
      <option value="">-- Selecione uma música --</option>
      ${musicas.map(m => `<option value="${m.arquivo}">${m.nome}</option>`).join("")}
    </select>
    <br>
    <audio id="${playerId}" loop></audio>
    <input type="range" min="0" max="1" step="0.01" value="0.5"
           oninput="document.getElementById('${playerId}').volume=this.value">
    <button id="${btnId}" onclick="togglePlay('${playerId}','${btnId}')">▶️ Tocar</button>
  `;

  document.getElementById("tracks").appendChild(div);
}

// Carregar música no player
function loadTrack(playerId, btnId, src) {
  let audio = document.getElementById(playerId);
  let btn = document.getElementById(btnId);
  if (!src) {
    audio.pause();
    audio.src = "";
    btn.textContent = "▶️ Tocar";
    btn.classList.remove("playing");
    return;
  }
  audio.src = src;
  audio.play();
  btn.textContent = "⏸ Pausar";
  btn.classList.add("playing");

  audio.onended = () => {
    btn.textContent = "▶️ Tocar";
    btn.classList.remove("playing");
  };
}

// Play/Pause real (continua de onde parou)
function togglePlay(playerId, btnId) {
  let audio = document.getElementById(playerId);
  let btn = document.getElementById(btnId);
  if (audio.paused) {
    audio.play();
    btn.textContent = "⏸ Pausar";
    btn.classList.add("playing");
  } else {
    audio.pause();
    btn.textContent = "▶️ Tocar";
    btn.classList.remove("playing");
  }
}

// Botão "Adicionar Faixa"
document.getElementById("addTrack").addEventListener("click", addTrack);

// Criar 2 faixas iniciais
addTrack();
addTrack();

// Botões globais: Tocar tudo / Parar tudo
document.getElementById("playAll").addEventListener("click", () => {
  for (let i = 1; i <= trackCount; i++) {
    const audio = document.getElementById(`player${i}`);
    const btn = document.getElementById(`btn${i}`);
    if (audio.src && audio.paused) {
      audio.play();
      btn.textContent = "⏸ Pausar";
      btn.classList.add("playing");
    }
  }
});

document.getElementById("stopAll").addEventListener("click", () => {
  for (let i = 1; i <= trackCount; i++) {
    const audio = document.getElementById(`player${i}`);
    const btn = document.getElementById(`btn${i}`);
    if (audio.src) {
      audio.pause();  // pausa real, mantém posição
      btn.textContent = "▶️ Tocar";
      btn.classList.remove("playing");
    }
  }
});
