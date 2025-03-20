import { races, classes, createCharacter } from '../scripts/character';

describe('Character Creation', () => {
    describe('Races', () => {
        test('should have all required races', () => {
            expect(races).toHaveProperty('human');
            expect(races).toHaveProperty('elf');
            expect(races).toHaveProperty('dwarf');
            expect(races).toHaveProperty('orc');
        });

        test('each race should have required properties', () => {
            Object.values(races).forEach(race => {
                expect(race).toHaveProperty('name');
                expect(race).toHaveProperty('stats');
                expect(race).toHaveProperty('bonus');
                expect(race.stats).toHaveProperty('strength');
                expect(race.stats).toHaveProperty('agility');
                expect(race.stats).toHaveProperty('intelligence');
                expect(race.stats).toHaveProperty('charisma');
            });
        });
    });

    describe('Classes', () => {
        test('should have all required classes', () => {
            expect(classes).toHaveProperty('warrior');
            expect(classes).toHaveProperty('ranger');
            expect(classes).toHaveProperty('mage');
            expect(classes).toHaveProperty('cleric');
        });

        test('each class should have required properties', () => {
            Object.values(classes).forEach(characterClass => {
                expect(characterClass).toHaveProperty('name');
                expect(characterClass).toHaveProperty('ability');
                expect(characterClass).toHaveProperty('cooldown');
                expect(characterClass).toHaveProperty('description');
                expect(characterClass).toHaveProperty('baseStats');
                expect(characterClass.baseStats).toHaveProperty('health');
                expect(characterClass.baseStats).toHaveProperty('mana');
            });
        });
    });

    describe('Character Creation', () => {
        test('should create a valid character', () => {
            const character = createCharacter('human', 'warrior');
            expect(character).toHaveProperty('race', races.human.name);
            expect(character).toHaveProperty('class', classes.warrior.name);
            expect(character).toHaveProperty('level', 1);
            expect(character).toHaveProperty('xp', 0);
            expect(character).toHaveProperty('stats');
            expect(character).toHaveProperty('abilities');
            expect(character.abilities).toHaveLength(1);
        });

        test('should return null for invalid race', () => {
            const character = createCharacter('invalid', 'warrior');
            expect(character).toBeNull();
        });

        test('should return null for invalid class', () => {
            const character = createCharacter('human', 'invalid');
            expect(character).toBeNull();
        });

        test('should calculate correct starting stats', () => {
            const character = createCharacter('human', 'warrior');
            expect(character.stats.strength).toBe(races.human.stats.strength);
            expect(character.stats.health).toBe(classes.warrior.baseStats.health);
            expect(character.stats.mana).toBe(classes.warrior.baseStats.mana);
        });
    });
});
