// Import game state
import { gameState, saveGame } from './main.js';
import { enemies } from './enemies.js';

// Combat state
export let currentCombatState = {
    enemy: null,
    playerTurn: true,
    round: 1
};

// Initialize combat with an enemy
export function startCombat(enemyName) {
    const enemy = enemies[enemyName];
    if (!enemy) {
        console.error(`Enemy ${enemyName} not found!`);
        return;
    }

    currentCombatState = {
        enemy: {
            name: enemyName,
            ...enemy,
            currentHealth: enemy.stats.health,
            maxHealth: enemy.stats.maxHealth
        },
        playerTurn: true,
        round: 1
    };

    updateCombatUI();
    updateCombatLog(`Combat started with ${enemyName}!`);
}

// Update the combat UI
export function updateCombatUI() {
    if (!currentCombatState.enemy) return;

    // Update enemy health
    const enemyHp = document.getElementById('enemy-hp');
    const enemyMaxHp = document.getElementById('enemy-max-hp');
    if (enemyHp) enemyHp.textContent = Math.max(0, currentCombatState.enemy.currentHealth);
    if (enemyMaxHp) enemyMaxHp.textContent = currentCombatState.enemy.maxHealth;

    // Update player health
    const playerHp = document.getElementById('player-hp');
    const playerMaxHp = document.getElementById('player-max-hp');
    if (playerHp) playerHp.textContent = Math.max(0, gameState.player.health);
    if (playerMaxHp) playerMaxHp.textContent = gameState.player.maxHealth;

    // Update round counter
    const roundCounter = document.getElementById('round-counter');
    if (roundCounter) roundCounter.textContent = `Round: ${currentCombatState.round}`;

    // Update health bars
    updateHealthBars();
}

// Update health bars
function updateHealthBars() {
    // Update enemy health bar
    const enemyHealthFill = document.querySelector('#enemy-health .health-fill');
    if (enemyHealthFill) {
        const enemyHealthPercent = Math.max(0, Math.min(100, (currentCombatState.enemy.currentHealth / currentCombatState.enemy.maxHealth) * 100));
        enemyHealthFill.style.width = `${enemyHealthPercent}%`;
    }

    // Update player health bar
    const playerHealthFill = document.querySelector('#player-health .health-fill');
    if (playerHealthFill) {
        const playerHealthPercent = Math.max(0, Math.min(100, (gameState.player.health / gameState.player.maxHealth) * 100));
        playerHealthFill.style.width = `${playerHealthPercent}%`;
    }
}

// Update combat log
function updateCombatLog(message) {
    const combatLog = document.getElementById('combat-log');
    if (combatLog) {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        combatLog.appendChild(logEntry);
        combatLog.scrollTop = combatLog.scrollHeight;
    }
}

// Player attack
export function playerAttack() {
    if (!currentCombatState.enemy || !currentCombatState.playerTurn) return;

    console.log('Player stats:', gameState.player);
    console.log('Player strength:', gameState.player.strength);
    
    const damage = Math.floor(gameState.player.strength * (Math.random() * 0.5 + 0.75));
    console.log('Calculated damage:', damage);
    
    currentCombatState.enemy.currentHealth -= damage;
    updateCombatLog(`You hit ${currentCombatState.enemy.name} for ${damage} damage!`);

    if (currentCombatState.enemy.currentHealth <= 0) {
        endCombat(true);
        return;
    }

    currentCombatState.playerTurn = false;
    updateCombatUI();
    setTimeout(enemyTurn, 1000);
}

// Enemy turn
function enemyTurn() {
    if (!currentCombatState.enemy || currentCombatState.playerTurn) return;

    const damage = Math.floor(currentCombatState.enemy.stats.strength * (Math.random() * 0.5 + 0.75));
    gameState.player.health -= damage;
    updateCombatLog(`${currentCombatState.enemy.name} hits you for ${damage} damage!`);

    if (gameState.player.health <= 0) {
        endCombat(false);
        return;
    }

    currentCombatState.playerTurn = true;
    currentCombatState.round++;
    updateCombatUI();
}

// End combat
function endCombat(victory) {
    if (victory) {
        const xpGained = currentCombatState.enemy.xp;
        const goldGained = currentCombatState.enemy.gold;
        gameState.player.xp += xpGained;
        gameState.player.gold += goldGained;
        updateCombatLog(`Victory! Gained ${xpGained} XP and ${goldGained} gold.`);

        // Check for level up
        const xpNeeded = gameState.player.level * 100;
        if (gameState.player.xp >= xpNeeded) {
            gameState.player.level++;
            gameState.player.xp -= xpNeeded;
            gameState.player.maxHealth += 10;
            gameState.player.health = gameState.player.maxHealth;
            gameState.player.strength += 2;
            updateCombatLog(`Level Up! You are now level ${gameState.player.level}!`);
        }
    } else {
        updateCombatLog('You were defeated! Returning to town...');
        gameState.player.health = Math.floor(gameState.player.maxHealth * 0.5); // Restore 50% health
    }

    // Save game state using the correct key
    saveGame(); // Use the saveGame function from main.js

    // Return to town after 2 seconds
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        document.getElementById('main-menu').classList.remove('hidden');
    }, 2000);
}

// Initialize combat buttons
export function initCombatButtons() {
    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        attackBtn.onclick = playerAttack;
    }
}

// Initialize combat listeners when the document is ready
document.addEventListener('DOMContentLoaded', initCombatButtons);
