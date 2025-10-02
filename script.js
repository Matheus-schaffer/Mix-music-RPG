let trackCount = 0;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let trackNodes = {}; 

// Lista fixa de trilhas sonoras
const trilhas = [
    { nome: "Combat Music Pirates of the Caribbe.mp3", arquivo: "sons/Pirates of the Caribbe- combat.mp3" },
    { nome: "Davy Jones theme", arquivo: "sons/Davy Jones theme.mp3" },
    { nome: "Tema Floresta-explo", arquivo: "sons/floresta.mp3" },
    { nome: "Caverna Myconid", arquivo: "sons/Caverna Myconid Village.mp3" },
    { nome: "explor", arquivo: "sons/explo.mp3" },
];

// Lista fixa de efeitos
const efeitos = [
    { nome: "Navio", arquivo: "sons/navio completo3.mp3" },
    { nome: "Mar", arquivo: "sons/Efeito Mar.mp3" },
    { nome: "Tocha", arquivo: "sons/tocha.mp3" },
];

/**
 * Cria/Retorna a conexão Web Audio com Filtro e Ganho (Volume).
 * Só cria os nós UMA VEZ.
 */
function connectAudio(playerId, initialVolume = 0.5) {
    let audio = document.getElementById(playerId);

    if (trackNodes[playerId]) return trackNodes[playerId];
    
    // VERIFICAÇÃO DE SEGURANÇA: Se o elemento <audio> não estiver pronto, retorna.
    if (!audio) {
        console.error(`Elemento de áudio com ID ${playerId} não encontrado.`);
        return {};
    }
    
    // Cria a Fonte a partir do elemento <audio>
    let source = audioCtx.createMediaElementSource(audio);
    
    // Cria o Filtro (Lowpass)
    let filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 20000; 

    // Cria o Ganho (volume)
    let gain = audioCtx.createGain();
    gain.gain.value = initialVolume; 

    // Conexão: Source -> Filter -> Gain -> Destination
    source.connect(filter).connect(gain).connect(audioCtx.destination);

    trackNodes[playerId] = { source, filter, gain };
    return trackNodes[playerId];
}

/**
 * Botão abafador (com transição suave)
 */
function toggleMuffle(playerId, btn) {
    let nodes = trackNodes[playerId];
    if (!nodes || !nodes.filter) return; // Verifica se os nós foram criados

    let filter = nodes.filter; 
    let now = audioCtx.currentTime;
    
    if (filter.frequency.value < 5000) {
        // Mudar para som limpo
        filter.frequency.linearRampToValueAtTime(20000, now + 0.3);
        btn.textContent = "🔊 Normal";
    } else {
        // Mudar para som abafado (corte de frequências altas)
        filter.frequency.linearRampToValueAtTime(800, now + 0.3);
        btn.textContent = "🔇 Abafado";
    }
}

// Função para criar um novo player
function addTrack() {
    trackCount++;
    const div = document.createElement("div");
    div.classList.add("track");

    const playerId = `player${trackCount}`;
    const btnId = `btn${trackCount}`;
    const initialVolume = 0.5; // Volume inicial padrão

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
            
            <input type="range" min="0" max="1" step="0.01" value="${initialVolume}"
                    oninput="trackNodes['${playerId}'].gain.gain.value=this.value">

            <button id="${btnId}" onclick="togglePlay('${playerId}','${btnId}')">▶️ Tocar</button>
            <button onclick="toggleLoop('${playerId}', this)">🔁 Loop Off</button>
            <button onclick="toggleMuffle('${playerId}', this)">🔊 Normal</button>
        </div>
    `;

    // CORREÇÃO ESSENCIAL: Anexar a div ao DOM antes de criar o contexto de áudio
    document.getElementById("tracks").appendChild(div);
    
    // Agora o elemento <audio> existe e podemos conectar o Web Audio
    connectAudio(playerId, initialVolume); 
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
        btn.textContent = "▶️ Tocar";
        btn.classList.remove("playing");
    };
}

// Play/Pause
function togglePlay(playerId, btnId) {
    let audio = document.getElementById(playerId);
    let btn = document.getElementById(btnId);

    // Garante que o Web Audio Context esteja ativo (necessário no Chrome/Firefox)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
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

// Loop
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

// Botões globais
document.getElementById("playAll").addEventListener("click", () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
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