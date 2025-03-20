// Game state
export const gameState = {
    player: null,
    currentEncounter: null,
    inventory: [],
    quests: [],
    gold: 0
};

console.log('main.js loaded, gameState:', gameState);

// Save/Load functions
export function saveGame() {
    console.log('Saving game...');
    localStorage.setItem('wyvernQuestSave', JSON.stringify(gameState));
    console.log('Game saved:', gameState);
}

export function loadGame() {
    console.log('Loading game...');
    const savedState = localStorage.getItem('wyvernQuestSave');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
        console.log('Game loaded:', gameState);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js: DOM Content Loaded');
});

// Load saved game when available
loadGame();
