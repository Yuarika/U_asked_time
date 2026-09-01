// ============================================================
// 南の壁 / south.js
// ============================================================

const southState = {

    // 各パネルで選択されている番号
    selected: [
        null,
        null,
        null
    ],

    // 各パネルのON/OFF
    mode: [
        true,
        true,
        true
    ],

    // パネル3の表示状態
    panel3Visible: true,

    // 複数候補から選択した漢字
    answerChoice: null

};


// ============================================================
// 初期化
// ============================================================

function initSouth() {

    const panels =
        document.querySelectorAll(
            ".south-panel"
        );


    if (panels.length !== 3) {
        return;
    }


    panels.forEach(
        function(panel, panelIndex) {

            // ----------------------------------------
            // 数字ボタン
            // ----------------------------------------

            panel.querySelectorAll(
                ".south-number-button"
            ).forEach(
                function(button, buttonIndex) {

                    button.addEventListener(
                        "click",
                        function() {

                            selectSouthButton(
                                panelIndex,
                                buttonIndex
                            );

                        }
                    );

                }
            );


            // ----------------------------------------
            // ON / OFF
            // ----------------------------------------

            panel.querySelectorAll(
                ".south-mode-button"
            ).forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function() {

                            changeSouthMode(
                                panelIndex,
                                button.dataset.mode
                            );

                        }
                    );

                }
            );

        }
    );


    // ----------------------------------------
    // パネル3表示切替
    // ----------------------------------------

    const toggle =
        document.getElementById(
            "south-panel3-toggle"
        );


    if (toggle) {

        toggle.addEventListener(
            "click",
            toggleSouthPanel3
        );

    }


    updateSouth();

}


// ============================================================
// 数字選択
// ============================================================

function selectSouthButton(
    panelIndex,
    buttonIndex
) {

    if (
        southState.selected[panelIndex] ===
        buttonIndex
    ) {

        southState.selected[panelIndex] =
            null;

    }
    else {

        southState.selected[panelIndex] =
            buttonIndex;

    }


    // 選択を変更したら候補選択を解除
    southState.answerChoice =
        null;


    updateSouth();

}


// ============================================================
// ON / OFF 切替
// ============================================================

function changeSouthMode(
    panelIndex,
    mode
) {

    southState.mode[panelIndex] =
        mode === "on";


    southState.answerChoice =
        null;


    updateSouth();

}


// ============================================================
// パネル3切替
// ============================================================

function toggleSouthPanel3() {

    southState.panel3Visible =
        !southState.panel3Visible;


    // ----------------------------------------
    // パネル3を非表示にした場合
    // パネル3の選択は消す
    // ----------------------------------------

    if (!southState.panel3Visible) {

        southState.selected[2] =
            null;

    }


    southState.answerChoice =
        null;


    updateSouth();

}


// ============================================================
// パネル3表示
// ============================================================

function updateSouthPanel3() {

    const panels =
        document.querySelectorAll(
            ".south-panel"
        );


    const toggle =
        document.getElementById(
            "south-panel3-toggle"
        );


    if (panels[2]) {

        panels[2].style.display =
            southState.panel3Visible
                ? ""
                : "none";

    }


    if (toggle) {

        toggle.textContent =
            southState.panel3Visible
                ? "パネル3を非表示"
                : "パネル3を表示";

    }

}


// ============================================================
// 数字ボタン表示
// ============================================================

function updateSouthButtons() {

    document.querySelectorAll(
        ".south-panel"
    ).forEach(
        function(panel, panelIndex) {

            panel.querySelectorAll(
                ".south-number-button"
            ).forEach(
                function(button, buttonIndex) {

                    button.classList.toggle(
                        "selected",
                        southState.selected[
                            panelIndex
                        ] === buttonIndex
                    );

                }
            );

        }
    );

}


// ============================================================
// ON / OFF ボタン表示
// ============================================================

function updateSouthModeButtons() {

    document.querySelectorAll(
        ".south-panel"
    ).forEach(
        function(panel, panelIndex) {

            panel.querySelectorAll(
                ".south-mode-button"
            ).forEach(
                function(button) {

                    const isOn =
                        button.dataset.mode ===
                        "on";


                    button.classList.toggle(
                        "selected",
                        isOn ===
                        southState.mode[
                            panelIndex
                        ]
                    );

                }
            );

        }
    );

}


// ============================================================
// 各パネルの文字
// ============================================================

function getSouthCharacter(
    panelIndex
) {

    const selected =
        southState.selected[
            panelIndex
        ];


    if (selected === null) {

        return null;

    }


    // ----------------------------------------
    // ON
    // ----------------------------------------

    if (
        southState.mode[
            panelIndex
        ]
    ) {

        return PUZZLE_DATA
            .south
            .onAssignment[
                selected
            ];

    }


    // ----------------------------------------
    // OFF
    // ----------------------------------------

    return PUZZLE_DATA
        .south
        .unknownAssignment[
            selected
        ];

}


// ============================================================
// 選択表示
// ============================================================

function updateSouthSelectionText() {

    document.querySelectorAll(
        ".south-panel"
    ).forEach(
        function(panel, panelIndex) {

            const span =
                panel.querySelector(
                    ".selection-display span"
                );


            if (!span) {
                return;
            }


            const selected =
                southState.selected[
                    panelIndex
                ];


            const character =
                getSouthCharacter(
                    panelIndex
                );


            if (selected === null) {

                span.textContent =
                    "なし";

                return;

            }


            span.textContent =
                `${selected + 1} → ${character}`;

        }
    );

}


// ============================================================
// 南の文字一覧
// ============================================================
//
// ★重要
//
// パネル3が表示されている
// → 必ず3パネルすべて必要
//
// パネル3が非表示
// → 必ず1・2の2パネルすべて必要
//
// 一部だけで答えを作ることはしない。
// ============================================================

function getSouthCharacters() {

    const count =
        southState.panel3Visible
            ? 3
            : 2;


    const result = [];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const character =
            getSouthCharacter(i);


        // ----------------------------------------
        // 1つでも未選択なら
        // 組み合わせを成立させない
        // ----------------------------------------

        if (
            character === null ||
            character === undefined ||
            character === ""
        ) {

            return [];

        }


        result.push(
            character
        );

    }


    return result;

}


// ============================================================
// 文字列を順不同で比較するための正規化
// ============================================================
//
// 例:
//
// シムロ
// ムシロ
// ロシム
//
// ↓
//
// シムロ
//
// として同一視する。
//
// ============================================================

function normalizeSouthCharacters(
    characters
) {

    return characters
        .slice()
        .sort()
        .join("");

}


// ============================================================
// 候補取得
// ============================================================

function getSouthCandidates() {

    const characters =
        getSouthCharacters();


    // ----------------------------------------
    // 2文字または3文字が揃っていなければ
    // 答えなし
    // ----------------------------------------

    const requiredCount =
        southState.panel3Visible
            ? 3
            : 2;


    if (
        characters.length !==
        requiredCount
    ) {

        return [];

    }


    // ----------------------------------------
    // 順不同で検索
    // ----------------------------------------

    const key =
        normalizeSouthCharacters(
            characters
        );


    const answers =
        PUZZLE_DATA
            .south
            .answers;


    // ----------------------------------------
    // まず直接キーを確認
    // ----------------------------------------

    if (
        answers[key] !== undefined
    ) {

        const answer =
            answers[key];


        return Array.isArray(answer)
            ? answer
            : [answer];

    }


    // ----------------------------------------
    // PUZZLE_DATA側のキーが
    // 並び順依存になっている場合にも対応
    // ----------------------------------------

    const keys =
        Object.keys(answers);


    for (
        let i = 0;
        i < keys.length;
        i++
    ) {

        const originalKey =
            keys[i];


        const normalizedKey =
            normalizeSouthCharacters(
                Array.from(
                    originalKey
                )
            );


        if (
            normalizedKey === key
        ) {

            const answer =
                answers[
                    originalKey
                ];


            return Array.isArray(answer)
                ? answer
                : [answer];

        }

    }


    return [];

}


// ============================================================
// 答え取得
// ============================================================

function getSouthAnswer() {

    const candidates =
        getSouthCandidates();


    if (
        candidates.length === 0
    ) {

        return null;

    }


    // ----------------------------------------
    // 候補が1つ
    // ----------------------------------------

    if (
        candidates.length === 1
    ) {

        return candidates[0];

    }


    // ----------------------------------------
    // 候補から選択済み
    // ----------------------------------------

    if (
        southState.answerChoice !== null &&
        candidates.indexOf(
            southState.answerChoice
        ) !== -1
    ) {

        return southState.answerChoice;

    }


    // ----------------------------------------
    // 未選択
    // ----------------------------------------

    return candidates.join(
        " / "
    );

}


// ============================================================
// 確定した南の文字
// ============================================================

function getSouthSolvedCharacter() {

    const candidates =
        getSouthCandidates();


    if (
        candidates.length === 0
    ) {

        return null;

    }


    // ----------------------------------------
    // 候補が1つなら確定
    // ----------------------------------------

    if (
        candidates.length === 1
    ) {

        return candidates[0];

    }


    // ----------------------------------------
    // 複数候補で選択済み
    // ----------------------------------------

    if (
        southState.answerChoice !== null &&
        candidates.indexOf(
            southState.answerChoice
        ) !== -1
    ) {

        return southState.answerChoice;

    }


    return null;

}


// ============================================================
// 複数候補ボタン生成
// ============================================================

function createSouthAnswerChoices(
    result,
    candidates
) {

    const choices =
        document.createElement(
            "div"
        );


    choices.className =
        "result-choices";


    candidates.forEach(
        function(character) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "result-choice";


            button.textContent =
                character;


            button.classList.toggle(
                "selected",
                southState.answerChoice ===
                character
            );


            button.addEventListener(
                "click",
                function() {

                    southState.answerChoice =
                        character;


                    updateSouth();

                }
            );


            choices.appendChild(
                button
            );

        }
    );


    result.appendChild(
        choices
    );

}


// ============================================================
// 答え表示
// ============================================================

function updateSouthResult() {

    const result =
        document.getElementById(
            "south-result"
        );


    if (!result) {
        return;
    }


    const candidates =
        getSouthCandidates();


    result.innerHTML = "";


    // ----------------------------------------
    // 答えなし
    // ----------------------------------------

    if (
        candidates.length === 0
    ) {

        result.textContent =
            "？";


        result.classList.remove(
            "solved"
        );


        return;

    }


    // ----------------------------------------
    // 候補1つ
    // ----------------------------------------

    if (
        candidates.length === 1
    ) {

        result.textContent =
            candidates[0];


        result.classList.add(
            "solved"
        );


        return;

    }


    // ----------------------------------------
    // 複数候補
    // ----------------------------------------

    createSouthAnswerChoices(
        result,
        candidates
    );


    result.classList.toggle(
        "solved",
        southState.answerChoice !== null
    );

}


// ============================================================
// 南全体更新
// ============================================================

function updateSouth() {

    updateSouthPanel3();

    updateSouthButtons();

    updateSouthModeButtons();

    updateSouthSelectionText();

    updateSouthResult();


    // ----------------------------------------
    // 北の壁も更新
    // ----------------------------------------

    if (
        typeof updateNorth ===
        "function"
    ) {

        updateNorth();

    }

}