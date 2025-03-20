// Import game state and combat state
import { gameState } from './main.js';
import { currentCombatState, startCombat as initCombat, updateCombatUI } from './combat.js';

// Enemy definitions
export const enemies = {
    // Forest enemies (Level 1-5)
    'Wolf': {
        level: 1,
        stats: {
            health: 30,
            maxHealth: 30,
            strength: 3,
            agility: 4
        },
        xp: 20,
        gold: 5
    },
    'Bandit': {
        level: 2,
        stats: {
            health: 40,
            maxHealth: 40,
            strength: 4,
            agility: 3
        },
        xp: 25,
        gold: 10
    },
    'Giant Spider': {
        level: 3,
        stats: {
            health: 35,
            maxHealth: 35,
            strength: 5,
            agility: 5
        },
        xp: 30,
        gold: 8
    },
    // Cave enemies (Level 3-8)
    'Goblin': {
        level: 3,
        stats: {
            health: 45,
            maxHealth: 45,
            strength: 5,
            agility: 4
        },
        xp: 35,
        gold: 15
    },
    'Cave Bear': {
        level: 5,
        stats: {
            health: 60,
            maxHealth: 60,
            strength: 7,
            agility: 3
        },
        xp: 50,
        gold: 20
    },
    'Rock Elemental': {
        level: 7,
        stats: {
            health: 80,
            maxHealth: 80,
            strength: 8,
            agility: 2
        },
        xp: 70,
        gold: 30
    }
};

// Enemy types and their stats
export const enemyTypes = {
    // Forest Enemies
    wolf: {
        type: 'Wolf',
        level: 1,
        health: 30,
        maxHealth: 30,
        damage: 5,
        xp: 10,
        gold: { min: 2, max: 5 },
        loot: ['wolf_pelt', 'wolf_fang'],
        description: 'A fierce wolf with sharp fangs and glowing eyes.',
        environments: ['forest']
    },
    bear: {
        type: 'Bear',
        level: 3,
        health: 60,
        maxHealth: 60,
        damage: 12,
        xp: 25,
        gold: { min: 0, max: 2 },
        loot: ['bear_claw', 'bear_pelt'],
        description: 'A massive bear, standing tall on its hind legs.',
        environments: ['forest']
    },

    // Cave Enemies
    goblin: {
        type: 'Goblin',
        level: 2,
        health: 40,
        maxHealth: 40,
        damage: 6,
        xp: 15,
        gold: { min: 5, max: 10 },
        loot: ['crude_dagger', 'goblin_ear'],
        description: 'A small but cunning goblin wielding a crude weapon.',
        environments: ['cave']
    },
    troll: {
        type: 'Cave Troll',
        level: 5,
        health: 100,
        maxHealth: 100,
        damage: 15,
        xp: 50,
        gold: { min: 20, max: 40 },
        loot: ['troll_club', 'troll_hide'],
        description: 'A hulking cave troll with stone-like skin.',
        environments: ['cave']
    },

    // Desert Enemies
    scorpion: {
        type: 'Giant Scorpion',
        level: 2,
        health: 35,
        maxHealth: 35,
        damage: 8,
        xp: 18,
        gold: { min: 3, max: 8 },
        loot: ['scorpion_venom', 'scorpion_shell'],
        description: 'A massive scorpion with gleaming pincers.',
        environments: ['desert']
    },
    mummy: {
        type: 'Ancient Mummy',
        level: 4,
        health: 70,
        maxHealth: 70,
        damage: 10,
        xp: 35,
        gold: { min: 15, max: 30 },
        loot: ['ancient_bandages', 'cursed_amulet'],
        description: 'A shambling mummy wrapped in ancient bandages.',
        environments: ['desert']
    },

    // Swamp Enemies
    crocodile: {
        type: 'Giant Crocodile',
        level: 3,
        health: 55,
        maxHealth: 55,
        damage: 11,
        xp: 22,
        gold: { min: 0, max: 5 },
        loot: ['crocodile_skin', 'crocodile_tooth'],
        description: 'An enormous crocodile lurking in the murky water.',
        environments: ['swamp']
    },
    witch: {
        type: 'Swamp Witch',
        level: 4,
        health: 45,
        maxHealth: 45,
        damage: 14,
        xp: 40,
        gold: { min: 10, max: 25 },
        loot: ['witch_staff', 'magic_herbs'],
        description: 'A mysterious witch wielding dark swamp magic.',
        environments: ['swamp']
    },

    // Mountain Enemies
    harpy: {
        type: 'Harpy',
        level: 3,
        health: 40,
        maxHealth: 40,
        damage: 9,
        xp: 28,
        gold: { min: 8, max: 18 },
        loot: ['harpy_feather', 'sharp_talon'],
        description: 'A vicious harpy with razor-sharp talons.',
        environments: ['mountain']
    },
    yeti: {
        type: 'Yeti',
        level: 5,
        health: 90,
        maxHealth: 90,
        damage: 16,
        xp: 45,
        gold: { min: 15, max: 35 },
        loot: ['yeti_fur', 'frost_crystal'],
        description: 'A towering yeti with frost-covered fur.',
        environments: ['mountain']
    }
};

export const environments = {
    forest: {
        name: 'Forest',
        description: 'A dense forest with ancient trees and hidden dangers.',
        messages: [
            'Leaves rustle in the wind...',
            'You hear birds chirping in the distance...',
            'You spot fresh animal tracks...',
            'The forest canopy filters the sunlight...',
            'A cool breeze blows through the trees...'
        ]
    },
    cave: {
        name: 'Dark Cave',
        description: 'A network of dark caves with echoing passages.',
        messages: [
            'Water drips from stalactites...',
            'You hear distant echoes...',
            'The air is damp and cool...',
            'Your footsteps echo in the darkness...',
            'Strange mushrooms glow faintly...'
        ]
    },
    desert: {
        name: 'Desert',
        description: 'An endless expanse of sand and ancient ruins.',
        messages: [
            'Hot wind blows across the dunes...',
            'Sand shifts beneath your feet...',
            'The sun beats down mercilessly...',
            'You spot a distant mirage...',
            'Ancient stones peek through the sand...'
        ]
    },
    swamp: {
        name: 'Swamp',
        description: 'A murky swamp filled with mysterious creatures.',
        messages: [
            'Bubbles rise from the murky water...',
            'Strange lights flicker in the mist...',
            'You hear something splash nearby...',
            'The air is thick with humidity...',
            'Mysterious plants glow dimly...'
        ]
    },
    mountain: {
        name: 'Mountains',
        description: 'Treacherous mountain peaks shrouded in mist.',
        messages: [
            'The wind howls between the peaks...',
            'Loose rocks clatter down the slope...',
            'The air grows thin at this altitude...',
            'Snow begins to fall lightly...',
            'You hear an eagle cry in the distance...'
        ]
    }
};

// Area level requirements
export const areaLevels = {
    forest: 1,
    cave: 3,
    desert: 5,
    swamp: 7,
    mountain: 10
};

export function createEnemy(type) {
    const template = enemyTypes[type];
    if (!template) return null;

    return {
        ...template,
        health: template.maxHealth,
        gold: Math.floor(
            Math.random() * (template.gold.max - template.gold.min + 1) + template.gold.min
        ),
        drops: template.loot.filter(() => Math.random() < 0.3) // 30% chance for each item
    };
}

let currentEncounter = null;

export function startExploring(player, location = 'forest') {
    // Hide other screens and show exploration screen
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('exploration-screen').classList.remove('hidden');
    
    // Update location
    document.getElementById('current-location').textContent = environments[location].name;
    
    // Set up exploration loop
    exploreArea(player, location);
}

export function exploreArea(player, location) {
    const description = document.getElementById('exploration-description');
    description.textContent = 'You are exploring the area...';
    
    // 40% chance to encounter enemies while exploring
    if (Math.random() < 0.4) {
        setTimeout(() => {
            startEncounter(player, location);
        }, 1500);
    } else {
        // Random exploration message
        const messages = environments[location].messages;
        setTimeout(() => {
            description.textContent = messages[Math.floor(Math.random() * messages.length)];
        }, 1500);
    }
}

export function startEncounter(player, location = 'forest') {
    // Determine possible enemies based on location and player level
    const possibleEnemies = Object.keys(enemyTypes).filter(type => {
        const enemy = enemyTypes[type];
        return enemy.level <= player.level + 2 && enemy.level >= player.level - 1 && enemy.environments.includes(location);
    });

    // Create 1-3 enemies
    const enemyCount = Math.floor(Math.random() * 2) + 1; // 1-2 enemies
    const enemies = [];
    
    for (let i = 0; i < enemyCount; i++) {
        const enemyType = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
        enemies.push(createEnemy(enemyType));
    }

    currentEncounter = { enemies, location };

    // Show encounter screen
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('encounter-screen').classList.remove('hidden');

    // Update encounter description
    const descriptionEl = document.getElementById('encounter-description');
    if (enemies.length === 1) {
        descriptionEl.textContent = `You've encountered a ${enemies[0].type}! ${enemies[0].description}`;
    } else {
        const enemyTypes = enemies.map(e => e.type).join(' and ');
        descriptionEl.textContent = `You've encountered multiple enemies: ${enemyTypes}!`;
    }

    // Update enemy list
    const enemiesEl = document.getElementById('encounter-enemies');
    enemiesEl.innerHTML = '';
    enemies.forEach(enemy => {
        const enemyEntry = document.createElement('div');
        enemyEntry.className = 'enemy-entry';
        enemyEntry.innerHTML = `
            <span class="enemy-type">${enemy.type}</span>
            <span class="enemy-level">Level ${enemy.level}</span>
        `;
        enemiesEl.appendChild(enemyEntry);
    });
}

export function attemptFlee() {
    // 60% chance to flee successfully
    if (Math.random() < 0.6) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        document.getElementById('exploration-screen').classList.remove('hidden');
        document.getElementById('exploration-description').textContent = 
            'You successfully fled from the encounter!';
        currentEncounter = null;
    } else {
        // Failed to flee, start combat
        initCombat(gameState.player, currentEncounter.enemies);
    }
}

// Initialize encounter listeners
document.addEventListener('DOMContentLoaded', () => {
    // Area exploration buttons
    Object.keys(environments).forEach(area => {
        const button = document.getElementById(`explore-${area}-btn`);
        if (button) {
            button.addEventListener('click', () => {
                if (!gameState.player) {
                    alert('Create a character first!');
                    return;
                }

                const requiredLevel = areaLevels[area];
                if (gameState.player.level < requiredLevel) {
                    alert(`You need to be level ${requiredLevel} to explore the ${environments[area].name}!`);
                    return;
                }

                startExploring(gameState.player, area);
            });
        }
    });

    // Update area button states based on player level
    function updateAreaButtons() {
        if (!gameState.player) return;

        Object.keys(environments).forEach(area => {
            const button = document.getElementById(`explore-${area}-btn`);
            if (button) {
                const requiredLevel = areaLevels[area];
                if (gameState.player.level < requiredLevel) {
                    button.classList.add('locked');
                    button.setAttribute('data-level', `Required Level: ${requiredLevel}`);
                } else {
                    button.classList.remove('locked');
                    button.removeAttribute('data-level');
                }
            }
        });
    }

    // Call updateAreaButtons when player levels up or when game state changes
    document.addEventListener('levelUp', updateAreaButtons);
    document.addEventListener('gameStateUpdate', updateAreaButtons);

    // Engage button starts combat
    document.getElementById('engage-btn').addEventListener('click', () => {
        if (currentEncounter) {
            initCombat(gameState.player, currentEncounter.enemies);
        }
    });

    // Flee button attempts escape
    document.getElementById('flee-btn').addEventListener('click', attemptFlee);

    // Continue exploring button
    document.getElementById('continue-exploring-btn').addEventListener('click', () => {
        if (gameState.player) {
            exploreArea(gameState.player, document.getElementById('current-location').textContent.toLowerCase().replace(' ', ''));
        }
    });

    // Return to town button
    document.getElementById('return-to-town-btn').addEventListener('click', () => {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        document.getElementById('main-menu').classList.remove('hidden');
    });
});

export function startCombat(player, enemies) {
    // Hide all screens and show combat screen
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('combat-screen').classList.remove('hidden');

    // Initialize combat state
    const combatState = {
        turnOrder: [player, ...enemies].sort((a, b) => 
            (b.stats?.agility || 0) - (a.stats?.agility || 0)
        ),
        currentTurn: 0,
        round: 1,
        log: []
    };

    // Update combat UI
    currentCombatState = combatState;
    updateCombatUI();
    return combatState;
}
