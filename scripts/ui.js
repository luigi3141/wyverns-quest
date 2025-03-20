// Import dependencies
import { gameState, saveGame } from './main.js';
import { races, classes, createCharacter, updateCharacterStats } from './character.js';
import { updateInventory } from './inventory.js';

// UI management
export const screens = {
    main: document.getElementById('main-menu'),
    creation: document.getElementById('character-creation'),
    stats: document.getElementById('character-stats'),
    combat: document.getElementById('combat-screen'),
    encounter: document.getElementById('encounter-screen'),
    exploration: document.getElementById('exploration-screen'),
    inventory: document.getElementById('inventory-screen')
};

// Screen management
export function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    console.log('Available screens:', screens);
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    screens[screenId].classList.remove('hidden');
}

// Initialize character creation UI
export function initializeCharacterCreation() {
    console.log('Initializing character creation');
    const raceSelection = document.getElementById('race-selection');
    const classSelection = document.getElementById('class-selection');
    const preview = document.getElementById('character-preview');
    const createBtn = document.getElementById('create-btn');

    // Add race options
    Object.entries(races).forEach(([id, race]) => {
        const option = document.createElement('div');
        option.className = 'selection-option';
        option.innerHTML = `
            <input type="radio" name="race" value="${id}" id="race-${id}">
            <label for="race-${id}">
                <h4>${race.name}</h4>
                <p>${race.bonus || ''}</p>
            </label>
        `;
        raceSelection.appendChild(option);
    });

    // Add class options
    Object.entries(classes).forEach(([id, classData]) => {
        const option = document.createElement('div');
        option.className = 'selection-option';
        option.innerHTML = `
            <input type="radio" name="class" value="${id}" id="class-${id}">
            <label for="class-${id}">
                <h4>${classData.name}</h4>
                <p>${classData.ability || ''}</p>
            </label>
        `;
        classSelection.appendChild(option);
    });

    // Update preview when selections change
    document.querySelectorAll('input[name="race"], input[name="class"]').forEach(input => {
        input.addEventListener('change', updatePreview);
    });

    function updatePreview() {
        console.log('Updating preview');
        const selectedRace = document.querySelector('input[name="race"]:checked')?.value;
        const selectedClass = document.querySelector('input[name="class"]:checked')?.value;

        if (selectedRace && selectedClass) {
            const race = races[selectedRace];
            const classData = classes[selectedClass];
            preview.innerHTML = `
                <h3>${race.name} ${classData.name}</h3>
                <div class="preview-stats">
                    <div>Strength: ${race.stats.strength + (classData.stats.strength || 0)}</div>
                    <div>Agility: ${race.stats.agility + (classData.stats.agility || 0)}</div>
                    <div>Intelligence: ${race.stats.intelligence + (classData.stats.intelligence || 0)}</div>
                    <div>Charisma: ${race.stats.charisma + (classData.stats.charisma || 0)}</div>
                </div>
            `;
            createBtn.disabled = false;
        } else {
            preview.innerHTML = '<p>Select a race and class to see preview</p>';
            createBtn.disabled = true;
        }
    }

    // Create character button
    createBtn.addEventListener('click', () => {
        console.log('Create button clicked');
        const selectedRace = document.querySelector('input[name="race"]:checked')?.value;
        const selectedClass = document.querySelector('input[name="class"]:checked')?.value;

        if (selectedRace && selectedClass) {
            console.log('Creating character:', selectedRace, selectedClass);
            gameState.player = createCharacter(selectedRace, selectedClass);
            console.log('Character created:', gameState.player);
            saveGame();
            showScreen('main');
        }
    });
}

// Character stats display
export function updateCharacterStats() {
    if (!gameState.player) return;

    const info = document.getElementById('character-info');
    const statsDisplay = document.getElementById('character-stats-display');
    const abilities = document.getElementById('character-abilities');

    // Update basic info
    info.innerHTML = `
        <h3>${gameState.player.race} ${gameState.player.class}</h3>
        <p>Level ${gameState.player.level}</p>
        <p>XP: ${gameState.player.xp} / ${gameState.player.xpToNext}</p>
    `;

    // Update stats
    statsDisplay.innerHTML = `
        <div class="stat-item">
            <h4>Health</h4>
            <p>${gameState.player.stats.health} / ${gameState.player.stats.maxHealth}</p>
        </div>
        <div class="stat-item">
            <h4>Mana</h4>
            <p>${gameState.player.stats.mana} / ${gameState.player.stats.maxMana}</p>
        </div>
        <div class="stat-item">
            <h4>Strength</h4>
            <p>${gameState.player.stats.strength}</p>
        </div>
        <div class="stat-item">
            <h4>Agility</h4>
            <p>${gameState.player.stats.agility}</p>
        </div>
        <div class="stat-item">
            <h4>Intelligence</h4>
            <p>${gameState.player.stats.intelligence}</p>
        </div>
        <div class="stat-item">
            <h4>Charisma</h4>
            <p>${gameState.player.stats.charisma}</p>
        </div>
    `;

    // Update abilities
    abilities.innerHTML = `
        <h3>Abilities</h3>
        ${gameState.player.abilities.map(ability => `
            <div class="ability-item">
                <h4>${ability.name}</h4>
                <p>${ability.description}</p>
                <p>Cooldown: ${ability.cooldown} turns</p>
            </div>
        `).join('')}
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded in ui.js');
    
    // Initialize character creation screen
    initializeCharacterCreation();

    // Hub menu buttons
    const createCharacterBtn = document.getElementById('create-character-btn');
    console.log('Create character button:', createCharacterBtn);
    
    if (createCharacterBtn) {
        createCharacterBtn.addEventListener('click', () => {
            console.log('Create character button clicked');
            showScreen('creation');
        });
    }

    const characterBtn = document.getElementById('character-btn');
    console.log('Character button:', characterBtn);
    
    if (characterBtn) {
        characterBtn.addEventListener('click', () => {
            console.log('Character button clicked');
            if (gameState.player) {
                showScreen('stats');
                updateCharacterStats();
            } else {
                alert('Create a character first!');
            }
        });
    }

    const inventoryBtn = document.getElementById('inventory-btn');
    console.log('Inventory button:', inventoryBtn);
    
    if (inventoryBtn) {
        inventoryBtn.addEventListener('click', () => {
            console.log('Inventory button clicked');
            if (gameState.player) {
                showScreen('inventory');
                updateInventory();
            } else {
                alert('Create a character first!');
            }
        });
    }

    // Back buttons
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    console.log('Back to menu button:', backToMenuBtn);
    
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            console.log('Back to menu button clicked');
            showScreen('main');
        });
    }

    const backFromStatsBtn = document.getElementById('back-from-stats-btn');
    console.log('Back from stats button:', backFromStatsBtn);
    
    if (backFromStatsBtn) {
        backFromStatsBtn.addEventListener('click', () => {
            console.log('Back from stats button clicked');
            showScreen('main');
        });
    }

    // Show initial screen
    showScreen('main');
});

// Handle combat end
export function handleCombatEnd(state) {
    if (state.victory) {
        // Collect loot
        const loot = state.turnOrder.slice(1).reduce((items, enemy) => {
            if (enemy.drops) items.push(...enemy.drops);
            return items;
        }, []);

        // Add gold
        const gold = state.turnOrder.slice(1).reduce((total, enemy) => total + enemy.gold, 0);
        gameState.player.gold += gold;

        if (loot.length > 0) {
            if (!gameState.player.inventory) gameState.player.inventory = [];
            gameState.player.inventory.push(...loot);
            state.log.push(`Found: ${loot.join(', ')}`);
        }
        state.log.push(`Found ${gold} gold!`);

        // Show victory screen after delay
        setTimeout(() => {
            alert('Victory! You can now return to exploring.');
            document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
            document.getElementById('main-menu').classList.remove('hidden');
        }, 2000);
    } else {
        // Show defeat screen after delay
        setTimeout(() => {
            alert('You have been defeated! Returning to town...');
            document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
            document.getElementById('main-menu').classList.remove('hidden');
        }, 2000);
    }
}

// Add combat end observer
setInterval(() => {
    if (currentCombatState?.ended && !currentCombatState.processed) {
        currentCombatState.processed = true;
        handleCombatEnd(currentCombatState);
    }
}, 100);
