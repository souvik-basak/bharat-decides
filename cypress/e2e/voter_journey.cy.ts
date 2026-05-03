describe('Elite Voter Journey - Bharat Decides', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes a full educational journey from home to booth finding', () => {
    // 1. Initial Hero Interaction
    cy.contains('Every Vote Counts').should('be.visible');
    cy.contains('How to Vote').click();

    // 2. Timeline Interaction
    cy.get('#timeline').scrollIntoView();
    cy.contains('Voters Registration').should('be.visible');
    
    // Switch to Quiz Tab
    cy.get('[data-testid="quiz-tab"]').click();
    cy.contains('Registration Intelligence').should('be.visible');
    
    // Answer a question (Form 6 is the correct answer for Q1)
    cy.contains('Form 6').click();
    cy.contains('Correct!').should('be.visible');
    
    // Navigate to Stage 2
    cy.get('[data-state="active"]').contains('Analysis').click();
    cy.contains('Continue to Stage 02 →').click();
    cy.contains('Candidate Nomination').should('be.visible');

    // 3. Map Interaction
    cy.scrollTo('top');
    cy.contains('Election Map').should('be.visible');
    
    // Wait for map to load boundaries (visual check for the live pulse)
    cy.contains('Live').should('be.visible');

    // 4. Chat Assistant Flow
    cy.get('[data-testid="chat-toggle"]').click();
    cy.get('input[placeholder*="Inquire"]').should('be.visible');
    
    // Send a message
    cy.get('input').type('How do I register?{enter}');
    cy.contains('Thinking').should('be.visible');
    
    // Verify Vani responds (streaming response should eventually populate)
    cy.get('[aria-live="polite"]').should('not.be.empty');
  });

  it('verifies accessibility standards on the main journey', () => {
    // Check for main heading
    cy.get('h1').should('have.length', 1);
    
    // Check for interactive elements labels
    cy.get('button').each(($btn) => {
      // Buttons should have either text or an aria-label
      const hasText = $btn.text().trim().length > 0;
      const hasLabel = $btn.attr('aria-label') || $btn.attr('title');
      expect(hasText || hasLabel).to.be.true;
    });
  });
});
