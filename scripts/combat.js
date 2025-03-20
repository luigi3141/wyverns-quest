// Combat system
function calculateDamage(attacker, defender, isAbility = false) {
    let baseDamage = attacker.damage || Math.floor(attacker.stats.strength * 1.5);
    
    if (isAbility) {
        baseDamage *= 1.5; // Abilities do 50% more damage
    }

    // Add random variance (-10% to +10%)
    const variance = 0.9 + Math.random() * 0.2;
    return Math.floor(baseDamage * variance);
}

function startCombat(player, enemies) {
    const combatState = {
        turnOrder: [player, ...enemies].sort((a, b) => 
            (b.stats?.agility || 0) - (a.stats?.agility || 0)
        ),
        currentTurn: 0,
        log: []
    };

    return combatState;
}

function processTurn(combatState, action) {
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
            // XP gain handled by calling function
        } else {
            combatState.log.push('Defeat! You have been slain...');
        }
    }

    return combatState;
}

// Example combat actions (temporary for testing)
const testCombat = () => {
    const combatState = startCombat(
        gameState.player,
        [{ type: 'Wolf', health: 30, damage: 5, xp: 10 }]
    );
    console.log('Combat Started:', combatState);
    
    // Example turn
    const updatedState = processTurn(combatState, { 
        type: 'attack', 
        target: combatState.turnOrder[1] 
    });
    console.log('After Turn:', updatedState);
};
