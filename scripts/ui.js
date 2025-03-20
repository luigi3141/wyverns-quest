// Import dependencies
import { gameState, saveGame } from './main.js';
import { races, classes, createCharacter } from './character.js';
import { startCombat as initiateCombat, initCombatButtons } from './combat.js';

console.log('UI module loaded');

// UI management
let screens = {};

// Area definitions
const areas = {
    forest: {
        name: 'Forest',
        minLevel: 1,
        maxLevel: 5,
        description: 'A dense forest teeming with wildlife and basic monsters.',
        encounters: ['Wolf', 'Bandit', 'Giant Spider']
    },
    cave: {
        name: 'Cave System',
        minLevel: 3,
        maxLevel: 8,
        description: 'Dark caves with stronger creatures and better loot.',
        encounters: ['Goblin', 'Cave Bear', 'Rock Elemental']
    },
    mountain: {
        name: 'Mountain Peak',
        minLevel: 6,
        maxLevel: 12,
        description: 'Treacherous peaks with powerful enemies.',
        encounters: ['Harpy', 'Frost Giant', 'Dragon Wyrmling']
    },
    ruins: {
        name: 'Ancient Ruins',
        minLevel: 10,
        maxLevel: 15,
        description: 'Mysterious ruins filled with undead and magical foes.',
        encounters: ['Skeleton Warrior', 'Ghost', 'Lich']
    },
    dungeon: {
        name: 'Forgotten Dungeon',
        minLevel: 15,
        maxLevel: 20,
        description: 'A challenging dungeon with the toughest enemies.',
        encounters: ['Dark Knight', 'Demon', 'Ancient Dragon']
    }
};

// Current exploration state
let currentArea = null;
let exploring = false;

// Show a specific screen
function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    
    // Hide all screens first
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Show the requested screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    } else {
        console.error(`Screen not found: ${screenId}`);
    }
}

// Update character stats display
function updateCharacterStats() {
    console.log('Updating character stats');
    const characterInfo = document.getElementById('character-info');
    const statsDisplay = document.getElementById('character-stats-display');
    
    if (!gameState.player) {
        console.error('No player character found!');
        return;
    }

    const race = races[gameState.player.race];
    const characterClass = classes[gameState.player.class];

    characterInfo.innerHTML = `
        <h3>${race.name} ${characterClass.name}</h3>
        <p>Level ${gameState.player.level}</p>
        <p>XP: ${gameState.player.xp} / ${gameState.player.xpToNext}</p>
        <p>Gold: ${gameState.player.gold}</p>
    `;

    statsDisplay.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <label>Health:</label>
                <span>${gameState.player.stats.health} / ${gameState.player.stats.maxHealth}</span>
            </div>
            <div class="stat-item">
                <label>Strength:</label>
                <span>${gameState.player.stats.strength}</span>
            </div>
            <div class="stat-item">
                <label>Agility:</label>
                <span>${gameState.player.stats.agility}</span>
            </div>
            <div class="stat-item">
                <label>Intelligence:</label>
                <span>${gameState.player.stats.intelligence}</span>
            </div>
            <div class="stat-item">
                <label>Charisma:</label>
                <span>${gameState.player.stats.charisma}</span>
            </div>
        </div>
    `;
}

// Update inventory display
function updateInventory() {
    console.log('Updating inventory');
    const inventoryDiv = document.getElementById('inventory');
    
    if (!gameState.player) {
        console.error('No player character found!');
        return;
    }

    if (gameState.player.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p>Your inventory is empty.</p>';
        return;
    }

    const itemsList = gameState.player.inventory.map(item => `
        <div class="inventory-item">
            <h4>${item.name}</h4>
            <p>${item.description || ''}</p>
        </div>
    `).join('');

    inventoryDiv.innerHTML = `
        <div class="inventory-grid">
            ${itemsList}
        </div>
    `;
}

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

    // Clear existing options
    raceSelection.innerHTML = '';
    classSelection.innerHTML = '';

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
            const character = createCharacter(selectedRace, selectedClass);
            if (character) {
                gameState.player = character;
                saveGame(); // Save immediately after character creation
                showScreen('main-menu');
                updateCharacterStats();
            }
        }
    });
}

// Initialize area buttons
function initializeAreaButtons() {
    console.log('Initializing area buttons');
    const areaContainer = document.getElementById('area-buttons');
    if (!areaContainer) {
        console.error('Area container not found!');
        return;
    }

    // Clear existing buttons
    areaContainer.innerHTML = '';

    // Create area buttons
    Object.entries(areas).forEach(([id, area]) => {
        const button = document.createElement('button');
        button.id = `explore-${id}-btn`;
        button.className = 'area-button';
        button.innerHTML = `
            <h4>${area.name}</h4>
            <p>${area.description}</p>
            <small>Level ${area.minLevel}-${area.maxLevel}</small>
        `;

        // Check if player meets level requirement
        const isLocked = !gameState.player || gameState.player.level < area.minLevel;
        if (isLocked) {
            button.disabled = true;
            button.classList.add('locked');
            if (!gameState.player) {
                button.title = 'Create a character first!';
            } else {
                button.title = `Requires level ${area.minLevel}`;
                button.innerHTML += `<div class="level-requirement">Required Level: ${area.minLevel}</div>`;
            }
        }

        button.addEventListener('click', () => {
            console.log(`Exploring ${area.name}`);
            exploreArea(id);
        });

        areaContainer.appendChild(button);
    });

    // Update button states when player is created/updated
    if (gameState.player) {
        console.log('Player level:', gameState.player.level);
        updateAreaButtonStates();
    }
}

// Update area button states based on player level
function updateAreaButtonStates() {
    if (!gameState.player) return;

    Object.entries(areas).forEach(([id, area]) => {
        const button = document.getElementById(`explore-${id}-btn`);
        if (button) {
            const isLocked = gameState.player.level < area.minLevel;
            button.disabled = isLocked;
            button.classList.toggle('locked', isLocked);
            if (isLocked) {
                button.title = `Requires level ${area.minLevel}`;
            } else {
                button.title = '';
            }
        }
    });
}

// Handle area exploration
function exploreArea(areaId) {
    const area = areas[areaId];
    if (!area) {
        console.error(`Area ${areaId} not found!`);
        return;
    }

    if (!gameState.player) {
        alert('Create a character first!');
        return;
    }

    if (gameState.player.level < area.minLevel) {
        alert(`You need to be level ${area.minLevel} to explore this area!`);
        return;
    }

    console.log(`Starting exploration in ${area.name}`);
    currentArea = area;
    exploring = true;
    
    // Update exploration screen
    const locationSpan = document.getElementById('current-location');
    const descriptionDiv = document.getElementById('exploration-description');
    
    if (locationSpan) locationSpan.textContent = area.name;
    if (descriptionDiv) {
        descriptionDiv.innerHTML = `
            <p>${area.description}</p>
            <p>Level Range: ${area.minLevel}-${area.maxLevel}</p>
            <p>Possible Encounters: ${area.encounters.join(', ')}</p>
        `;
    }

    showScreen('exploration-screen');

    // Add event listeners for exploration buttons
    const continueBtn = document.getElementById('continue-exploring-btn');
    const returnBtn = document.getElementById('return-to-town-btn');

    if (continueBtn) {
        continueBtn.onclick = () => {
            if (Math.random() < 0.7) { // 70% chance of encounter
                startEncounter();
            } else {
                // Found nothing
                descriptionDiv.innerHTML += '<p>You continue exploring but find nothing of interest...</p>';
            }
        };
    }

    if (returnBtn) {
        returnBtn.onclick = () => {
            exploring = false;
            currentArea = null;
            showScreen('main-menu');
        };
    }
}

// Start an encounter
function startEncounter() {
    if (!currentArea) return;

    const encounter = currentArea.encounters[Math.floor(Math.random() * currentArea.encounters.length)];
    const encounterDesc = document.getElementById('encounter-description');
    
    if (encounterDesc) {
        encounterDesc.innerHTML = `
            <p>You encountered a ${encounter}!</p>
            <p>What would you like to do?</p>
        `;
    }

    showScreen('encounter-screen');

    // Add event listeners for encounter buttons
    const engageBtn = document.getElementById('engage-btn');
    const fleeBtn = document.getElementById('flee-btn');

    if (engageBtn) {
        engageBtn.onclick = () => {
            startCombat(encounter);
        };
    }

    if (fleeBtn) {
        fleeBtn.onclick = () => {
            if (Math.random() < 0.7) { // 70% chance to flee
                alert('You successfully fled from the encounter!');
                showScreen('exploration-screen');
            } else {
                alert('Failed to flee! You must fight!');
                startCombat(encounter);
            }
        };
    }
}

// Start combat
function startCombat(enemyName) {
    console.log(`Starting combat with ${enemyName}`);
    showScreen('combat-screen');
    initiateCombat(enemyName);
}

// Initialize UI elements after DOM is loaded
function initUI() {
    console.log('Initializing UI...');
    
    // Initialize screens object
    document.querySelectorAll('.screen').forEach(screen => {
        screens[screen.id] = screen;
    });

    // Initialize character creation
    initializeCharacterCreation();

    // Initialize area buttons
    initializeAreaButtons();

    // Initialize combat buttons
    initCombatButtons();

    // Update UI based on game state
    if (gameState.player) {
        console.log('Player found in game state:', gameState.player);
        updateCharacterStats();
        updateAreaButtonStates();
        showScreen('main-menu');
    } else {
        console.log('No player found, showing character creation');
        showScreen('character-creation');
    }
}

// Initialize when DOM is loaded
window.addEventListener('load', () => {
    console.log('Window loaded');
    initUI();
});
