describe('Character Creation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('should start with no character', () => {
        cy.get('#character-btn').click();
        cy.contains('Create a character first!');
    });

    it('should allow creating a new character', () => {
        cy.get('#create-character-btn').click();
        
        // Select race
        cy.get('#race-selection .selection-option').first().click();
        cy.get('#race-selection .selection-option').first().should('have.class', 'selected');

        // Select class
        cy.get('#class-selection .selection-option').first().click();
        cy.get('#class-selection .selection-option').first().should('have.class', 'selected');

        // Check preview updates
        cy.get('#character-preview').should('contain', 'Health');
        cy.get('#character-preview').should('contain', 'Mana');

        // Create character
        cy.get('#create-btn').should('not.be.disabled');
        cy.get('#create-btn').click();

        // Verify character was created
        cy.get('#character-btn').click();
        cy.get('#character-info').should('be.visible');
        cy.get('#character-stats-display').should('be.visible');
    });

    it('should show correct character stats', () => {
        // Create a character first
        cy.get('#create-character-btn').click();
        cy.get('#race-selection .selection-option').first().click();
        cy.get('#class-selection .selection-option').first().click();
        cy.get('#create-btn').click();

        // Check stats screen
        cy.get('#character-btn').click();
        cy.get('#character-info').should('contain', 'Level 1');
        cy.get('#character-stats-display').should('contain', 'Health');
        cy.get('#character-stats-display').should('contain', 'Mana');
        cy.get('#character-stats-display').should('contain', 'Strength');
        cy.get('#character-stats-display').should('contain', 'Agility');
        cy.get('#character-stats-display').should('contain', 'Intelligence');
        cy.get('#character-stats-display').should('contain', 'Charisma');
    });
});
