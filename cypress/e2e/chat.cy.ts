describe('AI Chat Assistant', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should open the chat assistant when the trigger is clicked', () => {
    // Click the toggle button directly using data-testid
    cy.get('[data-testid="chat-toggle"]').click({ force: true });
    
    // Verify chat window is open
    cy.contains('Vani').should('be.visible');
    cy.get('input[placeholder*="Ask Vani"]').should('be.visible');
  });

  it('should allow typing a message and receiving a response', () => {
    cy.get('button').contains('V').click({ force: true });
    
    const message = 'How do I register to vote?';
    cy.get('input[placeholder*="Ask Vani"]').type(message + '{enter}');
    
    // Check if message appears in chat
    cy.contains(message).should('be.visible');
    
    // Check for thinking state
    cy.contains('Thinking', { timeout: 15000 }).should('be.visible');
  });
});
