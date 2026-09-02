// ============================================================
// U asked time
// puzzle.js
//
// ・問題データ
// ・ゲーム進行管理
// ・壁の生成
// ・ステージクリア判定
// ・クリア履歴
// ・効果音
//
// 北の壁そのものは north.js が管理する。
// ============================================================

// ============================================================
// 問題データ
// ============================================================

const PUZZLE_DATA = {

    // ========================================================
    // 西の壁
    // ========================================================

    west: {

        assignment: [
            "日",
            "月",
            "火",
            "水",
            "木",
            "金",
            "土"
        ],

        answers: {

            // ==================================================
            // 2文字
            // ==================================================

            "日日": ["昌"],
            "日月": ["明"],
            "月月": ["朋"],
            "火火": ["炎"],
            "日木": ["杳"],
            "木木": ["林"],
            "木土": ["杜"],
            "土土": ["圭"],

            // ==================================================
            // 3文字
            // ==================================================

            "日日日": ["晶"],
            "月月木": ["棚"],
            "火木木": ["焚"],
            "木木木": ["森"],
            "木土土": ["桂"],

            "土土日": ["昔"],
            "日土土": ["昔"]

        }

    },


    // ========================================================
    // 南の壁
    // ========================================================

    south: {

        onAssignment: [
            "イ",
            "ニ",
            "サ",
            "シ",
            "ゴ",
            "ロ"
        ],

        unknownAssignment: [
            "ヒ",
            "フ",
            "ミ",
            "ヨ",
            "イ",
            "ム"
        ],

        characterOrder: [
            "イ",
            "ニ",
            "サ",
            "シ",
            "ゴ",
            "ロ",
            "ヒ",
            "フ",
            "ミ",
            "ヨ",
            "ム"
        ],

        answers: {

            // ==================================================
            // 2文字
            // ==================================================

            "イニ": ["仁"],
            "イヒ": ["化"],
            "イム": ["仏"],
            "ヒヒ": ["比"],
            "ムロ": ["台"],
            "ロノロ": ["呂"],
            "ロヒ": ["叱"],
            "ロロ": ["回", "日"],

            // ==================================================
            // 3文字
            // ==================================================

            "イニム": ["伝"],
            "サイヒ": ["花"],
            "サニム": ["芸"],
            "シムロ": ["治"],
            "ロロヒ": ["旨"],
            "ロロロ": ["品"]

        }

    }

};


// ============================================================
// ゲーム状態
// ============================================================

const gameState = {

    // --------------------------------------------------------
    // 1 = 昔
    // 2 = 今
    // 3 = 明後日
    // 4 = 大正解
    // --------------------------------------------------------

    stage: 1,

    side: "west",

    completed: false,

    stage1Played: false,
    stage2Played: false,
    stage3Played: false,
    stage4Played: false,

    // --------------------------------------------------------
    // ステージクリア演出中
    //
    // true の間は次のステージへ進まない。
    // --------------------------------------------------------

    stageClearShowing: false,

    clearHistory: []
};



// ============================================================
// 問題番号
//
// 必ずここを基準にする。
//
// 第1問 → 914238 → 昔
// 第2問 → 892    → 今
// 第3問 → 232775 → 明後日
// 第4問 → 628358428 → 大正解
// ============================================================

const STAGE_INFO = {

    1: {
        number: "914238",
        answer: "昔"
    },

    2: {
        number: "892",
        answer: "今"
    },

    3: {
        number: "232775",
        answer: "明後日"
    },

    4: {
        number: "628358428",
        answer: "大正解"
    }

};


const FINAL_PROBLEM =
    STAGE_INFO[4].number;



// ============================================================
// 現在の問題番号を取得
// ============================================================

function getCurrentProblemNumber() {

    if (gameState.completed) {

        return STAGE_INFO[4].number;

    }

    const info =
        STAGE_INFO[gameState.stage];

    if (!info) {

        return "";

    }

    return info.number;
}



// ============================================================
// 西の壁
// ============================================================

function createWestWall() {

    const host =
        document.getElementById("side-content");

    if (!host) {
        return;
    }

    host.innerHTML = `

        <div class="result-area side-result-area">


            <div
                id="west-result"
                class="result-character"
            >
                ？
            </div>

        </div>

        <div class="west-panels">

            ${createWestPanel(1)}
            ${createWestPanel(2)}
            ${createWestPanel(3)}

        </div>

        <div class="panel-toggle-area">

            <button
                id="west-panel3-toggle"
                class="panel-toggle-button"
            >
                パネル3を非表示
            </button>

        </div>
    `;

    initWest();
}



function createWestPanel(index) {

    return `

        <div class="west-panel">

            <h3>
                パネル${index}
            </h3>

            <div class="panel-description">
                曜日を選択
            </div>

            <div class="west-buttons">
                ${createWestButtons()}
            </div>

            <div class="selection-display">
                選択：
                <span>なし</span>
            </div>

        </div>
    `;
}



function createWestButtons() {

    return [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
    ]
    .map(
        (day, i) => `
            <button
                type="button"
                class="west-day"
                data-button="${i}"
                data-value="${day}"
            >
                ${day}
            </button>
        `
    )
    .join("");
}



// ============================================================
// 南の壁
// ============================================================

function createSouthWall() {

    const host =
        document.getElementById("side-content");

    if (!host) {
        return;
    }

    host.innerHTML = `

        <div class="result-area side-result-area">


            <div
                id="south-result"
                class="result-character"
            >
                ？
            </div>

        </div>

        <div class="south-panels">

            ${createSouthPanel(1)}
            ${createSouthPanel(2)}
            ${createSouthPanel(3)}

        </div>

        <div class="panel-toggle-area">

            <button
                id="south-panel3-toggle"
                class="panel-toggle-button"
            >
                パネル3を非表示
            </button>

        </div>
    `;

    initSouth();
}



function createSouthPanel(index) {

    return `

        <div class="south-panel">

            <h3>
                パネル${index}
            </h3>

            <div class="panel-description">
                数字を選択
            </div>

            <div class="south-number-buttons">
                ${createSouthNumberButtons()}
            </div>

            <div class="south-mode-buttons">
                ${createSouthModeButtons()}
            </div>

            <div class="selection-display">
                選択：
                <span>なし</span>
            </div>

        </div>
    `;
}



function createSouthNumberButtons() {

    return [1, 2, 3, 4, 5, 6]
        .map(
            n => `
                <button
                    type="button"
                    class="south-number-button"
                    data-value="${n}"
                >
                    ${n}
                </button>
            `
        )
        .join("");
}



function createSouthModeButtons() {

    return `

        <button
            type="button"
            class="south-mode-button"
            data-mode="on"
        >
            ON
        </button>

        <button
            type="button"
            class="south-mode-button"
            data-mode="unknown"
        >
            ???
        </button>
    `;
}



// ============================================================
// 東の壁
// ============================================================

function createEastWall() {

    const host =
        document.getElementById("side-content");

    if (!host) {
        return;
    }

    host.innerHTML = `

        <div class="result-area side-result-area">


            <div
                id="east-result"
                class="result-character"
            >
                ？
            </div>

        </div>

        <div id="east-content"></div>
    `;

    initEast();
}



// ============================================================
// クリア履歴
// ============================================================

function createClearHistory() {

    const history =
        document.getElementById("clear-history");

    if (!history) {
        return;
    }

    history.innerHTML = `

        <div class="history-empty">
            まだクリアした問題はありません。
        </div>
    `;
}



function renderClearHistory() {

    const history =
        document.getElementById("clear-history");

    if (!history) {
        return;
    }

    if (
        gameState.clearHistory.length === 0
    ) {

        history.innerHTML = `

            <div class="history-empty">
                まだクリアした問題はありません。
            </div>
        `;

        return;
    }


    history.innerHTML =
        gameState.clearHistory
            .map(
                item => `

                    <div class="history-item">

                        <div class="history-stage">
                            ${
                                item.stage === 4
                                    ? "FINAL"
                                    : `STAGE ${item.stage}`
                            }
                        </div>

                        <div class="history-problem">

                            <span>
                                問題
                            </span>

                            <strong>
                                ${escapeHTML(item.problem)}
                            </strong>

                        </div>

                        <div class="history-answer">

                            <span>
                                解答
                            </span>

                            <strong class="history-answer-character">
                                ${escapeHTML(item.answer)}
                            </strong>

                        </div>

                    </div>
                `
            )
            .join("");
}



// ============================================================
// HTMLエスケープ
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        typeof value === "undefined"
    ) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



// ============================================================
// クリア履歴追加
// ============================================================

function addClearHistory(
    stage,
    problem,
    answer
) {

    const exists =
        gameState.clearHistory.some(
            item =>
                item.stage === stage
        );

    if (exists) {
        return;
    }

    gameState.clearHistory.push({

        stage: stage,

        problem: problem,

        answer: answer

    });

    renderClearHistory();
}



// ============================================================
// 現在の問題文
// ============================================================

function updateProblemText() {

    const text =
        document.getElementById("problem-text");

    const status =
        document.getElementById("stage-status");

    if (!text || !status) {
        return;
    }


    if (gameState.completed) {

        text.textContent =
            STAGE_INFO[4].number;

        status.textContent =
            "GAME CLEAR";

        return;
    }


    const info =
        STAGE_INFO[gameState.stage];

    if (!info) {
        return;
    }

    text.textContent =
        info.number;

    status.textContent =
        `第${gameState.stage}段階`;
}



// ============================================================
// 北の壁解放
// ============================================================

function updateNorthUnlocks() {

    const wall =
        document.getElementById("north-wall");

    if (!wall) {
        return;
    }

    let unlockLevel = 0;


    if (gameState.completed) {

        unlockLevel = 3;

    }

    else {

        unlockLevel =
            Math.max(
                0,
                gameState.stage - 1
            );

    }


    wall.hidden =
        unlockLevel === 0;


    if (
        typeof northState === "undefined"
    ) {

        return;

    }


    if (
        !Array.isArray(
            northState.unlocked
        )
    ) {

        northState.unlocked = [
            false,
            false,
            false
        ];

    }


    if (unlockLevel >= 1) {

        northState.unlocked[0] =
            true;

    }

    if (unlockLevel >= 2) {

        northState.unlocked[1] =
            true;

    }

    if (unlockLevel >= 3) {

        northState.unlocked[2] =
            true;

    }


    if (
        typeof updateNorth ===
        "function"
    ) {

        updateNorth();

    }
}



// ============================================================
// 利用可能な壁
// ============================================================

function availableSides() {

    const sides = [
        "west"
    ];


    if (
        gameState.stage >= 3 ||
        gameState.completed
    ) {

        sides.push("south");

    }


    if (
        gameState.stage >= 4 ||
        gameState.completed
    ) {

        sides.push("east");

    }


    return sides;
}



// ============================================================
// 壁切替
// ============================================================

function moveSide(delta) {

    const sides =
        availableSides();

    if (sides.length === 0) {
        return;
    }

    let index =
        sides.indexOf(
            gameState.side
        );


    if (index < 0) {
        index = 0;
    }


    index += delta;


    if (index < 0) {

        index =
            sides.length - 1;

    }


    if (index >= sides.length) {

        index = 0;

    }


    gameState.side =
        sides[index];


    renderSide();
}



// ============================================================
// 現在の壁
// ============================================================

function renderSide() {

    const title =
        document.getElementById("side-title");

    const content =
        document.getElementById("side-content");

    const prev =
        document.getElementById("side-prev");

    const next =
        document.getElementById("side-next");


    if (!title || !content) {
        return;
    }


    const sides =
        availableSides();


    if (
        !sides.includes(
            gameState.side
        )
    ) {

        gameState.side =
            sides[0];

    }


    if (
        gameState.side === "west"
    ) {

        title.textContent =
            "西の壁";

        createWestWall();

    }


    else if (
        gameState.side === "south"
    ) {

        title.textContent =
            "南の壁";

        createSouthWall();

    }


    else if (
        gameState.side === "east"
    ) {

        title.textContent =
            "東の壁";

        createEastWall();

    }


    if (prev) {

        prev.disabled =
            sides.length <= 1;

    }


    if (next) {

        next.disabled =
            sides.length <= 1;

    }
}



// ============================================================
// 北の計算
// ============================================================

function getNorthCalculatedAnswer() {

    if (
        typeof applyNorthTimeChange !==
        "function"
    ) {

        return null;

    }


    const west =
        typeof getWestSolvedCharacter ===
        "function"
            ? getWestSolvedCharacter()
            : null;


    const south =
        typeof getSouthSolvedCharacter ===
        "function"
            ? getSouthSolvedCharacter()
            : null;


    const east =
        typeof getEastSolvedCharacter ===
        "function"
            ? getEastSolvedCharacter()
            : null;


    return applyNorthTimeChange(
        west,
        south,
        east
    );
}



// ============================================================
// 最終解答
// ============================================================

function getFinalAnswer() {

    const answer =
        document.getElementById(
            "north-result"
        );


    if (!answer) {
        return "？";
    }


    return (
        answer.textContent.trim()
        || "？"
    );
}



// ============================================================
// 最終解答表示
// ============================================================

function updateFinalAnswer() {

    const target =
        document.getElementById(
            "player-final-answer"
        );


    if (!target) {
        return;
    }


    let answer =
        getFinalAnswer();


    if (
        gameState.stage === 1 &&
        typeof getWestSolvedCharacter ===
        "function"
    ) {

        const west =
            getWestSolvedCharacter();

        answer =
            west || "？";

    }


    if (
        gameState.stage >= 2 ||
        gameState.completed
    ) {

        answer =
            getFinalAnswer();

    }


    target.textContent =
        answer || "？";


    const solved =
        answer === "昔" ||
        answer === "今" ||
        answer === "明後日" ||
        answer === "大正解";


    target.classList.toggle(
        "solved",
        solved
    );
}



// ============================================================
// Web Audio
// ============================================================

let puzzleAudioContext = null;



function getPuzzleAudioContext() {

    if (puzzleAudioContext) {
        return puzzleAudioContext;
    }


    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContextClass) {
            return null;
        }


        puzzleAudioContext =
            new AudioContextClass();


        return puzzleAudioContext;

    }

    catch (e) {

        console.warn(
            "AudioContext unavailable",
            e
        );

        return null;
    }
}



// ============================================================
// 文字完成音
// ============================================================

function playCharacterCompleteSound() {

    const ctx =
        getPuzzleAudioContext();


    if (!ctx) {
        return;
    }


    try {

        if (
            ctx.state ===
            "suspended"
        ) {

            ctx.resume();

        }


        const now =
            ctx.currentTime;


        const notes = [
            659.25,
            783.99
        ];


        notes.forEach(
            (frequency, index) => {

                const oscillator =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                oscillator.type =
                    "sine";


                const start =
                    now +
                    index * 0.07;


                oscillator.frequency.setValueAtTime(
                    frequency,
                    start
                );


                gain.gain.setValueAtTime(
                    0.0001,
                    start
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.12,
                    start + 0.015
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    start + 0.16
                );


                oscillator.connect(gain);

                gain.connect(
                    ctx.destination
                );


                oscillator.start(start);

                oscillator.stop(
                    start + 0.18
                );

            }
        );

    }

    catch (e) {

        console.warn(
            "character sound unavailable",
            e
        );

    }
}



// ============================================================
// ステージクリア音
// ============================================================

function playClearSound(stage) {

    const ctx =
        getPuzzleAudioContext();


    if (!ctx) {
        return;
    }


    try {

        if (
            ctx.state ===
            "suspended"
        ) {

            ctx.resume();

        }


        const now =
            ctx.currentTime;


        let notes;


        if (stage === 1) {

            notes = [
                523.25,
                659.25
            ];

        }

        else if (stage === 2) {

            notes = [
                523.25,
                659.25,
                783.99
            ];

        }

        else if (stage === 3) {

            notes = [
                523.25,
                659.25,
                783.99,
                1046.5
            ];

        }

        else {

            notes = [
                523.25,
                659.25,
                783.99,
                1046.5,
                1318.51
            ];

        }


        notes.forEach(
            (frequency, index) => {

                const oscillator =
                    ctx.createOscillator();


                const gain =
                    ctx.createGain();


                oscillator.type =
                    "sine";


                const start =
                    now +
                    index * 0.11;


                oscillator.frequency.setValueAtTime(
                    frequency,
                    start
                );


                gain.gain.setValueAtTime(
                    0.0001,
                    start
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.16,
                    start + 0.015
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    start + 0.24
                );


                oscillator.connect(gain);

                gain.connect(
                    ctx.destination
                );


                oscillator.start(start);

                oscillator.stop(
                    start + 0.25
                );

            }
        );

    }

    catch (e) {

        console.warn(
            "clear sound unavailable",
            e
        );

    }
}



// ============================================================
// 文字完成音監視
// ============================================================

const resultSoundState = {

    west: "？",

    south: "？",

    east: "？",

    north: "？"

};



function checkCharacterCompleteSounds() {

    const results = {

        west:
            document
                .getElementById("west-result")
                ?.textContent
                .trim()
            || "？",


        south:
            document
                .getElementById("south-result")
                ?.textContent
                .trim()
            || "？",


        east:
            document
                .getElementById("east-result")
                ?.textContent
                .trim()
            || "？",


        north:
            document
                .getElementById("north-result")
                ?.textContent
                .trim()
            || "？"

    };


    let formed = false;


    Object.keys(results).forEach(
        side => {

            const previous =
                resultSoundState[side];


            const current =
                results[side];


            if (
                current !== "？" &&
                current !== "" &&
                current !== previous
            ) {

                formed = true;

            }


            resultSoundState[side] =
                current;

        }
    );


    if (formed) {

        playCharacterCompleteSound();

    }
}



// ============================================================
// ステージクリア判定
// ============================================================

function isStage1Clear() {

    return (

        typeof getWestSolvedCharacter ===
        "function" &&

        getWestSolvedCharacter() ===
        "昔"

    );
}



function isStage2Clear() {

    return (

        getFinalAnswer() ===
        "今"

    );
}



function isStage3Clear() {

    return (

        getFinalAnswer() ===
        "明後日"

    );
}



function isStage4Clear() {

    return (

        getFinalAnswer() ===
        "大正解"

    );
}



// ============================================================
// 北のON/OFF状態
//
// ステージ移行時には何もしない。
// ============================================================

function resetNorthOnStateFromGame() {

    // 北のON/OFFはステージ移行でリセットしない。

}



// ============================================================
// ステージクリア演出
//
// stage 1 → 昔
// stage 2 → 今
// stage 3 → 明後日
//
// 演出中はゲームのステージを変更しない。
// 約1.25秒後に次ステージへ移行する。
// ============================================================

function playStageClearEffect(
    stage,
    character,
    nextStageCallback
) {

    // --------------------------------------------------------
    // 二重実行防止
    // --------------------------------------------------------

    if (gameState.stageClearShowing) {
        return;
    }


    gameState.stageClearShowing =
        true;


    // --------------------------------------------------------
    // ステージクリア音
    // --------------------------------------------------------

    playClearSound(stage);


    // --------------------------------------------------------
    // index.html の演出を呼び出す
    // --------------------------------------------------------

    if (
        typeof window.showStageClear ===
        "function"
    ) {

        window.showStageClear(
            stage,
            character
        );

    }


    // --------------------------------------------------------
    // 演出終了後に次ステージへ
    //
    // index.html 側の表示時間は1200ms。
    // 少しだけ余裕を持たせて1250ms。
    // --------------------------------------------------------

    setTimeout(
        function () {

            gameState.stageClearShowing =
                false;


            if (
                typeof nextStageCallback ===
                "function"
            ) {

                nextStageCallback();

            }

        },
        1250
    );
}



// ============================================================
// 第1 → 第2
//
// 昔をクリア
// ============================================================

function advanceStage1() {

    if (gameState.stage1Played) {
        return;
    }


    gameState.stage1Played =
        true;


    // --------------------------------------------------------
    // 第1問の履歴
    //
    // 914238 → 昔
    // --------------------------------------------------------

    addClearHistory(
        1,
        STAGE_INFO[1].number,
        STAGE_INFO[1].answer
    );


    // --------------------------------------------------------
    // 北のON/OFFは維持
    // --------------------------------------------------------

    resetNorthOnStateFromGame();


    // --------------------------------------------------------
    // クリア演出
    //
    // この時点ではまだ stage = 1 のまま。
    // 演出終了後に第2段階へ進む。
    // --------------------------------------------------------

    playStageClearEffect(
        1,
        "昔",
        function () {

            gameState.stage =
                2;


            gameState.side =
                "west";


            // ----------------------------------------------
            // 北の左パネルを解放
            // ----------------------------------------------

            updateNorthUnlocks();


            updateProblemText();

            renderSide();

            updateFinalAnswer();

            renderClearHistory();

        }
    );
}



// ============================================================
// 第2 → 第3
//
// 今をクリア
// ============================================================

function advanceStage2() {

    if (gameState.stage2Played) {
        return;
    }


    gameState.stage2Played =
        true;


    // --------------------------------------------------------
    // 第2問の履歴
    //
    // 892 → 今
    // --------------------------------------------------------

    addClearHistory(
        2,
        STAGE_INFO[2].number,
        STAGE_INFO[2].answer
    );


    // --------------------------------------------------------
    // 北のON/OFFは維持
    // --------------------------------------------------------

    resetNorthOnStateFromGame();


    // --------------------------------------------------------
    // クリア演出
    //
    // 演出終了後に第3段階へ進む。
    // --------------------------------------------------------

    playStageClearEffect(
        2,
        "今",
        function () {

            gameState.stage =
                3;


            gameState.side =
                "south";


            // ----------------------------------------------
            // 北の中央パネルを解放
            // ----------------------------------------------

            updateNorthUnlocks();


            updateProblemText();

            renderSide();

            updateFinalAnswer();

            renderClearHistory();

        }
    );
}



// ============================================================
// 第3 → 第4
//
// 明後日をクリア
// ============================================================

function advanceStage3() {

    if (gameState.stage3Played) {
        return;
    }


    gameState.stage3Played =
        true;


    // --------------------------------------------------------
    // 第3問の履歴
    //
    // 232775 → 明後日
    // --------------------------------------------------------

    addClearHistory(
        3,
        STAGE_INFO[3].number,
        STAGE_INFO[3].answer
    );


    // --------------------------------------------------------
    // 北のON/OFFは維持
    // --------------------------------------------------------

    resetNorthOnStateFromGame();


    // --------------------------------------------------------
    // クリア演出
    //
    // 演出終了後に第4段階へ進む。
    // --------------------------------------------------------

    playStageClearEffect(
        3,
        "明後日",
        function () {

            gameState.stage =
                4;


            gameState.side =
                "east";


            // ----------------------------------------------
            // 北の右パネルを解放
            // ----------------------------------------------

            updateNorthUnlocks();


            updateProblemText();

            renderSide();

            updateFinalAnswer();

            renderClearHistory();

        }
    );
}



// ============================================================
// 第4 → GAME CLEAR
//
// 大正解をクリア
// ============================================================

function advanceStage4() {

    if (gameState.stage4Played) {
        return;
    }


    gameState.stage4Played =
        true;


    // --------------------------------------------------------
    // FINALの履歴
    //
    // 628358428 → 大正解
    // --------------------------------------------------------

    addClearHistory(
        4,
        STAGE_INFO[4].number,
        STAGE_INFO[4].answer
    );


    gameState.completed =
        true;


    gameState.side =
        "east";


    // --------------------------------------------------------
    // 最終クリア音
    // --------------------------------------------------------

    playClearSound(4);


    updateProblemText();

    updateNorthUnlocks();

    renderSide();

    updateFinalAnswer();

    renderClearHistory();


    const clear =
        document.getElementById(
            "clear-card"
        );


    if (clear) {

        clear.hidden =
            false;

    }


    document.body.classList.add(
        "game-clear"
    );
}



// ============================================================
// ステージ進行
// ============================================================

function advanceStageIfNeeded() {

    // --------------------------------------------------------
    // ゲームクリア済み
    // --------------------------------------------------------

    if (gameState.completed) {
        return;
    }


    // --------------------------------------------------------
    // ステージクリア演出中
    //
    // 演出が終わるまで再判定しない。
    // --------------------------------------------------------

    if (gameState.stageClearShowing) {
        return;
    }


    // --------------------------------------------------------
    // 第1問
    // --------------------------------------------------------

    if (
        gameState.stage === 1 &&
        isStage1Clear()
    ) {

        advanceStage1();

        return;

    }


    // --------------------------------------------------------
    // 第2問
    // --------------------------------------------------------

    if (
        gameState.stage === 2 &&
        isStage2Clear()
    ) {

        advanceStage2();

        return;

    }


    // --------------------------------------------------------
    // 第3問
    // --------------------------------------------------------

    if (
        gameState.stage === 3 &&
        isStage3Clear()
    ) {

        advanceStage3();

        return;

    }


    // --------------------------------------------------------
    // 第4問
    // --------------------------------------------------------

    if (
        gameState.stage === 4 &&
        isStage4Clear()
    ) {

        advanceStage4();

        return;

    }
}



// ============================================================
// UI更新
// ============================================================

function refreshGameUI() {

    updateNorthUnlocks();

    updateProblemText();

    updateFinalAnswer();

    checkCharacterCompleteSounds();

    advanceStageIfNeeded();

    updateProblemText();

    updateFinalAnswer();

    renderClearHistory();
}



// ============================================================
// 初期化
// ============================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // ----------------------------------------------------
        // ゲーム状態初期化
        // ----------------------------------------------------

        gameState.stage =
            1;


        gameState.side =
            "west";


        gameState.completed =
            false;


        gameState.stage1Played =
            false;


        gameState.stage2Played =
            false;


        gameState.stage3Played =
            false;


        gameState.stage4Played =
            false;


        gameState.stageClearShowing =
            false;


        gameState.clearHistory =
            [];


        // ----------------------------------------------------
        // 北の初期化
        // ----------------------------------------------------

        if (
            typeof initNorth ===
            "function"
        ) {

            initNorth();

        }


        // ----------------------------------------------------
        // 北の状態を完全初期化
        //
        // ゲーム開始時だけ実行。
        // ステージ移行では実行しない。
        // ----------------------------------------------------

        if (
            typeof resetNorthAllState ===
            "function"
        ) {

            resetNorthAllState();

        }


        // ----------------------------------------------------
        // クリア履歴
        // ----------------------------------------------------

        createClearHistory();


        // ----------------------------------------------------
        // 初期UI
        // ----------------------------------------------------

        updateNorthUnlocks();

        updateProblemText();

        renderSide();

        updateFinalAnswer();

        renderClearHistory();


        // ----------------------------------------------------
        // 壁切替ボタン
        // ----------------------------------------------------

        const prev =
            document.getElementById(
                "side-prev"
            );


        const next =
            document.getElementById(
                "side-next"
            );


        if (prev) {

            prev.addEventListener(
                "click",
                () => {

                    moveSide(-1);

                }
            );

        }


        if (next) {

            next.addEventListener(
                "click",
                () => {

                    moveSide(1);

                }
            );

        }


        // ----------------------------------------------------
        // 定期更新
        // ----------------------------------------------------

        setInterval(
            refreshGameUI,
            100
        );

    }
);
