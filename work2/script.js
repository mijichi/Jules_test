document.addEventListener('DOMContentLoaded', () => {
    const correctSquareInput = document.getElementById('correct-square');
    const aliceActionButton = document.getElementById('alice-action');
    const bobActionButton = document.getElementById('bob-action');
    const chessboardDiv = document.getElementById('chessboard');
    const bobGuessSpan = document.getElementById('bob-guess');

    let currentBoardState = []; // Represents the 64 squares of the board

    /**
     * Renders the chessboard in the UI based on the board state.
     * @param {number[]} board - An array of 64 numbers (0 for heads, 1 for tails).
     */
    function renderBoard(board) {
        chessboardDiv.innerHTML = '';
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            // 0 is heads (表 - omote), 1 is tails (裏 - ura)
            square.classList.add(board[i] === 0 ? 'heads' : 'tails');
            square.textContent = i + 1;
            chessboardDiv.appendChild(square);
        }
    }

    /**
     * Alice's action: Generates a random board, and flips one coin to encode the correct square's index.
     * @param {number} correctSquare - The correct square (1-64).
     * @returns {number[]} The final state of the board after flipping one coin.
     */
    function aliceAction(correctSquare) {
        // Convert the 1-64 input to a 0-63 index
        const targetIndex = correctSquare - 1;

        // 1. Generate a random board state (0 for heads, 1 for tails)
        const randomBoard = Array.from({ length: 64 }, () => Math.round(Math.random()));

        // 2. Calculate the XOR sum of the indices of all coins showing tails (1)
        let currentXorSum = 0;
        for (let i = 0; i < 64; i++) {
            if (randomBoard[i] === 1) {
                currentXorSum ^= i;
            }
        }

        // 3. Determine the index of the coin to flip
        const flipIndex = currentXorSum ^ targetIndex;

        // 4. Create the final board by flipping the chosen coin
        const finalBoard = [...randomBoard];
        finalBoard[flipIndex] = 1 - finalBoard[flipIndex]; // Flips 0 to 1 or 1 to 0

        return finalBoard;
    }

    /**
     * Bob's action: Calculates the XOR sum of the tails coins' indices to find the correct square.
     * @param {number[]} board - The current state of the board.
     * @returns {number} The identified correct square (1-64).
     */
    function bobAction(board) {
        let xorSum = 0;
        for (let i = 0; i < 64; i++) {
            if (board[i] === 1) { // If the coin is tails
                xorSum ^= i;
            }
        }
        // The XOR sum is the 0-63 index of the correct square. Convert back to 1-64.
        return xorSum + 1;
    }

    // Event listener for Alice's button
    aliceActionButton.addEventListener('click', () => {
        const correctSquare = parseInt(correctSquareInput.value, 10);
        if (isNaN(correctSquare) || correctSquare < 1 || correctSquare > 64) {
            alert('正解のマスは1から64の間で指定してください。');
            return;
        }

        currentBoardState = aliceAction(correctSquare);
        renderBoard(currentBoardState);
        bobGuessSpan.textContent = ''; // Clear Bob's previous guess
    });

    // Event listener for Bob's button
    bobActionButton.addEventListener('click', () => {
        if (currentBoardState.length === 0) {
            alert('先にアリスのアクションを実行してください。');
            return;
        }
        const guessedSquare = bobAction(currentBoardState);
        bobGuessSpan.textContent = guessedSquare;
    });

    // Render an initial empty (all heads) board
    renderBoard(Array(64).fill(0));
});
