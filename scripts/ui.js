// Import dependencies
import { gameState, saveGame } from './main.js';
import { races, classes, createCharacter, updateCharacterStats } from './character.js';
import { updateInventory } from './inventory.js';
import { startExploring, exploreArea, attemptFlee } from './enemies.js';
import { startCombat } from './combat.js';

// UI management
let screens = {};

// Initialize UI elements after DOM is loaded
function initializeScreens() {
    console.log('Initializing screens...');
    screens = {
        main: document.getElementById('main-menu'),
        creation: document.getElementById('character-creation'),
        stats: document.getElementById('character-stats'),
        combat: document.getElementById('combat-screen'),
        encounter: document.getElementById('encounter-screen'),
        exploration: document.getElementById('exploration-screen'),
        inventory: document.getElementById('inventory-screen')
    };

    // Log found screens
    Object.entries(screens).forEach(([key, element]) => {
        console.log(`Screen '${key}': ${element ? 'Found' : 'Not found'}`);
    });
}

// Screen management
export function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    
    // Verify screens are initialized
    if (Object.keys(screens).length === 0) {
        console.warn('Screens not initialized. Initializing now...');
        initializeScreens();
    }

    // Verify requested screen exists
    if (!screens[screenId]) {
        console.error(`Screen '${screenId}' not found!`);
        return;
    }

    // Hide all screens
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.add('hidden');
            console.log(`Hiding screen: ${screen.id}`);
        }
    });

    // Show requested screen
    screens[screenId].classList.remove('hidden');
    console.log(`Showing screen: ${screens[screenId].id}`);
}

// Initialize UI
function initUI() {
    console.log('Initializing UI...');
    initializeScreens();

    // Define all button configurations
    const buttonConfigs = [
        {
            id: 'create-character-btn',
            handler: () => {
                console.log('Create character clicked');
                showScreen('creation');
            }
        },
        {
            id: 'character-btn',
            handler: () => {
                console.log('Character button clicked');
                if (gameState.player) {
                    showScreen('stats');
                    updateCharacterStats();
                } else {
                    alert('Create a character first!');
                }
            }
        },
        {
            id: 'inventory-btn',
            handler: () => {
                console.log('Inventory button clicked');
                if (gameState.player) {
                    showScreen('inventory');
                    updateInventory();
                } else {
                    alert('Create a character first!');
                }
            }
        },
        {
            id: 'back-to-menu-btn',
            handler: () => {
                console.log('Back to menu clicked');
                showScreen('main');
            }
        },
        {
            id: 'back-from-stats-btn',
            handler: () => {
                console.log('Back from stats clicked');
                showScreen('main');
            }
        },
        {
            id: 'back-from-inventory-btn',
            handler: () => {
                console.log('Back from inventory clicked');
                showScreen('main');
            }
        },
        {
            id: 'engage-btn',
            handler: () => {
                console.log('Engage clicked');
                showScreen('combat');
                startCombat(gameState.player, gameState.currentEncounter.enemies);
            }
        },
        {
            id: 'flee-btn',
            handler: () => {
                console.log('Flee clicked');
                attemptFlee();
            }
        }
    ];

    // Initialize area exploration buttons
    const areas = ['forest', 'cave', 'desert', 'swamp', 'mountain'];
    const areaLevels = { forest: 1, cave: 3, desert: 5, swamp: 7, mountain: 10 };

    areas.forEach(area => {
        buttonConfigs.push({
            id: `explore-${area}-btn`,
            handler: () => {
                console.log(`Explore ${area} clicked`);
                if (!gameState.player) {
                    alert('Create a character first!');
                    return;
                }

                if (gameState.player.level < areaLevels[area]) {
                    alert(`You need to be level ${areaLevels[area]} to explore the ${area}!`);
                    return;
                }

                startExploring(gameState.player, area);
            }
        });
    });

    // Add event listeners to all buttons
    buttonConfigs.forEach(({ id, handler }) => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Adding event listener to: ${id}`);
            button.addEventListener('click', handler);
        } else {
            console.error(`Button not found: ${id}`);
        }
    });

    // Show initial screen
    showScreen('main');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initUI();
    initializeCharacterCreation();
});

// Initialize character creation UI
function initializeCharacterCreation() {
    console.log('Initializing character creation');
    const raceSelection = document.getElementById('race-selection');
    const classSelection = document.getElementById('class-selection');
    const preview = document.getElementById('character-preview');
    const createBtn = document.getElementById('create-btn');

    if (!raceSelection || !classSelection || !preview || !createBtn) {
        console.error('Character creation elements not found!');
        return;
    }

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

// Handle combat end
export function handleCombatEnd(state) {
    if (state.victory) {
        alert('Victory! You gained experience and loot!');
    } else {
        alert('Defeat! You lost some items...');
    }
    showScreen('main');
}

// Add combat end observer
setInterval(() => {
    if (currentCombatState?.ended && !currentCombatState.processed) {
        currentCombatState.processed = true;
        handleCombatEnd(currentCombatState);
    }
}, 100);
