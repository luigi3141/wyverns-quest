// Quest system
const questTypes = {
    kill: { type: 'Kill enemies', template: 'Defeat [count] [enemy] in [location]' },
    collect: { type: 'Gather items', template: 'Collect [count] [item] from [location]' },
    explore: { type: 'Explore area', template: 'Discover [location]' }
};

class Quest {
    constructor(type, params) {
        this.type = type;
        this.params = params;
        this.progress = 0;
        this.completed = false;
        this.description = this.generateDescription();
    }

    generateDescription() {
        let template = questTypes[this.type].template;
        for (const [key, value] of Object.entries(this.params)) {
            template = template.replace(`[${key}]`, value);
        }
        return template;
    }

    updateProgress(amount = 1) {
        this.progress = Math.min(this.progress + amount, this.params.count || 1);
        this.completed = this.progress >= (this.params.count || 1);
        return this.completed;
    }

    getRewards() {
        const baseReward = {
            xp: 50,
            gold: 100
        };

        // Scale rewards based on quest parameters
        if (this.params.count) {
            baseReward.xp *= this.params.count;
            baseReward.gold *= this.params.count;
        }

        return baseReward;
    }
}

class QuestLog {
    constructor(maxActiveQuests = 5) {
        this.activeQuests = [];
        this.completedQuests = [];
        this.maxActiveQuests = maxActiveQuests;
    }

    addQuest(quest) {
        if (this.activeQuests.length >= this.maxActiveQuests) {
            console.log('Quest log full!');
            return false;
        }

        this.activeQuests.push(quest);
        return true;
    }

    completeQuest(questIndex) {
        if (questIndex >= 0 && questIndex < this.activeQuests.length) {
            const quest = this.activeQuests[questIndex];
            if (quest.completed) {
                this.completedQuests.push(quest);
                this.activeQuests.splice(questIndex, 1);
                return quest.getRewards();
            }
        }
        return null;
    }

    generateDailyQuest() {
        const types = Object.keys(questTypes);
        const type = types[Math.floor(Math.random() * types.length)];
        
        let params;
        switch (type) {
            case 'kill':
                params = {
                    count: Math.floor(Math.random() * 5) + 3,
                    enemy: ['Wolf', 'Goblin', 'Bandit'][Math.floor(Math.random() * 3)],
                    location: ['Verdant Woods', 'Dark Caves', 'Mountain Pass'][Math.floor(Math.random() * 3)]
                };
                break;
            case 'collect':
                params = {
                    count: Math.floor(Math.random() * 3) + 2,
                    item: ['Iron Ore', 'Crystal Shard', 'Herbs'][Math.floor(Math.random() * 3)],
                    location: ['Verdant Woods', 'Dark Caves', 'Mountain Pass'][Math.floor(Math.random() * 3)]
                };
                break;
            case 'explore':
                params = {
                    location: ['Ancient Ruins', 'Hidden Valley', 'Crystal Cave'][Math.floor(Math.random() * 3)]
                };
                break;
        }

        return new Quest(type, params);
    }
}

// Initialize quest log in game state if not exists
if (!gameState.questLog) {
    gameState.questLog = new QuestLog();
}

// Example quest generation (temporary for testing)
function testQuests() {
    const questLog = new QuestLog();
    
    // Generate and add a daily quest
    const dailyQuest = questLog.generateDailyQuest();
    questLog.addQuest(dailyQuest);
    
    console.log('Daily Quest:', dailyQuest);
    
    // Simulate completing the quest
    dailyQuest.updateProgress(dailyQuest.params.count || 1);
    const rewards = questLog.completeQuest(0);
    console.log('Quest Rewards:', rewards);
}
