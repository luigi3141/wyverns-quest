// Import game state
import { gameState } from './main.js';

// Combat system
export let currentCombatState = null;

export function calculateDamage(attacker, defender, isAbility = false) {
    let baseDamage = attacker.damage || Math.floor(attacker.stats.strength * 1.5);
    
    if (isAbility) {
        baseDamage *= 1.5; // Abilities do 50% more damage
    }

    // Add random variance (-10% to +10%)
    const variance = 0.9 + Math.random() * 0.2;
    return Math.floor(baseDamage * variance);
}

export function startCombat(player, enemies) {
    const combatState = {
        turnOrder: [player, ...enemies].sort((a, b) => 
            (b.stats?.agility || 0) - (a.stats?.agility || 0)
        ),
        currentTurn: 0,
        round: 1,
        log: []
    };

    currentCombatState = combatState;
    updateCombatUI();
    return combatState;
}

export function updateCombatUI() {
    if (!currentCombatState) return;

    const player = currentCombatState.turnOrder[0];
    const enemy = currentCombatState.turnOrder[1]; // For now, just show first enemy

    // Update health bars
    const playerHealthPercent = (player.stats.health / player.stats.maxHealth) * 100;
    const playerManaPercent = (player.stats.mana / player.stats.maxMana) * 100;
    document.getElementById('player-health').style.width = `${playerHealthPercent}%`;
    document.getElementById('player-mana').style.width = `${playerManaPercent}%`;
    document.getElementById('player-health-text').textContent = 
        `${player.stats.health}/${player.stats.maxHealth}`;
    document.getElementById('player-mana-text').textContent = 
        `${player.stats.mana}/${player.stats.maxMana}`;

    const enemyHealthPercent = (enemy.health / enemy.maxHealth) * 100;
    document.getElementById('enemy-health').style.width = `${enemyHealthPercent}%`;
    document.getElementById('enemy-health-text').textContent = 
        `${enemy.health}/${enemy.maxHealth}`;

    // Update names
    document.getElementById('player-name').textContent = `${player.race} ${player.class}`;
    document.getElementById('enemy-name').textContent = enemy.type;

    // Update round counter
    document.getElementById('round-counter').textContent = currentCombatState.round;

    // Update combat log
    const logElement = document.getElementById('combat-log');
    while (logElement.firstChild) {
        logElement.removeChild(logElement.firstChild);
    }
    currentCombatState.log.slice(-5).forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        if (message.includes('damage')) messageElement.classList.add('damage');
        if (message.includes('heals')) messageElement.classList.add('heal');
        if (message.includes('effect')) messageElement.classList.add('effect');
        messageElement.textContent = message;
        logElement.appendChild(messageElement);
    });

    // Update button states
    const isPlayerTurn = currentCombatState.currentTurn % currentCombatState.turnOrder.length === 0;
    const ability = player.abilities[0];
    
    document.getElementById('attack-btn').disabled = !isPlayerTurn;
    document.getElementById('ability-btn').disabled = !isPlayerTurn || ability.currentCooldown > 0;
    document.getElementById('defend-btn').disabled = !isPlayerTurn;
    document.getElementById('item-btn').disabled = !isPlayerTurn || !player.inventory?.length;

    if (ability.currentCooldown > 0) {
        document.getElementById('ability-btn').textContent = 
            `${ability.name} (${ability.currentCooldown})`;
    } else {
        document.getElementById('ability-btn').textContent = ability.name;
    }
}

export function processTurn(combatState, action) {
    const currentActor = combatState.turnOrder[combatState.currentTurn % combatState.turnOrder.length];
    const isPlayer = currentActor === combatState.turnOrder[0];

    if (isPlayer) {
        switch (action.type) {
            case 'attack':
                const damage = calculateDamage(currentActor, action.target);
                action.target.health -= damage;
                combatState.log.push(`Player attacks ${action.target.type} for ${damage} damage!`);
                break;
            case 'ability':
                if (currentActor.abilities[0].currentCooldown === 0) {
                    const damage = calculateDamage(currentActor, action.target, true);
                    action.target.health -= damage;
                    currentActor.abilities[0].currentCooldown = currentActor.abilities[0].cooldown;
                    combatState.log.push(`Player uses ${currentActor.abilities[0].name} on ${action.target.type} for ${damage} damage!`);
                } else {
                    combatState.log.push(`${currentActor.abilities[0].name} is on cooldown for ${currentActor.abilities[0].currentCooldown} more turns!`);
                }
                break;
            case 'defend':
                currentActor.defending = true;
                combatState.log.push('Player takes defensive stance!');
                break;
            case 'item':
                if (action.item && currentActor.inventory.includes(action.item)) {
                    useItem(currentActor, action.item);
                    currentActor.inventory = currentActor.inventory.filter(i => i !== action.item);
                    combatState.log.push(`Player uses ${action.item.name}!`);
                }
                break;
        }
    } else {
        // Enemy turn
        const damage = calculateDamage(currentActor, combatState.turnOrder[0]);
        const finalDamage = combatState.turnOrder[0].defending ? Math.floor(damage / 2) : damage;
        combatState.turnOrder[0].stats.health -= finalDamage;
        combatState.log.push(`${currentActor.type} attacks player for ${finalDamage} damage!`);
    }

    // Reset defend status and decrease ability cooldowns
    if (isPlayer) {
        currentActor.defending = false;
        currentActor.abilities.forEach(ability => {
            if (ability.currentCooldown > 0) ability.currentCooldown--;
        });
    }

    // Advance turn
    combatState.currentTurn++;
    if (combatState.currentTurn % combatState.turnOrder.length === 0) {
        combatState.round++;
    }

    // Check for combat end
    const playerDead = combatState.turnOrder[0].stats.health <= 0;
    const enemiesDefeated = combatState.turnOrder.slice(1).every(enemy => enemy.health <= 0);

    if (playerDead || enemiesDefeated) {
        combatState.ended = true;
        combatState.victory = enemiesDefeated;
        
        if (enemiesDefeated) {
            const totalXP = combatState.turnOrder.slice(1)
                .reduce((sum, enemy) => sum + (enemy.xp || 0), 0);
            combatState.log.push(`Victory! Gained ${totalXP} XP!`);
            gameState.player.xp += totalXP;
            checkLevelUp();
        } else {
            combatState.log.push('Defeat! You have been slain...');
            handlePlayerDeath();
        }
    }

    updateCombatUI();
    return combatState;
}

export function initializeCombatListeners() {
    document.getElementById('attack-btn').addEventListener('click', () => {
        if (currentCombatState && !currentCombatState.ended) {
            processTurn(currentCombatState, {
                type: 'attack',
                target: currentCombatState.turnOrder[1] // Attack first enemy
            });
        }
    });

    document.getElementById('ability-btn').addEventListener('click', () => {
        if (currentCombatState && !currentCombatState.ended) {
            processTurn(currentCombatState, {
                type: 'ability',
                target: currentCombatState.turnOrder[1] // Use ability on first enemy
            });
        }
    });

    document.getElementById('defend-btn').addEventListener('click', () => {
        if (currentCombatState && !currentCombatState.ended) {
            processTurn(currentCombatState, { type: 'defend' });
        }
    });

    document.getElementById('item-btn').addEventListener('click', () => {
        const inventory = document.getElementById('combat-inventory');
        inventory.classList.toggle('active');
        if (inventory.classList.contains('active')) {
            displayCombatInventory();
        }
    });
}

export function displayCombatInventory() {
    const inventory = document.getElementById('combat-inventory');
    inventory.innerHTML = '';

    gameState.player.inventory.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'item-slot';
        slot.textContent = item.name;
        slot.addEventListener('click', () => {
            processTurn(currentCombatState, { type: 'item', item });
            inventory.classList.remove('active');
        });
        inventory.appendChild(slot);
    });
}

export function useItem(character, item) {
    switch (item.type) {
        case 'health_potion':
            const healAmount = Math.min(
                item.value,
                character.stats.maxHealth - character.stats.health
            );
            character.stats.health += healAmount;
            currentCombatState.log.push(`Restored ${healAmount} health!`);
            break;
        case 'mana_potion':
            const manaAmount = Math.min(
                item.value,
                character.stats.maxMana - character.stats.mana
            );
            character.stats.mana += manaAmount;
            currentCombatState.log.push(`Restored ${manaAmount} mana!`);
            break;
    }
}

export function checkLevelUp() {
    while (gameState.player.xp >= gameState.player.xpToNext) {
        gameState.player.level++;
        gameState.player.xp -= gameState.player.xpToNext;
        gameState.player.xpToNext = calculateXPForLevel(gameState.player.level + 1);
        
        // Increase stats
        gameState.player.stats.maxHealth += 10;
        gameState.player.stats.health = gameState.player.stats.maxHealth;
        gameState.player.stats.maxMana += 5;
        gameState.player.stats.mana = gameState.player.stats.maxMana;
        gameState.player.stats.strength += 2;
        gameState.player.stats.agility += 2;
        gameState.player.stats.intelligence += 2;
        gameState.player.stats.charisma += 1;

        currentCombatState.log.push(`Level Up! You are now level ${gameState.player.level}!`);
    }
}

export function handlePlayerDeath() {
    // Lose 80% of gold
    const goldLost = Math.floor(gameState.player.gold * 0.8);
    gameState.player.gold -= goldLost;
    
    // Restore some health
    gameState.player.stats.health = Math.floor(gameState.player.stats.maxHealth * 0.3);
    
    // Add death message
    currentCombatState.log.push(`You lost ${goldLost} gold...`);
}

// Initialize combat listeners when the document is ready
document.addEventListener('DOMContentLoaded', initializeCombatListeners);
