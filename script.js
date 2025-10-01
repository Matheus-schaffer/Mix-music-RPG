let trackCount = 0;

// Lista fixa de trilhas sonoras
const trilhas = [
  { nome: "Combat Music The Witcher.mp3", arquivo: "sons/Combat Music The Witcher.mp3" },
];

// Lista fixa de efeitos
const efeitos = [
  { nome: "Navio", arquivo: "sons/navio completo.mp3" },
  { nome: "Corda Navio", arquivo: "sons/corda.mp3" },
];

// Adicionar novo player
document.getElementById("addPlayer").addEventListener("click", () => {
  trackCount++;
  const container = document.getElementById("players");

  const div = document.createElement("div");
  div.className = "player";

  const select = document.createElement("select");
  select.id = `select${trackCount}`;
  select.innerHTML = `<option value="">-- Escolha uma faixa --</option>`;
  [...trilhas, ...efeitos].forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.arquivo;
    opt.textContent = item.nome;
    select.appendChild(opt);
  });

  const btn = document.createElement("button");
  btn.id = `btn${trackCount}`;
  btn.textContent = "▶️ Tocar";

  const loopBtn = document.createElement("button");
  loopBtn.id = `loop${trackCount}`;
  loopBtn.textContent = "🔁 Loop Off";
  loopBtn.dataset.loop = "false";

  const audio = document.createElement("audio");
  audio.id = `player${trackCount}`;

  div.appendChild(select);
  div.appendChild(btn);
  div.appendChild(loopBtn);
  div.appendChild(audio);
  container.appendChild(div);

  // Evento para carregar a faixa
  select.addEventListener("change", () =>
    loadTrack(audio.id, btn.id, select.value)
  );

  // Play/Pause
  btn.addEventListener("click", () => {
    if (audio.src) {
      if (audio.paused) {
        audio.play();
        btn.textContent = "⏸️ Pausar";
        btn.classList.add("playing");
      } else {
        audio.pause();
        btn.textContent = "▶️ Tocar";
        btn.classList.remove("playing");
      }
    }
  });

  // Loop
  loopBtn.addEventListener("click", () => {
    if (loopBtn.dataset.loop === "false") {
      audio.loop = true;
      loopBtn.dataset.loop = "true";
      loopBtn.textContent = "🔁 Loop On";
    } else {
      audio.loop = false;
      loopBtn.dataset.loop = "false";
      loopBtn.textContent = "🔁 Loop Off";
    }
  });
});

// Função para carregar trilha no player
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

  // Ao terminar, só reseta o botão se não estiver em loop
  audio.onended = () => {
    if (!audio.loop) {
      btn.textContent = "▶️ Tocar";
      btn.classList.remove("playing");
    } else {
      audio.play(); // 🔥 garante o replay
    }
  };
}

// Botão parar tudo
document.getElementById("stopAll").addEventListener("click", () => {
  for (let i = 1; i <= trackCount; i++) {
    const audio = document.getElementById(`player${i}`);
    const btn = document.getElementById(`btn${i}`);
    if (audio && audio.src) {
      audio.pause();
      audio.currentTime = 0; // 🔥 volta pro início
      btn.textContent = "▶️ Tocar";
      btn.classList.remove("playing");
    }
  }
});
