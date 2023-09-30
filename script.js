const player = (value) => {
    this.value = value;

    const getValue = () => { return value };
    
    return { getValue };
};

const gameBoard = (() => {
    let gameBoard = ["", "", "", "", "", "", "", "" ,""];

    getValue = (index) => { return gameBoard[index] };
    setValue = (index, value) => { gameBoard[index] = value };
    const reset = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = "";
        }
    };
    
    return { getValue, setValue, reset };
})();

const displayController = (() => {
    const tiles = document.querySelectorAll('.tile');
    const result = document.querySelector('.result');
    const resetBtn = document.querySelector('.reset');
    const p1Score = document.querySelector('.x');
    const p2Score = document.querySelector('.o');

    tiles.forEach((tile) => 
        tile.addEventListener('click', (e) => {
            if (gameController.over() || e.target.textContent !== "") return;
            gameController.playRound(parseInt(e.target.id));
            console.log(parseInt(e.target.id));
            updateGameboard();
        })
    );

    resetBtn.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        displayMessage("Player X's turn");
    });

    const updateGameboard = () => {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].children[0].textContent = gameBoard.getValue(i);
        }
    };

    const displayMessage = (message) => {
        result.textContent = message;
    };

    const updateScore = (p1, p2) => {
        p1Score.textContent = p1;
        p2Score.textContent = p2;
    };

    return { displayMessage, updateScore };
})();

const gameController = (() => {
    const player1 = player("X");
    const player2 = player("O");
    let round = 1;
    let score = [0, 0];
    let end = false;

    const playRound = (index) => {
        gameBoard.setValue(index, currentPlayer());
        if (checkWin(index)) {
            displayController.displayMessage(`Player ${currentPlayer()} wins!`);
            end = true;
            if (currentPlayer() === "X") score[0]++; 
            else score[1]++;
            displayController.updateScore(score[0], score[1]);
            return;
        } else if (round == 9) {
            displayController.displayMessage(`Draw!`);
            end = true;
            return;
        } else {
            round++;
            displayController.displayMessage(`Player ${currentPlayer()}'s turn`);
        }
    };

    const currentPlayer = () => {
        return round % 2 === 1 ? player1.getValue() : player2.getValue();
    };

    const checkWin = (index) => {
        const patterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return patterns
            .filter((combination) => combination.includes(index))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getValue(index) === currentPlayer()
                )
        );
    };

    const over = () => {
        return end;
    };

    const reset = () => {
        round = 1;
        end = false;
    };

    return { playRound, over, reset, score };
})();