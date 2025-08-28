// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const playerInputs = document.getElementById('playerInputs');
    const playerNames = document.getElementById('playerNames');
    const currentPlayerDisplay = document.getElementById('currentPlayerDisplay');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const questionDisplay = document.getElementById('questionDisplay');
    const truthBtn = document.getElementById('truthBtn');
    const dareBtn = document.getElementById('dareBtn');
    const newGameBtn = document.getElementById('newGameBtn');

    // Game state
    let truths = [];
    let dares = [];
    let players = ["", ""];
    let currentPlayer = 0;

    // Load questions from JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            truths = data.truths;
            dares = data.dares;
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            // Fallback to default questions if JSON fails to load
            truths = [
                "What is your biggest fear in a relationship?",
                "What's the most embarrassing thing you've done for love?",
                "If you could change one thing about your partner, what would it be?"
            ];
            dares = [
                "Give your partner a 5-minute massage",
                "Let your partner style your hair and leave it that way for 2 hours",
                "Do 20 push-ups or let your partner spank you 10 times"
            ];
        });

    // Get random item from array
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Update player display
    function updatePlayerDisplay() {
        currentPlayerDisplay.textContent = `${players[currentPlayer]}'s turn`;
    }

    // Switch to next player
    function switchPlayer() {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        updatePlayerDisplay();
    }

    // Initialize game
    function initGame() {
        players[0] = player1Input.value || "Player 1";
        players[1] = player2Input.value || "Player 2";

        // Hide input fields and show player names with animation
        playerInputs.classList.add('hidden');
        setTimeout(() => {
            playerInputs.style.display = 'none';
            playerNames.style.display = 'block';
            setTimeout(() => {
                playerNames.classList.add('visible');
            }, 10);
        }, 500);

        currentPlayer = 0;
        updatePlayerDisplay();
        questionDisplay.textContent = "Click \"Truth\" or \"Dare\" to begin!";
    }

    // Reset game
    function resetGame() {
        // Hide player names with animation
        playerNames.classList.remove('visible');
        setTimeout(() => {
            playerNames.style.display = 'none';
            playerInputs.style.display = 'flex';
            setTimeout(() => {
                playerInputs.classList.remove('hidden');
            }, 10);
        }, 500);

        // Clear input fields
        player1Input.value = '';
        player2Input.value = '';

        // Reset game state
        players = ["", ""];
        currentPlayer = 0;
        questionDisplay.textContent = "Click \"Truth\" or \"Dare\" to begin!";
    }

    // Event listeners
    truthBtn.addEventListener('click', function() {
        if (!players[0] || !players[1]) {
            initGame();
            return;
        }
        
        if (truths.length > 0) {
            questionDisplay.textContent = getRandomItem(truths);
        } else {
            questionDisplay.textContent = "No truth questions available!";
        }
        switchPlayer();
    });

    dareBtn.addEventListener('click', function() {
        if (!players[0] || !players[1]) {
            initGame();
            return;
        }
        
        if (dares.length > 0) {
            questionDisplay.textContent = getRandomItem(dares);
        } else {
            questionDisplay.textContent = "No dare challenges available!";
        }
        switchPlayer();
    });

    newGameBtn.addEventListener('click', function() {
        resetGame();
    });
});