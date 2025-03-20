// Character creation and management
const races = {
    human: { 
        name: 'Human', 
        stats: { strength: 10, agility: 10, intelligence: 10, charisma: 12 }, 
        bonus: '10% better NPC trades' 
    },
    elf: { 
        name: 'Elf', 
        stats: { strength: 8, agility: 14, intelligence: 12, charisma: 10 }, 
        bonus: '10% ranged damage' 
    },
    dwarf: { 
        name: 'Dwarf', 
        stats: { strength: 12, agility: 8, intelligence: 10, charisma: 12 }, 
        bonus: '10% crafting success' 
    },
    orc: { 
        name: 'Orc', 
        stats: { strength: 14, agility: 10, intelligence: 8, charisma: 10 }, 
        bonus: '10% melee damage' 
    }
};

const classes = {
    warrior: { 
        name: 'Warrior', 
        ability: 'Cleave', 
        cooldown: 3,
        description: 'A mighty warrior skilled in close combat',
        baseStats: { health: 120, mana: 30 }
    },
    ranger: { 
        name: 'Ranger', 
        ability: 'Precision Shot', 
        cooldown: 2,
        description: 'A skilled archer and wilderness expert',
        baseStats: { health: 90, mana: 50 }
    },
    mage: { 
        name: 'Mage', 
        ability: 'Fireball', 
        cooldown: 3,
        description: 'A powerful wielder of arcane magic',
        baseStats: { health: 80, mana: 100 }
    },
    cleric: { 
        name: 'Cleric', 
        ability: 'Heal', 
        cooldown: 2,
        description: 'A divine spellcaster with healing powers',
        baseStats: { health: 100, mana: 80 }
    }
};

function calculateXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

function createCharacter(race, charClass) {
    if (!races[race] || !classes[charClass]) {
        console.error('Invalid race or class');
        return null;
    }

    const baseStats = classes[charClass].baseStats;
    const raceStats = races[race].stats;

    const character = {
        race: races[race].name,
        class: classes[charClass].name,
        level: 1,
        xp: 0,
        xpToNext: calculateXPForLevel(2),
        stats: {
            health: baseStats.health,
            maxHealth: baseStats.health,
            mana: baseStats.mana,
            maxMana: baseStats.mana,
            strength: raceStats.strength,
            agility: raceStats.agility,
            intelligence: raceStats.intelligence,
            charisma: raceStats.charisma
        },
        abilities: [{
            name: classes[charClass].ability,
            description: classes[charClass].description,
            cooldown: classes[charClass].cooldown
        }],
        racialBonus: races[race].bonus,
        inventory: [],
        gold: 100
    };

    return character;
}

// Example character creation (temporary for testing)
document.getElementById('create-character-btn')?.addEventListener('click', () => {
    const newCharacter = createCharacter('human', 'warrior');
    if (newCharacter) {
        gameState.player = newCharacter;
        console.log('New Character Created:', newCharacter);
        saveGame();
    }
});
