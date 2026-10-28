// ============================================================
// 全体進行管理
// ============================================================

const gameState = {
    stage: 1,
    side: "west",
    completed: false,
    stage1Played: false,
    stage2Played: false,
    stage3Played: false
};

const STAGE_INFO = {
    1: { number: "192" },
    2: { number: "232775" },
    3: { number: "621351421" }
};

function createWestWall() {
    const host = document.getElementById("side-content");
    if (!host) return;
    host.innerHTML = `
        <div class="result-area side-result-area">
            <div id="west-result" class="result-character">？</div>
        </div>
        <div class="west-panels">
            ${createWestPanel(1)}
            ${createWestPanel(2)}
            ${createWestPanel(3)}
        </div>
        <div class="panel-toggle-area">
            <button id="west-panel3-toggle" class="panel-toggle-button">パネル3を非表示</button>
        </div>
    `;
    initWest();
}

function createWestPanel(index) {
    return `
        <div class="west-panel">
            <h3>パネル${index}</h3>
            <div class="panel-description">曜日を選択</div>
            <div class="west-buttons">${createWestButtons()}</div>
            <div class="selection-display">選択：<span>なし</span></div>
        </div>`;
}

function createWestButtons() {
    return ["日", "月", "火", "水", "木", "金", "土"].map((day, i) => `
        <button type="button" class="west-day" data-button="${i}" data-value="${day}">${day}</button>
    `).join("");
}

function createSouthWall() {
    const host = document.getElementById("side-content");
    if (!host) return;
    host.innerHTML = `
        <div class="result-area side-result-area">
            <div id="south-result" class="result-character">？</div>
        </div>
        <div class="south-panels">
            ${createSouthPanel(1)}
            ${createSouthPanel(2)}
            ${createSouthPanel(3)}
        </div>
        <div class="panel-toggle-area">
            <button id="south-panel3-toggle" class="panel-toggle-button">パネル3を非表示</button>
        </div>
    `;
    initSouth();
}

function createSouthPanel(index) {
    return `
        <div class="south-panel">
            <h3>パネル${index}</h3>
            <div class="panel-description">数字を選択</div>
            <div class="south-number-buttons">${createSouthNumberButtons()}</div>
            <div class="south-mode-buttons">${createSouthModeButtons()}</div>
            <div class="selection-display">選択：<span>なし</span></div>
        </div>`;
}

function createSouthNumberButtons() {
    return [1, 2, 3, 4, 5, 6].map(n => `
        <button type="button" class="south-number-button" data-value="${n}">${n}</button>
    `).join("");
}

function createSouthModeButtons() {
    return `
        <button type="button" class="south-mode-button" data-mode="on">ON</button>
        <button type="button" class="south-mode-button" data-mode="unknown">???</button>`;
}

function createEastWall() {
    const host = document.getElementById("side-content");
    if (!host) return;
    host.innerHTML = `
        <div class="result-area side-result-area">
            <div id="east-result" class="result-character">？</div>
        </div>
        <div id="east-content"></div>
    `;
    initEast();
}

function createNorthWall() {
    const wall = document.getElementById("north-wall");
    if (!wall) return;
    wall.innerHTML = `
        <div class="wall-heading">
            <div class="wall-kicker">NORTH</div>
            <h2>北の壁</h2>
        </div>
        <div class="north-panels">
            ${createNorthPanel("west", "西", "north-west-character", "north-west-result")}
            ${createNorthPanel("south", "南", "north-south-character", "north-south-result")}
            ${createNorthPanel("east", "東", "north-east-character", "north-east-result")}
        </div>
        <div class="north-result-line">
            <span>適用結果</span>
            <strong id="north-result">？</strong>
        </div>
    `;
    initNorth();
}

function createNorthPanel(side, title, characterId, resultId) {
    return `
        <div class="north-panel" data-north-side="${side}">
            <h3>${title}</h3>
            <div id="${characterId}" class="north-character">？</div>
            <button type="button" class="north-toggle-button" data-side="${side}" aria-pressed="false">OFF</button>
            <div id="${resultId}" class="north-panel-result">？</div>
        </div>`;
}

function renderSide() {
    const title = document.getElementById("side-title");
    const content = document.getElementById("side-content");
    const prev = document.getElementById("side-prev");
    const next = document.getElementById("side-next");
    if (!title || !content) return;

    title.textContent = gameState.side === "west" ? "西の壁" : gameState.side === "south" ? "南の壁" : "東の壁";
    if (gameState.side === "west") createWestWall();
    if (gameState.side === "south") createSouthWall();
    if (gameState.side === "east") createEastWall();

    if (prev) prev.disabled = gameState.stage === 1 && gameState.side === "west";
    if (next) next.disabled = gameState.stage === 3 && gameState.side === "east";
}

function availableSides() {
    if (gameState.stage === 1) return ["west"];
    if (gameState.stage === 2) return ["west", "south"];
    return ["west", "south", "east"];
}

function moveSide(delta) {
    const sides = availableSides();
    let index = sides.indexOf(gameState.side);
    if (index < 0) index = 0;
    index = (index + delta + sides.length) % sides.length;
    gameState.side = sides[index];
    renderSide();
}

function updateNorthUnlocks() {
    document.querySelectorAll(".north-panel").forEach(panel => {
        const side = panel.dataset.northSide;
        const visible = side === "west" || (gameState.stage >= 2 && side === "south") || (gameState.stage >= 3 && side === "east");
        panel.hidden = !visible;
    });
}

function updateProblemText() {
    const text = document.getElementById("problem-text");
    const status = document.getElementById("stage-status");
    if (text) text.textContent = gameState.completed ? "621351421" : STAGE_INFO[gameState.stage].number;
    if (status) status.textContent = gameState.completed ? "GAME CLEAR" : `第${gameState.stage}段階`;
}

function getFinalAnswer() {
    const answer = document.getElementById("north-result");
    return answer ? answer.textContent.trim() : "？";
}

function updateFinalAnswer() {
    const target = document.getElementById("player-final-answer");
    const problem = document.getElementById("problem-text");
    if (!target) return;
    const answer = getFinalAnswer();
    target.textContent = answer || "？";
    target.classList.toggle("solved", gameState.completed);
    if (problem) problem.textContent = gameState.completed ? "621351421" : STAGE_INFO[gameState.stage].number;
}

function playClearSound(stage) {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const notes = stage === 1 ? [523.25, 659.25] : stage === 2 ? [523.25, 659.25, 783.99] : [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + i * 0.11 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.11 + 0.24);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.11);
            osc.stop(ctx.currentTime + i * 0.11 + 0.25);
        });
        setTimeout(() => ctx.close(), 900);
    } catch (e) {
        console.warn("clear sound unavailable", e);
    }
}

function isStage1Clear() {
    return typeof getWestSolvedCharacter === "function" && getWestSolvedCharacter() === "昔" && northState.on[0];
}

function isStage2Clear() {
    return typeof getWestSolvedCharacter === "function" && typeof getSouthSolvedCharacter === "function" &&
        getWestSolvedCharacter() === "明" && getSouthSolvedCharacter() === "日" && northState.on[0] && northState.on[1];
}

function isStage3Clear() {
    return typeof getWestSolvedCharacter === "function" && typeof getSouthSolvedCharacter === "function" && typeof getEastSolvedCharacter === "function" &&
        getWestSolvedCharacter() === "明" && getSouthSolvedCharacter() === "治" && getEastSolvedCharacter() === "解" &&
        northState.on[0] && northState.on[1] && !northState.on[2];
}

function advanceStageIfNeeded() {
    if (gameState.completed) return;

    if (gameState.stage === 1 && isStage1Clear()) {
        gameState.stage1Played = true;
        gameState.stage = 2;
        gameState.side = "south";
        playClearSound(1);
        updateProblemText();
        updateNorthUnlocks();
        renderSide();
        return;
    }

    if (gameState.stage === 2 && isStage2Clear()) {
        gameState.stage2Played = true;
        gameState.stage = 3;
        gameState.side = "east";
        playClearSound(2);
        updateProblemText();
        updateNorthUnlocks();
        renderSide();
        return;
    }

    if (gameState.stage === 3 && isStage3Clear()) {
        gameState.stage3Played = true;
        gameState.completed = true;
        gameState.side = "east";
        playClearSound(3);
        updateProblemText();
        updateNorthUnlocks();
        const clear = document.getElementById("clear-card");
        if (clear) clear.hidden = false;
        document.body.classList.add("game-clear");
    }
}

function refreshGameUI() {
    updateNorthUnlocks();
    updateProblemText();
    updateFinalAnswer();
    advanceStageIfNeeded();
}

window.addEventListener("DOMContentLoaded", () => {
    createNorthWall();
    northState.on = [false, false, false];
    gameState.stage = 1;
    gameState.side = "west";
    renderSide();
    updateNorthUnlocks();
    updateProblemText();
    updateFinalAnswer();

    document.getElementById("side-prev")?.addEventListener("click", () => moveSide(-1));
    document.getElementById("side-next")?.addEventListener("click", () => moveSide(1));

    setInterval(refreshGameUI, 100);
});
