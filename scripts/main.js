// Game state management
export const gameState = {
    player: null,
    inventory: [],
    quests: [],
    dungeons: []
};

console.log('main.js loaded, gameState:', gameState);

// Save game state
export function saveGame() {
    localStorage.setItem('wyvernQuestSave', JSON.stringify(gameState));
    console.log('Game saved:', gameState);
}

// Load game state
export function loadGame() {
    const savedState = localStorage.getItem('wyvernQuestSave');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
        console.log('Game loaded:', gameState);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js: DOM Content Loaded');
    loadGame();
});
