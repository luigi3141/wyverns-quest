// Import game state
import { gameState } from './main.js';

// Character creation data
export const races = {
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

export const classes = {
    warrior: { 
        name: 'Warrior', 
        ability: 'Cleave', 
        stats: { strength: +2, agility: +1, intelligence: 0, charisma: 0 } 
    },
    ranger: { 
        name: 'Ranger', 
        ability: 'Quick Shot', 
        stats: { strength: 0, agility: +2, intelligence: +1, charisma: 0 } 
    },
    mage: { 
        name: 'Mage', 
        ability: 'Fireball', 
        stats: { strength: -1, agility: 0, intelligence: +3, charisma: +1 } 
    },
    cleric: { 
        name: 'Cleric', 
        ability: 'Heal', 
        stats: { strength: +1, agility: 0, intelligence: +1, charisma: +1 } 
    }
};

export function calculateXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function createCharacter(race, charClass) {
    if (!races[race] || !classes[charClass]) {
        console.error('Invalid race or class');
        return null;
    }

    const baseStats = races[race].stats;
    const classBonus = classes[charClass].stats;

    return {
        race,
        class: charClass,
        level: 1,
        xp: 0,
        xpToNext: calculateXPForLevel(2),
        gold: 50,
        stats: {
            strength: baseStats.strength + classBonus.strength,
            agility: baseStats.agility + classBonus.agility,
            intelligence: baseStats.intelligence + classBonus.intelligence,
            charisma: baseStats.charisma + classBonus.charisma,
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50
        },
        inventory: []
    };
}
