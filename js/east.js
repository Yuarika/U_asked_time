// ============================================================
// 東の壁 / east.js
// ============================================================
//
// 東の壁
//
// 左：将棋
//   ・普通の9×9初期配置
//   ・駒の文字は非表示
//   ・王が選択された状態で開始
//   ・王なら上に「王」
//   ・それ以外なら「？」
//
// 中：かな
//   ・10個のボタン
//   ・3文字を選択
//   ・順番は関係なし
//   ・あ・た・ま → 頭
//   ・それ以外 → ？
//
// 右：十二支
//   ・12個のボタン
//   ・十二支の文字は非表示
//   ・午が選択された状態で開始
//   ・午なら上に「馬」
//   ・それ以外なら「？」
//
// 正解
//   将棋 = 角
//   かな = かたな（順不同）
//   十二支 = 丑
//   → 解
//
// ============================================================


// ============================================================
// 東の状態
// ============================================================

const eastState = {

    // 将棋
    // 初期状態は王

    shogiPiece: "王",


    // かな
    // 初期状態は「あ・た・ま」

    kana: [
        "あ",
        "た",
        "ま"
    ],


    // 十二支
    // 初期状態は午

    zodiac: "午",


    // 旧仕様との互換用

    panel3Visible: true,


    // 複数候補がある場合の選択

    answerChoice: null

};


// ============================================================
// 将棋盤
// ============================================================

const SHOGI_BOARD = [

    [
        "香", "桂", "銀", "金", "王", "金", "銀", "桂", "香"
    ],

    [
        "", "飛", "", "", "", "", "", "角", ""
    ],

    [
        "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"
    ],

    [
        "", "", "", "", "", "", "", "", ""
    ],

    [
        "", "", "", "", "", "", "", "", ""
    ],

    [
        "", "", "", "", "", "", "", ""
    ],

    [
        "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩", "歩"
    ],

    [
        "", "角", "", "", "", "", "", "飛", ""
    ],

    [
        "香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"
    ]

];


// ============================================================
// かな
// ============================================================

const EAST_KANA = [

    "あ",
    "か",
    "さ",
    "た",
    "な",
    "は",
    "ま",
    "や",
    "ら",
    "わ"

];


// ============================================================
// 十二支
// ============================================================

const EAST_ZODIAC = [

    "子",
    "丑",
    "寅",
    "卯",
    "辰",
    "巳",
    "午",
    "未",
    "申",
    "酉",
    "戌",
    "亥"

];


// ============================================================
// 東の壁 初期化
// ============================================================

function initEast() {

    const content = document.getElementById("east-content");

    if (!content) return;


    content.innerHTML = `

        <div class="east-panels">


            <!-- ==================================================
                 左：将棋
                 ================================================== -->

            <div class="east-panel east-panel-shogi">

                <div
                    id="east-shogi-answer"
                    class="east-special-answer"
                >
                    王
                </div>

                <div
                    id="east-shogi-board"
                    class="east-shogi-board"
                ></div>

                <div
                    class="east-selection"
                    hidden
                >
                    選択：
                    <span id="east-shogi-selection">
                        王
                    </span>
                </div>

            </div>


            <!-- ==================================================
                 中：かな
                 ================================================== -->

            <div class="east-panel east-panel-kana">

                <div
                    id="east-kana-answer"
                    class="east-special-answer"
                >
                    頭
                </div>

                <div
                    id="east-kana-buttons"
                    class="east-kana-buttons"
                ></div>

                <div
                    class="east-selection"
                    hidden
                >
                    選択：
                    <span id="east-kana-selection">
                        あたま → 頭
                    </span>
                </div>

                <button
                    id="east-kana-reset"
                    class="east-reset-button"
                    type="button"
                >
                    リセット
                </button>

            </div>


            <!-- ==================================================
                 右：十二支
                 ================================================== -->

            <div class="east-panel east-panel-zodiac">

                <div
                    id="east-zodiac-answer"
                    class="east-special-answer"
                >
                    馬
                </div>

                <div
                    id="east-zodiac-circle"
                    class="east-zodiac-circle"
                ></div>

                <div
                    class="east-selection"
                    hidden
                >
                    選択：
                    <span id="east-zodiac-selection">
                        午
                    </span>
                </div>

            </div>


            <!-- ==================================================
                 東の答え
                 ================================================== -->

            <div
                id="east-result"
                class="east-result"
            >
                ？
            </div>

        </div>

    `;


    createEastShogiBoard();

    createEastKanaButtons();

    createEastZodiacButtons();


    // ========================================================
    // かなリセット
    // ========================================================

    const reset =
        document.getElementById("east-kana-reset");


    if (reset) {
reset.addEventListener("click", () => {

    // 初期状態「あ・た・ま」に戻す
    eastState.kana = [
        "あ",
        "た",
        "ま"
    ];

    // 選択した東の答え候補もリセット
    eastState.answerChoice = null;

    updateEast();

});

    }


    updateEast();

}


// ============================================================
// 将棋盤生成
// ============================================================

function createEastShogiBoard() {

    const board =
        document.getElementById("east-shogi-board");

    if (!board) return;


    board.innerHTML = "";


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const piece =
                SHOGI_BOARD[row][col];


            const cell =
                document.createElement("button");


            cell.type = "button";

            cell.className =
                "east-shogi-cell";


            // ----------------------------------------------------
            // 空マス
            // ----------------------------------------------------

            if (!piece) {

                cell.classList.add("empty");

                cell.disabled = true;

            }


            // ----------------------------------------------------
            // 駒
            // ----------------------------------------------------

            else {

                // 駒の文字は表示しない

                cell.textContent = "";

                cell.dataset.piece = piece;

                cell.setAttribute(
                    "aria-label",
                    piece
                );


                cell.addEventListener(
                    "click",
                    () => {

                        eastState.shogiPiece =
                            piece;

                        eastState.answerChoice =
                            null;

                        updateEast();

                    }
                );

            }


            board.appendChild(cell);

        }

    }

}


// ============================================================
// かなボタン生成
// ============================================================

function createEastKanaButtons() {

    const container =
        document.getElementById(
            "east-kana-buttons"
        );

    if (!container) return;


    container.innerHTML =
        EAST_KANA.map(kana => {

            return `

                <button
                    type="button"
                    class="east-kana-button"
                    data-kana="${kana}"
                    aria-label="${kana}"
                ></button>

            `;

        }).join("");


    container
        .querySelectorAll("[data-kana]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const kana =
                        button.dataset.kana;


                    // ------------------------------------------------
                    // すでに選択されている文字は無視
                    // ------------------------------------------------

                    if (
                        eastState.kana.indexOf(kana)
                        !== -1
                    ) {

                        return;

                    }


                    // ------------------------------------------------
                    // 3文字選択済みなら新しい組み合わせを開始
                    // ------------------------------------------------

                    if (
                        eastState.kana.length >= 3
                    ) {

                        eastState.kana = [];

                    }


                    eastState.kana.push(kana);

                    eastState.answerChoice =
                        null;

                    updateEast();

                }
            );

        });

}


// ============================================================
// 十二支ボタン生成
// ============================================================

function createEastZodiacButtons() {

    const circle =
        document.getElementById(
            "east-zodiac-circle"
        );

    if (!circle) return;


    circle.innerHTML =
        EAST_ZODIAC.map(
            (zodiac, index) => {

                const angle =
                    index * 30;


                return `

                    <button
                        type="button"
                        class="east-zodiac-button"
                        data-zodiac="${zodiac}"
                        style="--zodiac-angle:${angle}deg"
                        aria-label="${zodiac}"
                    ></button>

                `;

            }
        ).join("");


    circle
        .querySelectorAll("[data-zodiac]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    eastState.zodiac =
                        button.dataset.zodiac;

                    eastState.answerChoice =
                        null;

                    updateEast();

                }
            );

        });

}


// ============================================================
// 将棋更新
// ============================================================

function updateEastShogi() {

    const buttons =
        document.querySelectorAll(
            ".east-shogi-cell[data-piece]"
        );


    buttons.forEach(button => {

        button.classList.toggle(

            "selected",

            eastState.shogiPiece !== null &&

            button.dataset.piece ===
                eastState.shogiPiece

        );

    });


    const selection =
        document.getElementById(
            "east-shogi-selection"
        );


    if (selection) {

        selection.textContent =
            eastState.shogiPiece ?? "なし";

    }


    // --------------------------------------------------------
    // 上に表示する答え
    // --------------------------------------------------------

    const answer =
        document.getElementById(
            "east-shogi-answer"
        );


    if (!answer) return;


    if (eastState.shogiPiece === "王") {

        answer.textContent = "王";

        answer.classList.add("correct");

    }
    else {

        answer.textContent = "？";

        answer.classList.remove("correct");

    }

}


// ============================================================
// かな更新
// ============================================================

function updateEastKana() {

    const raw =
        eastState.kana.join("");


    const character =
        getEastKanaCharacter();


    const selection =
        document.getElementById(
            "east-kana-selection"
        );


    if (selection) {

        selection.textContent =
            character
                ? `${raw} → ${character}`
                : (raw || "なし");

    }


    // --------------------------------------------------------
    // 選択中ボタンを光らせる
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".east-kana-button"
        )
        .forEach(button => {

            button.classList.toggle(

                "selected",

                eastState.kana.indexOf(
                    button.dataset.kana
                ) !== -1

            );

        });


    // --------------------------------------------------------
    // 上に表示する答え
    // --------------------------------------------------------

    const answer =
        document.getElementById(
            "east-kana-answer"
        );


    if (!answer) return;


    if (isHeadKana()) {

        answer.textContent = "頭";

        answer.classList.add("correct");

    }
    else {

        answer.textContent = "？";

        answer.classList.remove("correct");

    }

}


// ============================================================
// 「あ・た・ま」判定
// 順番は関係なし
// ============================================================

function isHeadKana() {

    if (eastState.kana.length !== 3) {

        return false;

    }


    const selected =
        eastState.kana
            .slice()
            .sort()
            .join("");


    const target =
        ["あ", "た", "ま"]
            .sort()
            .join("");


    return selected === target;

}


// ============================================================
// 十二支更新
// ============================================================

function updateEastZodiac() {

    const selection =
        document.getElementById(
            "east-zodiac-selection"
        );


    if (selection) {

        selection.textContent =
            eastState.zodiac ?? "なし";

    }


    document
        .querySelectorAll(
            ".east-zodiac-button"
        )
        .forEach(button => {

            button.classList.toggle(

                "selected",

                button.dataset.zodiac ===
                    eastState.zodiac

            );

        });


    // --------------------------------------------------------
    // 上に表示する答え
    // --------------------------------------------------------

    const answer =
        document.getElementById(
            "east-zodiac-answer"
        );


    if (!answer) return;


    if (eastState.zodiac === "午") {

        answer.textContent = "馬";

        answer.classList.add("correct");

    }
    else {

        answer.textContent = "？";

        answer.classList.remove("correct");

    }

}


// ============================================================
// かな → 漢字
// ============================================================
//
// 「か・た・な」は順不同で「刀」
//
// 「か・わ」は旧特殊処理として「川」
// も残しておく。
// ============================================================

function getEastKanaCharacter() {

    if (eastState.kana.length === 2) {

        const value =
            eastState.kana
                .slice()
                .sort()
                .join("");


        const kawa =
            ["か", "わ"]
                .sort()
                .join("");


        if (value === kawa) {

            return "川";

        }

    }


    if (eastState.kana.length === 3) {

        const value =
            eastState.kana
                .slice()
                .sort()
                .join("");


        const katana =
            ["か", "た", "な"]
                .sort()
                .join("");


        if (value === katana) {

            return "刀";

        }

    }


    return null;

}


// ============================================================
// 東の候補
// ============================================================

function getEastCandidates() {

    const kanaCharacter =
        getEastKanaCharacter();


    // --------------------------------------------------------
    // パネル3非表示時の旧特殊問題
    // --------------------------------------------------------

    if (!eastState.panel3Visible) {

        if (
            eastState.shogiPiece === "金" &&
            kanaCharacter === "川"
        ) {

            return ["釧"];

        }


        return [];

    }


    // --------------------------------------------------------
    // 通常の東の問題
    // --------------------------------------------------------

    if (

        eastState.shogiPiece === "角" &&

        eastState.kana.length === 3 &&

        eastState.kana
            .slice()
            .sort()
            .join("") ===
            ["か", "た", "な"]
                .sort()
                .join("") &&

        eastState.zodiac === "丑"

    ) {

        return ["解"];

    }


    return [];

}


// ============================================================
// 東の結果表示
// ============================================================

function updateEastResult() {

    const result =
        document.getElementById(
            "east-result"
        );


    if (!result) return;


    const candidates =
        getEastCandidates();


    result.innerHTML = "";


    // --------------------------------------------------------
    // 未完成
    // --------------------------------------------------------

    if (candidates.length === 0) {

        result.textContent = "？";

        result.classList.remove("solved");

        return;

    }


    // --------------------------------------------------------
    // 1文字だけ
    // --------------------------------------------------------

    if (candidates.length === 1) {

        result.textContent =
            candidates[0];

        result.classList.add("solved");

        return;

    }


    // --------------------------------------------------------
    // 複数候補
    // --------------------------------------------------------

    const choices =
        document.createElement("div");


    choices.className =
        "result-choices";


    candidates.forEach(character => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "result-choice";


        button.textContent =
            character;


        button.classList.toggle(

            "selected",

            eastState.answerChoice ===
                character

        );


        button.addEventListener(
            "click",
            () => {

                eastState.answerChoice =
                    character;

                updateEast();

            }
        );


        choices.appendChild(button);

    });


    result.appendChild(choices);


    result.classList.toggle(

        "solved",

        !!eastState.answerChoice

    );

}


// ============================================================
// 東の解答文字
//
// DOMを見ない。
// 東の壁が画面に表示されていなくても
// 正解判定できるようにする。
// ============================================================

function getEastSolvedCharacter() {

    const candidates =
        getEastCandidates();


    if (candidates.length === 1) {

        return candidates[0];

    }


    if (
        candidates.length > 1 &&
        eastState.answerChoice
    ) {

        return eastState.answerChoice;

    }


    return null;

}


// ============================================================
// 東が解けているか
// ============================================================

function isEastSolved() {

    return (
        getEastSolvedCharacter() !== null
    );

}


// ============================================================
// 東全体更新
// ============================================================

function updateEast() {

    updateEastShogi();

    updateEastKana();

    updateEastZodiac();

    updateEastResult();


    // --------------------------------------------------------
    // 東の壁を表示していなくても北を更新する
    // --------------------------------------------------------

    if (
        typeof updateNorth ===
        "function"
    ) {

        updateNorth();

    }

}
