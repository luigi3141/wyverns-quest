// Game state management
const gameState = {
    player: null,
    inventory: null,
    currentDungeon: null
};

// Save and load functionality
function saveGame() {
    const saveData = {
        player: gameState.player,
        inventory: gameState.inventory
    };
    localStorage.setItem('wyvernsQuestSave', JSON.stringify(saveData));
    console.log('Game saved successfully');
}

function loadGame() {
    const savedState = localStorage.getItem('wyvernsQuestSave');
    if (savedState) {
        const loadedData = JSON.parse(savedState);
        gameState.player = loadedData.player;
        gameState.inventory = loadedData.inventory;
        console.log('Game loaded successfully');
        return true;
    }
    return false;
}

// Initialize game
function initGame() {
    if (!loadGame()) {
        console.log('No saved game found, ready for new character creation');
    }
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
