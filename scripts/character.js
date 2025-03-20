// Import game state
import { gameState } from './main.js';

// Character creation data
export const races = {
    human: {
        name: 'Human',
        bonus: 'Versatile - Balanced stats',
        stats: {
            strength: 5,
            agility: 5,
            intelligence: 5,
            charisma: 5,
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50
        }
    },
    elf: {
        name: 'Elf',
        bonus: 'Agile - High agility and intelligence',
        stats: {
            strength: 3,
            agility: 7,
            intelligence: 6,
            charisma: 4,
            health: 90,
            maxHealth: 90,
            mana: 70,
            maxMana: 70
        }
    },
    dwarf: {
        name: 'Dwarf',
        bonus: 'Hardy - High strength and health',
        stats: {
            strength: 7,
            agility: 3,
            intelligence: 4,
            charisma: 6,
            health: 120,
            maxHealth: 120,
            mana: 40,
            maxMana: 40
        }
    },
    orc: {
        name: 'Orc',
        bonus: 'Powerful - Highest strength',
        stats: {
            strength: 8,
            agility: 4,
            intelligence: 3,
            charisma: 5,
            health: 110,
            maxHealth: 110,
            mana: 30,
            maxMana: 30
        }
    }
};

export const classes = {
    warrior: {
        name: 'Warrior',
        ability: 'Berserk - Increased damage at low health',
        stats: {
            strength: 3,
            agility: 2,
            intelligence: 0,
            charisma: 0,
            health: 50,
            maxHealth: 50,
            mana: 0,
            maxMana: 0
        }
    },
    ranger: {
        name: 'Ranger',
        ability: 'Precise Shot - Critical hit chance increased',
        stats: {
            strength: 1,
            agility: 3,
            intelligence: 1,
            charisma: 0,
            health: 30,
            maxHealth: 30,
            mana: 20,
            maxMana: 20
        }
    },
    mage: {
        name: 'Mage',
        ability: 'Arcane Mastery - Spell damage increased',
        stats: {
            strength: 0,
            agility: 1,
            intelligence: 3,
            charisma: 1,
            health: 20,
            maxHealth: 20,
            mana: 60,
            maxMana: 60
        }
    },
    cleric: {
        name: 'Cleric',
        ability: 'Divine Favor - Healing spells enhanced',
        stats: {
            strength: 1,
            agility: 0,
            intelligence: 2,
            charisma: 2,
            health: 40,
            maxHealth: 40,
            mana: 40,
            maxMana: 40
        }
    }
};

// Create a new character
export function createCharacter(raceId, classId) {
    const race = races[raceId];
    const characterClass = classes[classId];
    
    if (!race || !characterClass) {
        console.error('Invalid race or class');
        return null;
    }

    // Combine base stats from race and class
    const stats = {};
    Object.keys(race.stats).forEach(stat => {
        stats[stat] = (race.stats[stat] || 0) + (characterClass.stats[stat] || 0);
    });

    // Create character object
    const character = {
        race: raceId,
        class: classId,
        level: 1,
        xp: 0,
        xpToNext: 100,
        // Copy stats directly to character and to stats object
        health: stats.health,
        maxHealth: stats.maxHealth,
        mana: stats.mana,
        maxMana: stats.maxMana,
        strength: stats.strength,
        agility: stats.agility,
        intelligence: stats.intelligence,
        charisma: stats.charisma,
        stats: stats, // Keep stats object for reference
        inventory: [],
        gold: 0
    };

    console.log('Created character:', character);
    return character;
}

export function calculateXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}