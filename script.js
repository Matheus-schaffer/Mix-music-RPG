let trackCount = 0;

// Lista fixa de trilhas sonoras
const trilhas = [
  { nome: "Combat Music Pirates of the Caribbe.mp3", arquivo: "sons/Pirates of the Caribbe- combat.mp3" },
  { nome: "Davy Jones theme", arquivo: "sons/Davy Jones theme.mp3" },
];

// Lista fixa de efeitos
const efeitos = [
  { nome: "Navio", arquivo: "sons/navio completo3.mp3" },
  { nome: "Mar", arquivo: "sons/Efeito Mar.mp3" },
  { nome: "Tocha", arquivo: "sons/tocha.mp3" },
];

// Função para criar um novo player
function addTrack() {
  trackCount++;
  const div = document.createElement("div");
  div.classList.add("track");

  const playerId = `player${trackCount}`;
  const btnId = `btn${trackCount}`;

  div.innerHTML = `
    <div class="track-box">
      <div class="track-title">🎵 Trilha ${trackCount}</div>
      <label>Trilha Sonora:</label>
      <select onchange="loadTrack('${playerId}','${btnId}', this.value)">
        <option value="">-- Selecione uma trilha --</option>
        ${trilhas.map(m => `<option value='${m.arquivo}'>${m.nome}</option>`).join("")}
      </select>
      <br>
      <label>Efeito:</label>
      <select onchange="loadTrack('${playerId}','${btnId}', this.value)">
        <option value="">-- Selecione um efeito --</option>
        ${efeitos.map(e => `<option value='${e.arquivo}'>${e.nome}</option>`).join("")}
      </select>
      <br>
      <audio id="${playerId}"></audio>
      <input type="range" min="0" max="1" step="0.01" value="0.5"
             oninput="document.getElementById('${playerId}').volume=this.value">
      <button id="${btnId}" onclick="togglePlay('${playerId}','${btnId}')">▶️ Tocar</button>
      <button onclick="toggleLoop('${playerId}', this)">🔁 Loop Off</button>
    </div>
  `;

  document.getElementById("tracks").appendChild(div);
}

// Carregar trilha ou efeito no player
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
  btn.textContent = "▶️ Tocar";
  btn.classList.remove("playing");
  audio.onended = () => {
    if (!audio.loop) {
      btn.textContent = "▶️ Tocar";
      btn.classList.remove("playing");
    }
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

// Ativar/desativar loop da faixa
function toggleLoop(playerId, btn) {
  let audio = document.getElementById(playerId);
  audio.loop = !audio.loop;
  btn.textContent = audio.loop ? "🔁 Loop On" : "🔁 Loop Off";
  btn.classList.toggle("playing", audio.loop);
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
      audio.pause();
      btn.textContent = "▶️ Tocar";
      btn.classList.remove("playing");
    }
  }
});
