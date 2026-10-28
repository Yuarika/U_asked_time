// ============================================================
// 西の壁 / west.js
// ============================================================

const westState = {
    selected: [null, null, null],
    panel3Visible: true,

    // 複数候補から選択した漢字
    answerChoice: null
};


// ============================================================
// 初期化
// ============================================================

function initWest() {

    const panels =
        document.querySelectorAll(".west-panel");

    if (panels.length !== 3) {
        return;
    }


    panels.forEach(
        function(panel, panelIndex) {

            panel.querySelectorAll(".west-day")
                .forEach(
                    function(button, buttonIndex) {

                        button.addEventListener(
                            "click",
                            function() {

                                selectWestButton(
                                    panelIndex,
                                    Number(
                                        button.dataset.button ??
                                        buttonIndex
                                    )
                                );

                            }
                        );

                    }
                );

        }
    );


    const toggle =
        document.getElementById(
            "west-panel3-toggle"
        );

    if (toggle) {

        toggle.addEventListener(
            "click",
            toggleWestPanel3
        );

    }


    updateWest();

}


// ============================================================
// 曜日選択
// ============================================================

function selectWestButton(
    panelIndex,
    buttonIndex
) {

    if (
        westState.selected[panelIndex] ===
        buttonIndex
    ) {

        westState.selected[panelIndex] =
            null;

    }
    else {

        westState.selected[panelIndex] =
            buttonIndex;

    }


    // 選択内容が変わったら、
    // 以前選んだ漢字は解除
    westState.answerChoice = null;


    updateWest();

}


// ============================================================
// パネル3表示切替
// ============================================================

function toggleWestPanel3() {

    westState.panel3Visible =
        !westState.panel3Visible;


    if (!westState.panel3Visible) {

        westState.selected[2] =
            null;

    }


    westState.answerChoice =
        null;


    updateWest();

}


// ============================================================
// パネル3表示
// ============================================================

function updateWestPanel3() {

    const panels =
        document.querySelectorAll(
            ".west-panel"
        );

    const toggle =
        document.getElementById(
            "west-panel3-toggle"
        );


    if (panels[2]) {

        panels[2].style.display =
            westState.panel3Visible
                ? ""
                : "none";

    }


    if (toggle) {

        toggle.textContent =
            westState.panel3Visible
                ? "パネル3を非表示"
                : "パネル3を表示";

    }

}


// ============================================================
// 選択された文字
// ============================================================

function getWestCharacters() {

    const result = [];

    const count =
        westState.panel3Visible
            ? 3
            : 2;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const index =
            westState.selected[i];


        if (
            index !== null &&
            PUZZLE_DATA.west.assignment[index]
                !== undefined
        ) {

            result.push(
                PUZZLE_DATA
                    .west
                    .assignment[index]
            );

        }

    }


    return result;

}


// ============================================================
// 候補取得
// ============================================================

function getWestCandidates() {

    const required =
        westState.panel3Visible
            ? 3
            : 2;


    const characters =
        getWestCharacters();


    if (
        characters.length !== required
    ) {

        return [];

    }


    // まず「パネルを押した順」の組み合わせを確認
    const rawKey =
        characters.join("");


    let answer =
        PUZZLE_DATA.west.answers[rawKey];


    if (answer !== undefined) {

        return Array.isArray(answer)
            ? answer
            : [answer];

    }


    // 既存データとの互換用に
    // 曜日の並び順でも検索
    const sorted =
        characters.slice().sort(
            function(a, b) {

                return (
                    PUZZLE_DATA
                        .west
                        .assignment
                        .indexOf(a)
                    -
                    PUZZLE_DATA
                        .west
                        .assignment
                        .indexOf(b)
                );

            }
        );


    const sortedKey =
        sorted.join("");


    answer =
        PUZZLE_DATA
            .west
            .answers[sortedKey];


    if (answer === undefined) {

        return [];

    }


    return Array.isArray(answer)
        ? answer
        : [answer];

}


// ============================================================
// 答え取得
// ============================================================

function getWestAnswer() {

    const candidates =
        getWestCandidates();


    if (candidates.length === 0) {

        return null;

    }


    // 1文字しか候補がない
    if (candidates.length === 1) {

        return candidates[0];

    }


    // 複数候補
    if (
        westState.answerChoice !== null &&
        candidates.indexOf(
            westState.answerChoice
        ) !== -1
    ) {

        return westState.answerChoice;

    }


    // 未選択の場合は候補を文字列として表示
    return candidates.join(" / ");

}


// ============================================================
// 最終的に確定した西の文字
// ============================================================

function getWestSolvedCharacter() {

    const candidates =
        getWestCandidates();


    if (candidates.length === 0) {

        return null;

    }


    if (candidates.length === 1) {

        return candidates[0];

    }


    if (
        westState.answerChoice !== null &&
        candidates.indexOf(
            westState.answerChoice
        ) !== -1
    ) {

        return westState.answerChoice;

    }


    return null;

}


// ============================================================
// 選択表示
// ============================================================

function updateWestSelectionText() {

    const panels =
        document.querySelectorAll(
            ".west-panel"
        );


    panels.forEach(
        function(panel, panelIndex) {

            const span =
                panel.querySelector(
                    ".selection-display span"
                );


            if (!span) {
                return;
            }


            const selected =
                westState.selected[
                    panelIndex
                ];


            if (selected === null) {

                span.textContent =
                    "なし";

                return;

            }


            span.textContent =
                PUZZLE_DATA
                    .west
                    .assignment[
                        selected
                    ];

        }
    );

}


// ============================================================
// ボタン表示
// ============================================================

function updateWestButtons() {

    const panels =
        document.querySelectorAll(
            ".west-panel"
        );


    panels.forEach(
        function(panel, panelIndex) {

            panel.querySelectorAll(
                ".west-day"
            ).forEach(
                function(button, buttonIndex) {

                    const index =
                        Number(
                            button.dataset.button ??
                            buttonIndex
                        );


                    button.classList.toggle(
                        "selected",
                        westState.selected[
                            panelIndex
                        ] === index
                    );

                }
            );

        }
    );

}


// ============================================================
// 複数候補の選択ボタン
// ============================================================

function createWestAnswerChoices(
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
                westState.answerChoice ===
                character
            );


            button.addEventListener(
                "click",
                function() {

                    westState.answerChoice =
                        character;

                    updateWest();

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

function updateWestResult() {

    const result =
        document.getElementById(
            "west-result"
        );


    if (!result) {
        return;
    }


    const candidates =
        getWestCandidates();


    result.innerHTML = "";


    if (candidates.length === 0) {

        result.textContent =
            "？";

        result.classList.remove(
            "solved"
        );

        return;

    }


    // 1候補
    if (candidates.length === 1) {

        result.textContent =
            candidates[0];

        result.classList.add(
            "solved"
        );

        return;

    }


    // 複数候補
    createWestAnswerChoices(
        result,
        candidates
    );


    result.classList.toggle(
        "solved",
        westState.answerChoice !== null
    );

}


// ============================================================
// 西全体更新
// ============================================================

function updateWest() {

    updateWestPanel3();

    updateWestButtons();

    updateWestSelectionText();

    updateWestResult();


    if (
        typeof updateNorth ===
        "function"
    ) {

        updateNorth();

    }

}