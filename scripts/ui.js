// UI management
const screens = {
    hub: document.getElementById('hub-menu'),
    creation: document.getElementById('character-creation'),
    stats: document.getElementById('character-stats')
};

// Screen management
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screens[screenId].classList.remove('hidden');
    screens[screenId].classList.add('active');
}

// Character creation UI
function initializeCharacterCreation() {
    const raceSelection = document.getElementById('race-selection');
    const classSelection = document.getElementById('class-selection');
    const preview = document.getElementById('character-preview');
    const createBtn = document.getElementById('create-btn');
    
    let selectedRace = null;
    let selectedClass = null;

    // Populate race selection
    Object.entries(races).forEach(([id, race]) => {
        const element = document.createElement('div');
        element.className = 'selection-option';
        element.innerHTML = `
            <h4>${race.name}</h4>
            <p>${race.bonus}</p>
            <div class="stats-preview">
                STR: ${race.stats.strength} | AGI: ${race.stats.agility}<br>
                INT: ${race.stats.intelligence} | CHA: ${race.stats.charisma}
            </div>
        `;
        element.addEventListener('click', () => {
            document.querySelectorAll('#race-selection .selection-option').forEach(opt => opt.classList.remove('selected'));
            element.classList.add('selected');
            selectedRace = id;
            updatePreview();
        });
        raceSelection.appendChild(element);
    });

    // Populate class selection
    Object.entries(classes).forEach(([id, characterClass]) => {
        const element = document.createElement('div');
        element.className = 'selection-option';
        element.innerHTML = `
            <h4>${characterClass.name}</h4>
            <p>${characterClass.description}</p>
            <div class="ability-preview">
                Ability: ${characterClass.ability} (${characterClass.cooldown} turn cooldown)
            </div>
        `;
        element.addEventListener('click', () => {
            document.querySelectorAll('#class-selection .selection-option').forEach(opt => opt.classList.remove('selected'));
            element.classList.add('selected');
            selectedClass = id;
            updatePreview();
        });
        classSelection.appendChild(element);
    });

    function updatePreview() {
        if (selectedRace && selectedClass) {
            const previewChar = createCharacter(selectedRace, selectedClass);
            preview.innerHTML = `
                <h4>Character Preview</h4>
                <div class="preview-stats">
                    <p>Health: ${previewChar.stats.health}</p>
                    <p>Mana: ${previewChar.stats.mana}</p>
                    <p>Strength: ${previewChar.stats.strength}</p>
                    <p>Agility: ${previewChar.stats.agility}</p>
                    <p>Intelligence: ${previewChar.stats.intelligence}</p>
                    <p>Charisma: ${previewChar.stats.charisma}</p>
                </div>
            `;
            createBtn.disabled = false;
        }
    }

    // Create character button
    createBtn.addEventListener('click', () => {
        if (selectedRace && selectedClass) {
            gameState.player = createCharacter(selectedRace, selectedClass);
            saveGame();
            showScreen('hub');
        }
    });
}

// Character stats display
function updateCharacterStats() {
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
    // Initialize character creation screen
    initializeCharacterCreation();

    // Hub menu buttons
    document.getElementById('character-btn').addEventListener('click', () => {
        if (gameState.player) {
            updateCharacterStats();
            showScreen('stats');
        } else {
            alert('Create a character first!');
        }
    });

    document.getElementById('create-character-btn').addEventListener('click', () => {
        showScreen('creation');
    });

    // Back buttons
    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        showScreen('hub');
    });

    document.getElementById('back-from-stats-btn').addEventListener('click', () => {
        showScreen('hub');
    });

    // Show initial screen
    showScreen('hub');
});
