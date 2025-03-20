// Inventory and crafting system
class Inventory {
    constructor(maxSize = 50) {
        this.maxSize = maxSize;
        this.items = [];
        this.gold = 0;
    }

    addItem(item) {
        if (this.items.length >= this.maxSize) {
            console.log('Inventory full!');
            return false;
        }

        this.items.push(item);
        return true;
    }

    removeItem(itemIndex) {
        if (itemIndex >= 0 && itemIndex < this.items.length) {
            return this.items.splice(itemIndex, 1)[0];
        }
        return null;
    }

    addGold(amount) {
        this.gold += amount;
    }

    removeGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }
}

const recipes = {
    'Iron Sword': {
        materials: [
            { item: 'Iron Ingot', quantity: 2 },
            { item: 'Leather', quantity: 1 }
        ],
        result: {
            name: 'Iron Sword',
            type: 'weapon',
            damage: 10,
            value: 100
        }
    },
    'Health Potion': {
        materials: [
            { item: 'Red Herb', quantity: 2 },
            { item: 'Crystal Shard', quantity: 1 }
        ],
        result: {
            name: 'Health Potion',
            type: 'consumable',
            effect: 'heal',
            value: 50,
            power: 50
        }
    }
};

function craftItem(itemName, inventory) {
    const recipe = recipes[itemName];
    if (!recipe) {
        console.log('Recipe not found!');
        return false;
    }

    // Check if player has all materials
    const hasMaterials = recipe.materials.every(material => {
        const count = inventory.items.filter(item => item.name === material.item).length;
        return count >= material.quantity;
    });

    if (!hasMaterials) {
        console.log('Missing materials!');
        return false;
    }

    // Remove materials
    recipe.materials.forEach(material => {
        for (let i = 0; i < material.quantity; i++) {
            const itemIndex = inventory.items.findIndex(item => item.name === material.item);
            inventory.removeItem(itemIndex);
        }
    });

    // Add crafted item
    inventory.addItem(recipe.result);
    console.log(`Successfully crafted ${itemName}!`);
    return true;
}

// Initialize inventory in game state if not exists
if (!gameState.inventory) {
    gameState.inventory = new Inventory();
}

// Example crafting (temporary for testing)
function testCrafting() {
    const inventory = new Inventory();
    
    // Add materials
    inventory.addItem({ name: 'Iron Ingot', type: 'material', value: 10 });
    inventory.addItem({ name: 'Iron Ingot', type: 'material', value: 10 });
    inventory.addItem({ name: 'Leather', type: 'material', value: 5 });
    
    console.log('Before crafting:', inventory);
    craftItem('Iron Sword', inventory);
    console.log('After crafting:', inventory);
}
