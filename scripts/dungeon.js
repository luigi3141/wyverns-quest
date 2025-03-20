// Dungeon generation and management
const dungeonTypes = {
    forest: {
        name: 'Verdant Woods',
        enemies: ['Wolf', 'Bandit', 'Giant Spider'],
        minLevel: 1
    },
    cave: {
        name: 'Dark Caves',
        enemies: ['Goblin', 'Bat', 'Slime'],
        minLevel: 3
    },
    mountain: {
        name: 'Frostpeak Mountains',
        enemies: ['Ice Wyvern', 'Frost Giant', 'Snow Wolf'],
        minLevel: 5
    }
};

const enemyTypes = {
    Wolf: { health: 30, damage: 5, xp: 10 },
    Bandit: { health: 40, damage: 6, xp: 15 },
    'Giant Spider': { health: 25, damage: 8, xp: 12 },
    Goblin: { health: 20, damage: 4, xp: 8 },
    Bat: { health: 15, damage: 3, xp: 5 },
    Slime: { health: 35, damage: 3, xp: 7 },
    'Ice Wyvern': { health: 100, damage: 15, xp: 50 },
    'Frost Giant': { health: 120, damage: 20, xp: 60 },
    'Snow Wolf': { health: 45, damage: 10, xp: 25 }
};

function generateDungeon(type, playerLevel) {
    const dungeonType = dungeonTypes[type];
    if (!dungeonType || playerLevel < dungeonType.minLevel) {
        console.error('Invalid dungeon type or player level too low');
        return null;
    }

    const roomCount = Math.floor(Math.random() * 16) + 5; // 5 to 20 rooms
    const dungeon = {
        name: dungeonType.name,
        level: playerLevel,
        rooms: []
    };

    for (let i = 0; i < roomCount; i++) {
        const enemyCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 enemies
        const enemies = [];
        
        for (let j = 0; j < enemyCount; j++) {
            const enemyType = dungeonType.enemies[Math.floor(Math.random() * dungeonType.enemies.length)];
            const baseEnemy = enemyTypes[enemyType];
            
            // Scale enemy stats with dungeon level
            enemies.push({
                type: enemyType,
                health: Math.floor(baseEnemy.health * (1 + (playerLevel - 1) * 0.1)),
                maxHealth: Math.floor(baseEnemy.health * (1 + (playerLevel - 1) * 0.1)),
                damage: Math.floor(baseEnemy.damage * (1 + (playerLevel - 1) * 0.1)),
                xp: Math.floor(baseEnemy.xp * (1 + (playerLevel - 1) * 0.1))
            });
        }

        dungeon.rooms.push({
            roomNumber: i + 1,
            enemies: enemies,
            loot: generateLoot(playerLevel),
            cleared: false
        });
    }

    return dungeon;
}

function generateLoot(playerLevel) {
    const lootTable = {
        common: ['Health Potion', 'Mana Potion', 'Iron Ingot'],
        uncommon: ['Steel Ingot', 'Crystal Shard', 'Magic Scroll'],
        rare: ['Dragon Scale', 'Ancient Relic', 'Mystic Gem']
    };

    const loot = [];
    const goldAmount = Math.floor((Math.random() * 20 + 10) * playerLevel);
    loot.push({ type: 'Gold', amount: goldAmount });

    // Add random items based on player level
    const rarityRoll = Math.random();
    if (rarityRoll < 0.6) { // 60% common
        loot.push({ type: lootTable.common[Math.floor(Math.random() * lootTable.common.length)], amount: 1 });
    } else if (rarityRoll < 0.9) { // 30% uncommon
        loot.push({ type: lootTable.uncommon[Math.floor(Math.random() * lootTable.uncommon.length)], amount: 1 });
    } else { // 10% rare
        loot.push({ type: lootTable.rare[Math.floor(Math.random() * lootTable.rare.length)], amount: 1 });
    }

    return loot;
}

// Example dungeon generation (temporary for testing)
console.log('Test Dungeon:', generateDungeon('forest', 1));
