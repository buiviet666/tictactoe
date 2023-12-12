
import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
    getCellElementList,
    getCurrentTurnElement,
    getGameStatusElement,
    getCellElementAtIdx,
    getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(getCellElementList());
// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));
// console.log(checkGameStatus(["X", "O", "X", "X", "O", "X", "O", "X", "O"]));
// console.log(checkGameStatus(["X", "", "X", "X", "O", "X", "O", "X", "O"]));

let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;


}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPosition) {
    if (!Array.isArray(winPosition) || winPosition.length !== 3) {
        throw new Error('Invalid win positions');
    };

    for (const positions of winPosition) {
        const cell = getCellElementAtIdx(positions);
        if (cell) cell.classList.add("win");
    }
}

function handleCellClick(cell, idx) {

    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);

    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

    if (isClicked || isEndGame) return;

    cell.classList.add(currentTurn);

    cellValues[idx] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }

        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN: {
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCells(game.winPositions);
            break;
        }

        default:

    }

    // console.log("click: ", cell, idx);
}

function initCellElementList() {
    const cellElementList = getCellElementList();

    cellElementList.forEach((cell, idx) => {
        cell.addEventListener("click", () => handleCellClick(cell, idx));
    });
}

function resetGame() {
    console.log(("click btn to replay"));

    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");

    updateGameStatus(GAME_STATUS.PLAYING);

    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }

    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        // cellElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        cellElement.className = "";
    }

    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener("click", resetGame);
    }
}

(() => {
    initCellElementList();

    initReplayButton();
})();