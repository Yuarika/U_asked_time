// ============================================================
// U asked time
// north.js
//
// 北の壁
//
// ・西・南・東で完成した文字を表示
// ・各パネルのON / OFF
// ・ステージに応じたパネル解放
// ・ON / OFF に応じた時間変換
//
// 重要
//
// ・一度解放されたパネルは再びロックしない
// ・ステージ移行ではON/OFFをリセットしない
// ・北を再描画してもON/OFFを維持する
// ・解放済みの文字は、OFFでも最終結果に含める
//
// ============================================================


// ============================================================
// 北の状態
// ============================================================

const northState = {

    // ON / OFF
    //
    // 0 = 西
    // 1 = 南
    // 2 = 東

    on: [
        false,
        false,
        false
    ],


    // 解放済みか

    unlocked: [
        false,
        false,
        false
    ],


    // 北独自の履歴は使用しない
    //
    // クリア履歴は puzzle.js の
    // gameState.clearHistory を唯一の正しい履歴とする。

    history: [],


    finalCleared: false,

    lastSolvedQuestion: null,

    lastSolvedAnswer: null

};



// ============================================================
// 北のHTML
// ============================================================

function createNorthHTML() {

    return `

        <div class="wall-heading">

            <div class="wall-kicker">
                NORTH
            </div>

            <h2>
                北の壁
            </h2>

        </div>


        <div class="north-panels">

            ${createNorthPanel(
                "west",
                "西",
                "north-west-character",
                "north-west-result"
            )}

            ${createNorthPanel(
                "south",
                "南",
                "north-south-character",
                "north-south-result"
            )}

            ${createNorthPanel(
                "east",
                "東",
                "north-east-character",
                "north-east-result"
            )}

        </div>


        <div class="north-result-line">

            <span>
                適用結果
            </span>

            <strong id="north-result">
                ？
            </strong>

        </div>


    `;
}



// ============================================================
// 北の各パネル
// ============================================================

function createNorthPanel(
    side,
    title,
    characterId,
    resultId
) {

    return `

        <div
            class="north-panel north-panel-off"
            data-side="${side}"
            data-north-side="${side}"
            hidden
        >

            <h3>
                ${title}
            </h3>


            <div
                id="${characterId}"
                class="north-character"
            >
                ？
            </div>


            <div class="north-toggle-area">

                <button
                    type="button"
                    class="north-toggle-button off"
                    data-side="${side}"
                    aria-pressed="false"
                >
                    OFF
                </button>

            </div>


            <div
                id="${resultId}"
                class="north-panel-result"
            >
                ？
            </div>

        </div>

    `;
}



// ============================================================
// 初期化
// ============================================================

function initNorth() {

    const wall =
        document.getElementById(
            "north-wall"
        );

    if (!wall) {
        return;
    }


    // --------------------------------------------------------
    // HTMLを作り直す
    //
    // northState.on / unlocked は変更しない。
    // --------------------------------------------------------

    wall.innerHTML =
        createNorthHTML();


    // --------------------------------------------------------
    // イベントは一度だけ登録
    // --------------------------------------------------------

    if (
        wall.dataset.northInitialized !==
        "true"
    ) {

        wall.addEventListener(
            "click",
            function(event) {

                const button =
                    event.target.closest(
                        ".north-toggle-button"
                    );

                if (!button) {
                    return;
                }


                const side =
                    button.dataset.side;


                const index =
                    getNorthSideIndex(
                        side
                    );


                if (index < 0) {
                    return;
                }


                // ------------------------------------------------
                // 未解放なら押せない
                // ------------------------------------------------

                if (
                    !northState.unlocked[index]
                ) {

                    return;

                }


                // ------------------------------------------------
                // ON / OFF切替
                // ------------------------------------------------

                northState.on[index] =
                    !northState.on[index];


                updateNorth();

            }
        );


        wall.dataset.northInitialized =
            "true";

    }


    updateNorth();
}



// ============================================================
// 西・南・東 → 配列番号
// ============================================================

function getNorthSideIndex(side) {

    if (side === "west") {
        return 0;
    }

    if (side === "south") {
        return 1;
    }

    if (side === "east") {
        return 2;
    }

    return -1;
}



// ============================================================
// 北全体更新
// ============================================================

function updateNorth() {

    const sides = [
        "west",
        "south",
        "east"
    ];


    sides.forEach(
        function(side, index) {

            const panel =
                document.querySelector(
                    `.north-panel[data-side="${side}"]`
                );


            const button =
                document.querySelector(
                    `.north-toggle-button[data-side="${side}"]`
                );


            if (!panel || !button) {
                return;
            }


            // ----------------------------------------------------
            // 解放状態
            // ----------------------------------------------------

            panel.hidden =
                !northState.unlocked[index];


            // ----------------------------------------------------
            // ON
            // ----------------------------------------------------

            if (
                northState.on[index]
            ) {

                panel.classList.remove(
                    "north-panel-off"
                );

                panel.classList.add(
                    "north-panel-on"
                );


                button.classList.remove(
                    "off"
                );

                button.classList.add(
                    "selected"
                );


                button.textContent =
                    "ON";


                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

            }


            // ----------------------------------------------------
            // OFF
            // ----------------------------------------------------

            else {

                panel.classList.remove(
                    "north-panel-on"
                );

                panel.classList.add(
                    "north-panel-off"
                );


                button.classList.remove(
                    "selected"
                );

                button.classList.add(
                    "off"
                );


                button.textContent =
                    "OFF";


                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

        }
    );


    updateNorthCharacters();


    const result =
        applyNorthTimeChange();


    checkNorthClear(
        result
    );

}



// ============================================================
// 西・南・東の完成文字を表示
// ============================================================

function updateNorthCharacters() {

    let west = "？";
    let south = "？";
    let east = "？";


    if (
        typeof getWestSolvedCharacter ===
        "function"
    ) {

        west =
            getWestSolvedCharacter()
            || "？";

    }


    if (
        typeof getSouthSolvedCharacter ===
        "function"
    ) {

        south =
            getSouthSolvedCharacter()
            || "？";

    }


    if (
        typeof getEastSolvedCharacter ===
        "function"
    ) {

        east =
            getEastSolvedCharacter()
            || "？";

    }


    const westCharacter =
        document.getElementById(
            "north-west-character"
        );


    const southCharacter =
        document.getElementById(
            "north-south-character"
        );


    const eastCharacter =
        document.getElementById(
            "north-east-character"
        );


    const westResult =
        document.getElementById(
            "north-west-result"
        );


    const southResult =
        document.getElementById(
            "north-south-result"
        );


    const eastResult =
        document.getElementById(
            "north-east-result"
        );


    if (westCharacter) {

        westCharacter.textContent =
            west;

    }


    if (southCharacter) {

        southCharacter.textContent =
            south;

    }


    if (eastCharacter) {

        eastCharacter.textContent =
            east;

    }


    if (westResult) {

        westResult.textContent =
            west;

    }


    if (southResult) {

        southResult.textContent =
            south;

    }


    if (eastResult) {

        eastResult.textContent =
            east;

    }

}



// ============================================================
// 現在の問題番号
//
// puzzle.js の STAGE_INFO を使用する。
// ============================================================

function getNorthCurrentQuestion() {

    if (
        typeof getCurrentProblemNumber ===
        "function"
    ) {

        const number =
            getCurrentProblemNumber();

        if (number) {
            return number;
        }

    }


    // --------------------------------------------------------
    // 念のためのフォールバック
    // --------------------------------------------------------

    const problemNumber =
        document.getElementById(
            "problem-number"
        );


    if (
        problemNumber &&
        problemNumber.textContent.trim() !== ""
    ) {

        return problemNumber.textContent.trim();

    }


    const problemText =
        document.getElementById(
            "problem-text"
        );


    if (
        problemText &&
        problemText.textContent.trim() !== ""
    ) {

        return problemText.textContent.trim();

    }


    return "問題文不明";
}



// ============================================================
// 北の時間変換
//
// ★重要
//
// 「ONになっている文字だけ」を出すのではない。
//
// 解放済みなら、OFFでも文字は最終結果に含める。
//
// 例:
//
// 西 = 明   ON
// 南 = 日   ON
// 東 = 解   OFF
//
// → 明後日解
//
// ただし:
//
// 西 = 明   ON
// 南 = 治   ON
// 東 = 解   OFF
//
// → 特殊変換で「大正解」
//
// ============================================================

function applyNorthTimeChange(
    westArgument,
    southArgument,
    eastArgument
) {

    let west =
        westArgument;


    let south =
        southArgument;


    let east =
        eastArgument;



    // --------------------------------------------------------
    // 引数がない場合は壁から取得
    // --------------------------------------------------------

    if (
        typeof west ===
        "undefined"
    ) {

        west =
            typeof getWestSolvedCharacter ===
            "function"
                ? getWestSolvedCharacter()
                : null;

    }


    if (
        typeof south ===
        "undefined"
    ) {

        south =
            typeof getSouthSolvedCharacter ===
            "function"
                ? getSouthSolvedCharacter()
                : null;

    }


    if (
        typeof east ===
        "undefined"
    ) {

        east =
            typeof getEastSolvedCharacter ===
            "function"
                ? getEastSolvedCharacter()
                : null;

    }


    west =
        west || null;


    south =
        south || null;


    east =
        east || null;



    // ========================================================
    // ON状態
    // ========================================================

    const westOn =
        northState.unlocked[0] &&
        northState.on[0] &&
        west &&
        west !== "？";


    const southOn =
        northState.unlocked[1] &&
        northState.on[1] &&
        south &&
        south !== "？";


    const eastOn =
        northState.unlocked[2] &&
        northState.on[2] &&
        east &&
        east !== "？";



    // ========================================================
    // 特殊変換
    // ========================================================


    // --------------------------------------------------------
    // 昔 + 西ON
    //
    // → 今
    //
    // 第1問の北の結果
    // --------------------------------------------------------

    if (
        westOn &&
        west === "昔" &&
        !southOn &&
        !eastOn
    ) {

        return setNorthResult(
            "今"
        );

    }



    // --------------------------------------------------------
    // 明 + 日
    //
    // 西ON + 南ON
    // 東OFF
    //
    // → 明後日
    //
    // 東が解放されている場合、
    // OFFの「解」は後ろに追加する。
    //
    // → 明後日解
    // --------------------------------------------------------

    if (
        westOn &&
        southOn &&
        west === "明" &&
        south === "日" &&
        !eastOn
    ) {

        let result =
            "明後日";


        // 東が解放済みで文字がある場合
        if (
            northState.unlocked[2] &&
            east &&
            east !== "？"
        ) {

            result += east;

        }


        return setNorthResult(
            result
        );

    }



    // --------------------------------------------------------
    // 最終問題
    //
    // 明 + 治 + 解
    //
    // 西ON
    // 南ON
    // 東OFF
    //
    // → 大正解
    //
    // ここだけは「解」を後ろに追加しない。
    // 3文字セットそのものが特殊変換される。
    // --------------------------------------------------------

    if (
        westOn &&
        southOn &&
        !eastOn &&
        west === "明" &&
        south === "治" &&
        east === "解"
    ) {

        return setNorthResult(
            "大正解"
        );

    }



    // ========================================================
    // 通常時
    //
    // ★解放済みの文字を全部つなげる
    //
    // ON / OFF は関係なく、
    // 「解放されているか」で文字を含める。
    // ========================================================

    const parts = [];


    if (
        northState.unlocked[0] &&
        west &&
        west !== "？"
    ) {

        parts.push(
            west
        );

    }


    if (
        northState.unlocked[1] &&
        south &&
        south !== "？"
    ) {

        parts.push(
            south
        );

    }


    if (
        northState.unlocked[2] &&
        east &&
        east !== "？"
    ) {

        parts.push(
            east
        );

    }


    let result =
        "？";


    if (parts.length > 0) {

        result =
            parts.join("");

    }


    return setNorthResult(
        result
    );
}



// ============================================================
// 北の結果をDOMに設定
// ============================================================

function setNorthResult(result) {

    const target =
        document.getElementById(
            "north-result"
        );


    if (target) {

        target.textContent =
            result;

    }


    return result;
}



// ============================================================
// 北のクリア判定
//
// ★ここでは履歴を追加しない。
//
// ステージクリア履歴は puzzle.js が管理する。
// ============================================================

function checkNorthClear(result) {

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



    // --------------------------------------------------------
    // FINAL
    // --------------------------------------------------------

    const finalCondition =

        west === "明" &&

        south === "治" &&

        east === "解" &&

        northState.on[0] === true &&

        northState.on[1] === true &&

        northState.on[2] === false &&

        northState.unlocked[0] === true &&

        northState.unlocked[1] === true &&

        northState.unlocked[2] === true &&

        result === "大正解";



    if (finalCondition) {

        northState.finalCleared =
            true;

        return true;

    }


    // --------------------------------------------------------
    // 第2問・第3問
    //
    // 履歴には追加しない。
    // puzzle.js が正しい問題番号を使って追加する。
    // --------------------------------------------------------

    if (
        result === "今" ||
        result === "明後日"
    ) {

        return true;

    }


    return false;
}



// ============================================================
// 北の履歴
//
// 旧方式との互換用。
// 実際のクリア履歴は puzzle.js の
// gameState.clearHistory を使用する。
//
// ここでは何も追加しない。
// ============================================================

function saveNorthClearHistory(
    question,
    answer
) {

    return;

}



// ============================================================
// 北の履歴表示
//
// クリア履歴は puzzle.js 側で表示する。
// ============================================================

function updateNorthHistory() {

    return;

}



// ============================================================
// HTMLエスケープ
//
// 互換用
// ============================================================

function escapeNorthHTML(text) {

    if (
        text === null ||
        typeof text === "undefined"
    ) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// ============================================================
// ステージによる北パネル解放
//
// 一度trueになったものはfalseに戻さない。
// ============================================================

function unlockNorthByStage(level) {

    level =
        Number(level);


    if (
        !Number.isFinite(level)
    ) {

        return;

    }


    level =
        Math.max(
            0,
            Math.min(
                3,
                level
            )
        );


    if (
        level >= 1
    ) {

        northState.unlocked[0] =
            true;

    }


    if (
        level >= 2
    ) {

        northState.unlocked[1] =
            true;

    }


    if (
        level >= 3
    ) {

        northState.unlocked[2] =
            true;

    }


    updateNorth();
}



// ============================================================
// 個別パネル解放
// ============================================================

function unlockNorthPanel(side) {

    const index =
        getNorthSideIndex(
            side
        );


    if (index < 0) {
        return;
    }


    northState.unlocked[index] =
        true;


    updateNorth();
}



// ============================================================
// ステージ移行時
//
// ★ON/OFFを変更しない。
// ============================================================

function resetNorthOnState() {

    // 何もしない。
    //
    // ON/OFFはそのまま保持する。

    updateNorth();
}



// ============================================================
// ゲーム開始時のみ全状態リセット
// ============================================================

function resetNorthAllState() {

    northState.on = [
        false,
        false,
        false
    ];


    northState.unlocked = [
        false,
        false,
        false
    ];


    northState.history = [];


    northState.finalCleared =
        false;


    northState.lastSolvedQuestion =
        null;


    northState.lastSolvedAnswer =
        null;


    updateNorth();
}