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
    const levelSelection = document.getElementById('levelSelection');
    const toggleTokenInput = document.getElementById('toggleTokenInput');
    const apifyTokenSection = document.getElementById('apifyTokenSection');
    const apifyTokenInput = document.getElementById('apifyToken');
    const saveTokenBtn = document.getElementById('saveToken');
    
    // Level buttons
    const levelButtons = document.querySelectorAll('.level-btn');

    // Game state
    let truths = [];
    let dares = [];
    let players = ["", ""];
    let currentPlayer = 0;
    let currentLevel = 'beginner'; // Default level
    let apifyService = null;
    
    // Import configuration
    const apifyConfig = window.apifyConfig || {
      levels: {
        beginner: { name: "Beginner", color: "#00cc99", truthScraper: "iam_lonewolf/my-actor", dareScraper: "iam_lonewolf/my-actor" },
        intermediate: { name: "Intermediate", color: "#ff9900", truthScraper: "iam_lonewolf/my-actor", dareScraper: "iam_lonewolf/my-actor" },
        advanced: { name: "Advanced", color: "#ff3366", truthScraper: "iam_lonewolf/my-actor", dareScraper: "iam_lonewolf/my-actor" }
      }
    };

    // Initialize Apify service (only if token is provided)
    function initApifyService() {
      // In a real implementation, you would get this from a secure source
      const apiToken = localStorage.getItem('apifyToken') || '';
      if (apiToken) {
        apifyService = new ApifyService(apiToken);
        console.log('Apify service initialized with token');
      } else {
        console.log('No Apify token found, using local content');
      }
    }

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

    // Initialize game with level selection
    function initGameWithLevel() {
        // Show level selection instead of player inputs initially
        playerInputs.style.display = 'none';
        levelSelection.style.display = 'block';
    }

    // Start game after level selection
    function startGame() {
        players[0] = player1Input.value || "Player 1";
        players[1] = player2Input.value || "Player 2";

        // Hide level selection and show player names with animation
        levelSelection.style.display = 'none';
        playerInputs.style.display = 'none';
        playerNames.style.display = 'block';
        playerNames.classList.add('visible');

        currentPlayer = 0;
        updatePlayerDisplay();
        questionDisplay.textContent = `Level: ${apifyConfig.levels[currentLevel].name} - Click "Truth" or "Dare" to begin!`;
    }

    // Reset game
    function resetGame() {
        // Hide player names and show level selection
        playerNames.classList.remove('visible');
        setTimeout(() => {
            playerNames.style.display = 'none';
            levelSelection.style.display = 'block';
        }, 500);

        // Clear input fields
        player1Input.value = '';
        player2Input.value = '';

        // Reset game state
        players = ["", ""];
        currentPlayer = 0;
        questionDisplay.textContent = "Click \"Truth\" or \"Dare\" to begin!";
    }
    
    // Fetch content from Apify based on level
    async function fetchLevelContent(contentType) {
      if (!apifyService) {
        // Return default content if no Apify service
        console.log('No Apify service available, using local content');
        return contentType === 'truth' ? truths : dares;
      }
      
      try {
        const levelConfig = apifyConfig.levels[currentLevel];
        const actorId = contentType === 'truth' ? levelConfig.truthScraper : levelConfig.dareScraper;
        
        if (!actorId) {
          console.warn(`No actor ID configured for ${contentType} at level ${currentLevel}`);
          return contentType === 'truth' ? truths : dares;
        }
        
        console.log(`Fetching ${contentType} content using actor: ${actorId}`);
        const content = await apifyService.fetchContentByLevel(actorId, currentLevel, contentType);
        console.log(`Received ${contentType} content:`, content);
        
        // Return the fetched content or fallback to local content
        return content && content.length > 0 ? content : (contentType === 'truth' ? truths : dares);
      } catch (error) {
        console.error(`Error fetching ${contentType} content:`, error);
        // Fallback to local content
        return contentType === 'truth' ? truths : dares;
      }
    }
    
    // Event Listeners for Level Selection
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentLevel = this.dataset.level;
            // Highlight selected level
            levelButtons.forEach(btn => btn.style.opacity = '0.7');
            this.style.opacity = '1';
            
            // Show player inputs after level selection
            levelSelection.style.display = 'none';
            playerInputs.style.display = 'flex';
        });
    });
    
    // Toggle Apify token input
    toggleTokenInput.addEventListener('click', function() {
        apifyTokenSection.style.display = apifyTokenSection.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Save Apify token
    saveTokenBtn.addEventListener('click', function() {
        const token = apifyTokenInput.value.trim();
        if (token) {
            localStorage.setItem('apifyToken', token);
            initApifyService();
            apifyTokenSection.style.display = 'none';
            apifyTokenInput.value = '';
            alert('Apify token saved successfully!');
        }
    });

    // Truth button event listener
    truthBtn.addEventListener('click', async function() {
        if (!players[0] || !players[1]) {
            startGame();
            return;
        }
        
        try {
            // Fetch level-specific truth content
            const levelTruths = await fetchLevelContent('truth');
            if (levelTruths.length > 0) {
                questionDisplay.textContent = getRandomItem(levelTruths);
            } else {
                questionDisplay.textContent = "No truth questions available!";
            }
        } catch (error) {
            console.error('Error fetching truth content:', error);
            // Fallback to local content
            if (truths.length > 0) {
                questionDisplay.textContent = getRandomItem(truths);
            } else {
                questionDisplay.textContent = "No truth questions available!";
            }
        }
        switchPlayer();
    });

    // Dare button event listener
    dareBtn.addEventListener('click', async function() {
        if (!players[0] || !players[1]) {
            startGame();
            return;
        }
        
        try {
            // Fetch level-specific dare content
            const levelDares = await fetchLevelContent('dare');
            if (levelDares.length > 0) {
                questionDisplay.textContent = getRandomItem(levelDares);
            } else {
                questionDisplay.textContent = "No dare challenges available!";
            }
        } catch (error) {
            console.error('Error fetching dare content:', error);
            // Fallback to local content
            if (dares.length > 0) {
                questionDisplay.textContent = getRandomItem(dares);
            } else {
                questionDisplay.textContent = "No dare challenges available!";
            }
        }
        switchPlayer();
    });

    newGameBtn.addEventListener('click', function() {
        resetGame();
    });
    
    // Initialize game with level selection
    initGameWithLevel();
    
    // Initialize Apify service
    initApifyService();
});