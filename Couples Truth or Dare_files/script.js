// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sample truth and dare questions
    const truths = [
        "What is your biggest fear in a relationship?",
        "What's the most embarrassing thing you've done for love?",
        "If you could change one thing about your partner, what would it be?",
        "What's your biggest turn-on?",
        "What's the naughtiest thing you've ever done?",
        "When did you know you were in love with your partner?",
        "What's your most irrational pet peeve?",
        "What's the weirdest thing you do when nobody's around?",
        "What's your biggest insecurity?",
        "What's the most expensive thing you've bought just for looks?",
        "What's something you've never told your partner?",
        "What's your favorite fantasy?",
        "What's the worst date you've ever been on?",
        "If you could erase one past experience, what would it be?",
        "What's your biggest regret in life?"
    ];

    const dares = [
        "Give your partner a 5-minute massage",
        "Let your partner style your hair and leave it that way for 2 hours",
        "Do 20 push-ups or let your partner spank you 10 times",
        "Text your ex and tell them you're doing fine without them",
        "Sing a song in a funny voice for 30 seconds",
        "Let your partner feed you something while you're blindfolded",
        "Do your best impression of your partner",
        "Exchange an item of clothing with your partner and wear it for 30 minutes",
        "Do a silly dance for 1 minute",
        "Let your partner draw something on your face with a marker",
        "Try to make your partner laugh without touching them",
        "Show your partner your browser history from today",
        "Let your partner choose your outfit tomorrow",
        "Do 15 jumping jacks while singing the national anthem",
        "Let your partner post anything they want on your social media"
    ];

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
    let players = ["", ""];
    let currentPlayer = 0;

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
        
        questionDisplay.textContent = getRandomItem(truths);
        switchPlayer();
    });

    dareBtn.addEventListener('click', function() {
        if (!players[0] || !players[1]) {
            initGame();
            return;
        }
        
        questionDisplay.textContent = getRandomItem(dares);
        switchPlayer();
    });

    newGameBtn.addEventListener('click', function() {
        resetGame();
    });
});